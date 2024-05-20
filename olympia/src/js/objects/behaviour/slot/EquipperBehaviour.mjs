import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs"
import { giveEquip } from "../../model/SlotModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { CollectableBehaviour } from "../generic/CollectableBehaviour.mjs"


export class EquipperBehaviour extends CollectableBehaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} given Les tags donnés.
     * @param {ConstructorParameters<typeof CollectableBehaviour>[0] & {slot?:string}=} options
     */
    constructor(given, options={}){
        super()
        this.given=given
        this.slot=options.slot
    }

    /** @type {CollectableBehaviour['on_collection']} */
    on_collection(collectable, collecter, world, ...queries){
        giveEquip(collecter,this.given,this.slot)
        collectable.observers(ON_EQUIP).notify({equipped:collecter, equipper:this})
        collecter.observers(ON_EQUIPPED).notify({giver:collectable, equipper:this})
        return true
    }

}


/** @type {ModelKey<{equippedTime:number, remaining_use:number, reloading:number}>} */
export const EQUIPPER=new ModelKey("equipper")

/** @type {ObserverKey<{equipped:GameObject, equipper:EquipperBehaviour}>} */
export const ON_EQUIP=new ObserverKey("onEquip")

/** @type {ObserverKey<{giver:GameObject, equipper:EquipperBehaviour}>} */
export const ON_EQUIPPED=new ObserverKey("onEquipped")