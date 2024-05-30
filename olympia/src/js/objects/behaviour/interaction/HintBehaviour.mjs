import { MessageManager } from "../../../messages/MessageManager.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { CollectableBehaviour } from "../generic/CollectableBehaviour.mjs";


/** @type {ModelKey<MessageManager>} */
export const MESSAGE=new ModelKey("message");

export class HintBehaviour extends CollectableBehaviour{

    /**
     * @param {string} message
     * @param {string} message_slot
     */
    constructor(message, message_slot){
        super()
        this.message=message
        this.message_slot=message_slot
    }

    /** @type {CollectableBehaviour['on_collection']} */
    on_collection(collectable, collecter, data, world){
        world.model.get(MESSAGE)?.send(this.message, 5000, this.message_slot)
        return true
    }
}