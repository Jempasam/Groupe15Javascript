import { Quaternion, Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { TEAM, do_team_with } from "../../model/TeamModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";


/**
 * Un chaîne de tâche de déplacement à effectuer.
 */
export class FollowStraightBehaviour extends Behaviour{

    /**
     * @param {number} follow_distance
     * @param {number} acceleration
     * @param {number} max_speed
     */
    constructor(follow_distance, acceleration, max_speed){
        super()
        this.follow_distance=follow_distance
        this.acceleration=acceleration
        this.max_speed=max_speed
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.set([FOLLOW_STRAIGHT,this.uid], {target:null})
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    tick(world, objects, targets){
        for(const obj of objects){
            const follow= obj.get([FOLLOW_STRAIGHT,this.uid])
            const movement= obj.get(MOVEMENT)
            const transform= obj.get(TRANSFORM)
            if(!follow || !movement || !transform)continue

            // If near enough recalculate the target
            if( 
                follow.target===null
                || (world.age%4==0 && follow.target.subtract(transform.position).length()<1)
            ){
                for(const target of targets){
                    const target_transform=target.get(TRANSFORM)
                    if(!target_transform)continue
                    const distance=target_transform.position.subtract(transform.position).length()
                    if(distance<this.follow_distance){
                        follow.target=target_transform.position
                        break
                    }
                }
            }
            
            // Move toward the target
            const target=follow.target
            if(target===null)continue
            obj.apply(MOVEMENT, m=>{
                const offset=target.subtract(transform.position)
                const strength=offset.multiply(offset)
                const direction=Vector3.Zero()
                if(strength.x>strength.y){
                    if(strength.x>strength.z)direction.x=1
                    else direction.z=1
                }
                else{
                    if(strength.y>strength.z)direction.y=1
                    else direction.z=1
                }
                accelerate(movement.inertia,
                    direction.x*Math.sign(offset.x)*this.acceleration,
                    direction.y*Math.sign(offset.y)*this.acceleration,
                    direction.z*Math.sign(offset.z)*this.acceleration,
                    direction.x*this.max_speed,
                    direction.y*this.max_speed,
                    direction.z*this.max_speed,
                )
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([FOLLOW_STRAIGHT,this.uid])
        }
    }
}


/** @type {ModelKey<{target:Vector3?}>} */
export const FOLLOW_STRAIGHT=new ModelKey("follow_straight")