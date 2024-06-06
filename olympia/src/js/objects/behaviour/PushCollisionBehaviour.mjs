import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { ON_COLLISION } from "./collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT, accelerate, accelerateX, accelerateY, accelerateZ } from "../model/MovementModel.mjs";
import {  Vector3 } from "../../../../../babylonjs/core/index.js";
import { ModelKey } from "../world/ModelHolder.mjs";


export class PushCollisionBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery?} collidables
     */
    init(world,objects,collidables){
        for(let obj of objects){
            obj.getOrSet(PUSH_COLLISION,()=>({floor_inertia:new Vector3(0,0,0), floor_time:0, floor_count:0}))
            obj.observers(ON_COLLISION).add("PushCollisionBehaviour",(self,{self_hitbox,object,hitbox})=>{
                const push_collision=self.get(PUSH_COLLISION)
                if(collidables && !collidables.match(object))return
                const movement=obj.get(MOVEMENT)
                if(movement){
                    if(
                        self_hitbox.position.y > hitbox.position.y+hitbox.scaling.y/2 &&
                        hitbox.scaling.x+hitbox.scaling.z > (self_hitbox.scaling.x+self_hitbox.scaling.z)/3
                    ){
                        const depth=(hitbox.position.y+hitbox.scaling.y/2) - (self_hitbox.position.y - self_hitbox.scaling.y/2)
                        if(depth>0)accelerateY(movement.inertia, depth/3*2, depth/3)

                        // Friction
                        if(push_collision){
                            const under=object.get(MOVEMENT)?.inertia ?? new Vector3(0,0,0)
                            push_collision.floor_inertia.addInPlace(under)
                            push_collision.floor_count++
                        }
                    }
                    else{
                        if(
                            self_hitbox.position.y < hitbox.position.y-hitbox.scaling.y/2
                        ){
                            const depth=(self_hitbox.position.y+self_hitbox.scaling.y/2) - (hitbox.position.y-hitbox.scaling.y/2)
                            if(depth>0)accelerateY(movement.inertia, -depth/6, depth/6)
                        }
                        else{
                            const offset=hitbox.position.subtract(self_hitbox.position)
                            if(Math.abs(offset.x)/hitbox.scaling.x>Math.abs(offset.z)/hitbox.scaling.z){
                                const strength=((hitbox.scaling.x+self_hitbox.scaling.x)/2-Math.abs(hitbox.position.x-self_hitbox.position.x))/4
                                if(strength>0)accelerateX(movement.inertia, strength*-Math.sign(offset.x), strength)
                            }
                            else{
                                const strength=((hitbox.scaling.z+self_hitbox.scaling.z)/2-Math.abs(hitbox.position.z-self_hitbox.position.z))/4
                                if(strength>0)accelerateZ(movement.inertia, strength*-Math.sign(offset.z), strength)
                            }
                        }
                    }
                }
            })
        }
    }
    
    /** @type {Behaviour['tick']} */
    tick(world,objects){
        for(const obj of objects){
            const push_collision=obj.get(PUSH_COLLISION)
            if(!push_collision)continue
            if(push_collision.floor_count>0){
                push_collision.floor_inertia.scaleInPlace(1/push_collision.floor_count)
                push_collision.floor_time++
                obj.apply(MOVEMENT, movement=>{
                    const inertia_offset=push_collision.floor_inertia.subtract(movement.inertia)
                    const inertia_force=inertia_offset.normalize().scale(0.005)
                    accelerate(
                        movement.inertia,
                        inertia_force.x, inertia_force.y, inertia_force.z,
                        Math.abs(inertia_offset.x), Math.abs(inertia_offset.y), Math.abs(inertia_offset.z)
                    )
                })
            }
            else push_collision.floor_time=0
            
            push_collision.floor_inertia.set(0,0,0)
            push_collision.floor_count=0
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects) obj.observers(ON_COLLISION).remove("PushCollisionBehaviour")
    }
}

/** @type {ModelKey<{floor_inertia:Vector3, floor_time:number, floor_count:number}>} */
export const PUSH_COLLISION=new ModelKey("push_collision")