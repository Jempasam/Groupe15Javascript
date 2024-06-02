import { adom, html } from "../../../../../../samlib/DOM.mjs";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { MessageManager } from "../../../messages/MessageManager.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { DOCUMENT } from "../InventoryBehaviour.mjs";
import { MESSAGE } from "../interaction/HintBehaviour.mjs";
import { ON_LIVE_CHANGE } from "./LivingBehaviour.mjs";


export class LifeMessageBehaviour extends Behaviour{

    /**
     * @override
     * @type {Behaviour['init']}
     */
    init(world,objects){
        const messages=world.model.get(MESSAGE)
        if(!messages)return
        for(let obj of objects){
            const slot="life_"+obj.id
            const count=obj.get(LIVING)?.life ?? 0
            messages.send(count+"❤️", MessageManager.FOREVER, slot)
            obj.set(LIFE_MESSAGE,{slot})
            obj.observers(ON_LIVE_CHANGE).add(this.uid,(obj,{affected})=>{
                affected.apply(LIVING,living=>messages.send(living.life+"❤️", MessageManager.FOREVER, slot))
            })
        }
    }

    doTick=false

    /**
     * @override
     * @type {Behaviour['finish']}
     */
    finish(world,objects){
        const messages=world.model.get(MESSAGE)
        if(!messages)return
        for(let obj of objects){
            obj.apply(LIFE_MESSAGE, life_message => messages.clear(life_message.slot))
            obj.remove(LIFE_MESSAGE)
            obj.observers(ON_LIVE_CHANGE).remove(this.uid)
        }
    }
}

/** @type {ModelKey<{slot:string}>} */
export const LIFE_MESSAGE=new ModelKey("life_message")