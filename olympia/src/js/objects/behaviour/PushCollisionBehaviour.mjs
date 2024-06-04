import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { ON_COLLISION } from "./collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT, accelerate, accelerateX, accelerateY, accelerateZ } from "../model/MovementModel.mjs";
import {  Vector3 } from "../../../../../babylonjs/core/index.js";


export class PushCollisionBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery?} collidables
     */
    init(world,objects,collidables){
        for(let obj of objects){
            obj.observers(ON_COLLISION).add("PushCollisionBehaviour",(self,{self_hitbox,object,hitbox})=>{
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
                        const under=object.get(MOVEMENT)?.inertia ?? new Vector3(0,0,0)
                        if(under){
                            //movement.inertia.multiplyInPlace(new Vector3(0.98,0.98,0.98))
                            const inertia_offset=under.subtract(movement.inertia)
                            const inertia_force=inertia_offset.normalize().scale(0.005)
                            accelerate(
                                movement.inertia,
                                inertia_force.x, inertia_force.y, inertia_force.z,
                                Math.abs(inertia_offset.x), Math.abs(inertia_offset.y), Math.abs(inertia_offset.z)
                            )
                            /*accelerate(
                                movement.inertia, 
                                Math.sign(under.inertia.x)*0.01, Math.sign(under.inertia.y)*0.01, Math.sign(under.inertia.z)*0.01,
                                Math.abs(under.inertia.x), Math.abs(under.inertia.y), Math.abs(under.inertia.z)
                            )*/
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

    doTick=false
    
    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects) obj.observers(ON_COLLISION).remove("PushCollisionBehaviour")
    }
}