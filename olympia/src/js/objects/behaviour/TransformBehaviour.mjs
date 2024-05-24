import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { HITBOX, HitboxModel } from "../model/HitboxModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";


export class TransformBehaviour extends Behaviour{

    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply(TRANSFORM, tf=>{
                if(tf.position._isDirty){
                    tf.position._isDirty=false
                    tf._previous_position.copyFrom(tf.position)
                }
                if(tf.rotation._isDirty){
                    tf.rotation._isDirty=false
                    tf._previous_rotation.copyFrom(tf.rotation)
                }
                if(tf.scale._isDirty){
                    tf.scale._isDirty=false
                    tf._previous_scale.copyFrom(tf.scale)
                }
            })
        }
    }

    finish(){ }

    get order() {return 100}
}