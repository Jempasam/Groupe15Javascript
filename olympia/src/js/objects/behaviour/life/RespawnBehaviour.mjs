import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_DEATH } from "./LivingBehaviour.mjs";


export class RespawnBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.apply2(TRANSFORM,LIVING, (t,l)=>{
                obj.set(RESPAWN_ANCHOR,[t.position.clone(),l.life])
            })
            obj.observers(ON_DEATH).add(this.uid,(obj)=>{
                const anchor=obj.get(RESPAWN_ANCHOR)
                if(anchor){
                    obj.apply2(TRANSFORM,LIVING, (t,l)=>{
                        t.position.copyFrom(anchor[0])
                        l.life=anchor[1]
                    })
                }
            })
        }
    }

    tick(world, objects){}
    doTick=false

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.remove(RESPAWN_ANCHOR)
            obj.observers(ON_DEATH).remove(this.uid)
        }
    }

    get order(){ return 2 }
}

/** @type {ModelKey<[Vector3,number]>} */
export const RESPAWN_ANCHOR=new ModelKey("respawn_anchor")