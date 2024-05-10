import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { isKeyPressed} from "../../../controls/Keyboard.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ObserverGroup, observers } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";
import { LIVING } from "../../model/LivingModel.mjs";

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
        this.eventid=ObserverGroup.generateName()
        for(const obj of objects){

            obj.observers(ON_COLLISION).add(this.eventid,(self,{object,hitbox,self_hitbox})=>{
                if(!targets.match(object)) return

                const living=object.get(LIVING)
                if(living)living.damage(1)

                const pushable=object.get(MOVEMENT)
                if(pushable){
                    const strength=this.damages*0.2
                    const offset=hitbox.position.subtract(self_hitbox.position)
                    offset.y=0
                    offset.normalize()
                    offset.scaleInPlace(strength)
                    accelerate(pushable.inertia, offset.x, offset.y+strength/4, offset.z, strength, strength, strength)
                }
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
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        if(this.eventid) for(const obj of objects){
            obj.observers(ON_COLLISION).remove(this.eventid)
        }
    }
}