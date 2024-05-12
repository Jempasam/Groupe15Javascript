import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";

export class MeleeAttackBehaviour extends Behaviour{

    /**
     * @param {number} acceleration 
     * @param {number} max_speed 
     * @param {number} follow_distance
     * @param {number} damages
     */
    constructor(acceleration, max_speed, follow_distance, damages){
        super()
        this.acceleration=acceleration
        this.max_speed=max_speed
        this.follow_distance=follow_distance
        this.damages=damages
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    init(world, objects, targets){
        for(const obj of objects){
            obj.set([LOCAL,this.uid],{loading:0})
            obj.observers(ON_COLLISION).add(this.uid,(self,{object,hitbox,self_hitbox})=>{
                if(!targets.match(object)) return
                if(obj.get([LOCAL,this.uid])?.loading??0 > 0) return

                const living=object.get(LIVING)
                if(living)living.damage(this.damages)

                const pushable=object.get(MOVEMENT)
                if(pushable){
                    const strength=this.damages*0.2
                    const offset=hitbox.position.subtract(self_hitbox.position)
                    offset.y=0
                    offset.normalize()
                    offset.scaleInPlace(strength)
                    accelerate(pushable.inertia, offset.x, offset.y+strength/4, offset.z, strength, strength, strength)
                }

                obj.apply([LOCAL,this.uid], m=>{ m.loading=20 })
            })

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
            const objp=obj.get(TRANSFORM); if(!objp)continue
            for(const target of targets){
                const tarp=target.get(TRANSFORM); if(!tarp)continue
                const offset=tarp.position.subtract(objp.position)
                if(offset.length()<=this.follow_distance){
                    const movement=obj.get(MOVEMENT); if(!movement)continue
                    offset.normalize()
                    offset.scaleInPlace(this.acceleration)
                    accelerate(movement.inertia, offset.x, offset.y, offset.z, this.max_speed, this.max_speed, this.max_speed)
                }
            }
            obj.apply([LOCAL,this.uid], m=>{ if(m.loading>0) m.loading-- })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([LOCAL,this.uid])
            obj.observers(ON_COLLISION).remove(this.uid)
        }
    }
}


/** @type {ModelKey<{loading:number}>} */
const LOCAL=new ModelKey("meleeattack")