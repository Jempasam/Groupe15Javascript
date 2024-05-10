import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { HITBOX, HitboxModel } from "../../model/HitboxModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { ObserverKey, observers } from "../../../../../../samlib/observers/ObserverGroup.mjs";


export class LivingBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.getOrSet(LIVING,()=>new LivingModel())
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            const living=obj.get(LIVING)
            if(living){
                if(living.life!=living._previous_life){
                    obj.observers(ON_LIVE_CHANGE).notify(living.life-living._previous_life)
                    if(living.life<=0){
                        obj.observers(ON_DEATH).notify()
                        if(living.life<=0)world.remove(obj)
                    }
                    living._previous_life=living.life
                }
            }
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.remove(LIVING)
        }
    }
}

/** @type {ObserverKey<number>} */
export const ON_LIVE_CHANGE=new ObserverKey("on_live_change")

/** @type {ObserverKey<void>} */
export const ON_DEATH=new ObserverKey("on_death")