import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, MovementModel, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { TEAM } from "../../model/TeamModel.mjs";

/**
 * Fait tirer un objet lors de l'appui sur une touche
 */
export class PlayerShootBehaviour extends Behaviour{

    /**
     * @param {string} key La touche à presser pour tirer
     * @param {import("../../world/TaggedDict.mjs").Tag[]} tags Les tags à donner aux projectiles
     * @param {object} param0
     * @param {number=} param0.strength La force du tir
     * @param {number=} param0.reloading_time Le temps de rechargement
     * @param {Vector3=} param0.size La taille des projectiles
     * @param {number=} param0.shoot_count Le nombre de projectiles tirable à chaque rechargement
     * @param {number=} param0.cadency La cadence de tir
     * @param {number=} param0.knockback Le recul infligé au tireur
     * @param {boolean=} param0.doCopyTeam Si vrai, les projectiles tirés auront la même équipe que le tireur
     */
    constructor(key, tags, {strength=0.1, reloading_time=40, size=Vector3.One(), shoot_count=1, cadency=20, knockback=1, doCopyTeam=true}={}){
        super()
        this.key=key
        this.strength=strength
        this.reloading_time=reloading_time
        this.tags=tags
        this.size=size
        this.shoot_count=shoot_count
        this.cadency=cadency
        this.knockback=knockback
        this.doCopyTeam=doCopyTeam
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.getOrSet(SHOOTING,()=>({reloading:0, cooldown:0, munition:this.shoot_count}))
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const shooting=obj.get(SHOOTING); if(!shooting)continue
            const transform=obj.get(TRANSFORM) ?? new TransformModel({})
            if(shooting.cooldown<=0){
                if(isKeyPressed(this.key) && shooting.munition>0){
                    obj.apply2(MOVEMENT, TRANSFORM, (move,tf)=>{
                        const direction=move.inertia.clone()
                        direction.y=0
                        direction.normalize()
                        const knockback=direction.clone().scale(-this.knockback)
                        const inertia=direction.scale(this.strength)

                        accelerateX(move.inertia, knockback.x*2, Math.abs(knockback.x))
                        accelerateZ(move.inertia, knockback.z*2, Math.abs(knockback.z))
                        
                        const bullet_location=transform.position.clone().addInPlaceFromFloats(
                            (tf.scale.x/2+this.size.x/2)*direction.x,
                            0,
                            (tf.scale.z/2+this.size.z/2)*direction.z,
                        )

                        const proj=world.add(
                            this.tags,
                            new TransformModel({position:bullet_location, scale:this.size.clone(), rotation:tf.rotation.clone()}),
                            [MOVEMENT,new MovementModel(inertia)],
                        )
                        if(this.doCopyTeam)obj.apply(TEAM, team=>proj.set(TEAM,team))
                    })
                    shooting.cooldown=this.cadency
                    shooting.reloading=this.reloading_time
                    shooting.munition--
                }
            }
            else shooting.cooldown--
            
            if(shooting.reloading==0)shooting.munition=this.shoot_count
            if(shooting.reloading>=0)shooting.reloading--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            obj.remove(SHOOTING)
        }
    }
}


/** @type {ModelKey<{reloading:number, cooldown:number, munition:number}>} */
export const SHOOTING=new ModelKey("shoot")