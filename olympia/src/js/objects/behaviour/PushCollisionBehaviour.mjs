import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { MESH } from "../model/MeshModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { ON_COLLISION } from "./collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT } from "../model/MovementModel.mjs";
import { Ray, Vector3 } from "../../../../../babylonjs/index.js";


export class PushCollisionBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.observers(ON_COLLISION).add("PushCollisionBehaviour",(self,{self_hitbox,object,hitbox})=>{
                const movement=obj.get(MOVEMENT)
                if(movement){
                    if(hitbox.position.y+hitbox.scaling.y/2 < self_hitbox.position.y+self_hitbox.scaling.y/2){
                        const depth=hitbox.position.y+hitbox.scaling.y/2 - self_hitbox.position.y + self_hitbox.scaling.y/2
                        movement.inertia.y=Math.max(movement.inertia.y, Math.min(0.2,depth/4))
                    }
                    else{
                        const top=self_hitbox.position.clone()
                        top.addInPlaceFromFloats(0, self_hitbox.scaling.y, 0)
                        if(hitbox.intersectsPoint(top)){
                            const movement=obj.get(MOVEMENT)
                            if(movement)movement.inertia.y=-0.05
                        }
                        else{
                            const offset=hitbox.position.subtract(self_hitbox.position).asArray()
                            const ostrength=offset.map(Math.abs)
                            const maxi=ostrength.indexOf(Math.max(...ostrength))
                            const inertia=movement.inertia.asArray()
                            if(offset[maxi]<0){
                                inertia[maxi]=Math.max(0.05, -inertia[maxi], inertia[maxi])
                            }
                            else{
                                inertia[maxi]=Math.min(-0.05, -inertia[maxi], inertia[maxi])
                            }
                            movement.inertia.fromArray(inertia)
                        }
                    }
                }
            })
        }
    }

    tick(){}
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