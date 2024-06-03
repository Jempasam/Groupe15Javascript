import { Vector3 } from "../../../../../../babylonjs/core/Maths/math.vector.js";
import { fastRemove } from "../../../../../../samlib/Array.mjs"
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs"
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { Behaviour } from "../Behaviour.mjs"
import { invocate } from "./invocations.mjs"


/**
 * Invoque des objets à intervalles réguliers.
 * Avec un nombre maximum d'objet limité.
 * Si un deuxième tag est fournit, alors les objets invoqués sont détruit si il n'y a
 * pas d'objet avec ce tag assez proche.
 */
export class SummonerBehaviour extends Behaviour{

    /**
     * 
     * @param {import("./invocations.mjs").Invocation} invocation La définition de l'objet
     * @param {number=} max_count Le nombre maximum d'objets invoqués 
     * @param {number=} interval L'intervalle entre chaque invocation
     * @param {number=} distance La distance maximale entre l'invoqueur et les objets invoqués, si les objets vont trop loins, ils sont attirés vers l'invocateur
     * @param {number=} dispawn_distance La distance maximale entre l'invoqueur et les objets du second tag avant que les objets invoqués soient détruits
     * @param {number=} max_invocation Le nombre d'objet à invoquer avant que l'invocateur disparaisse
     */
    constructor(invocation, max_count=1, interval=40, distance=6, dispawn_distance=10, max_invocation=Infinity){
        super()
        this.invocation=invocation
        this.max_count=max_count
        this.interval=interval
        this.distance=distance
        this.dispawn_distance=dispawn_distance
        this.max_invocation=max_invocation

    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects) obj.getOrSet([LOCAL,this.uid],()=>({loading:0,objects:[],invocated:0}))
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} players
     */
    tick(world, objects, players){
        for(let obj of objects){
            obj.apply2([LOCAL,this.uid],TRANSFORM, (summoner,tf)=>{
                summoner.loading++
                if(summoner.invocated>=this.max_invocation && summoner.objects.length<=0){
                    summoner.invocated=-20
                }
                else if(summoner.invocated<0){
                    tf.scale.scaleInPlace(0.9)
                    if(summoner.invocated==-1)obj.kill()
                    else summoner.invocated++
                }
                if(summoner.loading>this.interval){
                    summoner.loading=0
                    
                    // Remove dead ones from list
                    for(let i=summoner.objects.length-1; i>=0; i--){
                        if(!summoner.objects[i].alive)fastRemove(summoner.objects,i)
                    }

                    // Summon
                    if(summoner.invocated<this.max_invocation && summoner.objects.length<this.max_count){
                        const invoked=invocate(world, obj, this.invocation,
                            new TransformModel({position:tf.position})
                        )
                        invoked.apply(TRANSFORM, tfnew=>{
                            tfnew.position.addInPlaceFromFloats(0,(tf.scale.y+tfnew.scale.y)/2,0)
                        })
                        obj.apply(MOVEMENT, mv=>mv.inertia.y+=0.2)
                        summoner.objects.push(invoked)
                        summoner.invocated++
                    }

                    // Kill everybody if players is too far away
                    if(players){
                        let mindistance=Number.MAX_VALUE
                        for(const player of players)player.apply(TRANSFORM,ptf=>{
                            const distance=ptf.position.subtract(tf.position).length()
                            mindistance=Math.min(mindistance,distance)
                        })

                        if(mindistance>this.dispawn_distance){
                            for(const obj of summoner.objects) obj.kill()
                            summoner.objects.length=0
                        }
                    }
                }

                // Attract
                for(const obj of summoner.objects){
                    obj.apply2(TRANSFORM, MOVEMENT, (ttf,tmv)=>{
                        const offset=tf.position.subtract(ttf.position)
                        if(offset.length()>this.distance){
                            const d=offset.multiplyInPlace(new Vector3(1,0,1)).normalize().scaleInPlace(0.2)
                            accelerate(tmv.inertia, d.x,d.y,d.z, Math.abs(d.x), Math.abs(d.y), Math.abs(d.z))
                        }
                        if(offset.length()>this.distance*1.5){
                            obj.kill()
                        }
                    })
                }
            })
        }
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects) obj.remove([LOCAL,this.uid])
    }
}

/** @type {ModelKey<{loading:number, objects:GameObject[], invocated:number}>} */
const LOCAL=new ModelKey("local")