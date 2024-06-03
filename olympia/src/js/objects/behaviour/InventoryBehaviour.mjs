import { MOVEMENT, MovementModel } from "../model/MovementModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/Maths/math.vector.js";
import { TRANSFORM } from "../model/TransformModel.mjs";
import { eatKeyPress, isKeyPressed} from "../../controls/Keyboard.mjs"
import { ModelKey } from "../world/ModelHolder.mjs";
import { adom } from "../../../../../samlib/DOM.mjs";
import { giveEquip, removeEquip } from "../model/SlotModel.mjs";

/**
 * @typedef {{name:string, image:string, tags:import("../world/TaggedDict.mjs").Tag[], slot:string}} Item
 * @typedef {{[key:string]:Item}} Inventory 
 */

/** @type {ModelKey<Element>} */
export const DOCUMENT=new ModelKey("document")


export class InventoryBehaviour extends Behaviour{

    /**
     * @param {Inventory} inventory
     */
    constructor(inventory){
        super()
        this.inventory=inventory
    }

    /** @type {{[key:string]:string}} */
    selected={}

    /** @type {{[key:string]:string}} */
    previous={}

    /** @override @type {Behaviour['open']} */
    open(world){
        const document=world.model.get(DOCUMENT)
        if(document){
            this.element=document.appendChild(adom/*html*/`
                <div class="olympia-inventory hidden">
                </div>
            `)

            // Put into slots
            const slotToItems={}
            for(let [name,item] of Object.entries(this.inventory)){
                const slotobj=slotToItems[item.slot]??={}
                slotobj[name]=item
            }

            // Generate Display
            for(let [slot,items] of Object.entries(slotToItems)){
                const slotelement=this.element.appendChild(adom/*html*/`<div slot="${slot}"></div>`)
                for(let [id,item] of Object.entries(items)){
                    slotelement.appendChild(adom/*html*/`
                        <div item=${id} class="item-name-${id}">
                            <h3>${item.name}</h3>
                            <span>${item.image}</span>
                        </div>
                    `).addEventListener("click",()=>{
                        this.select(id)
                    })
                }
            }
        }
    }

    /** @param {string} id  */
    select(id){
        const item=this.inventory[id]
        this.unselect(item.slot)
        this.element?.querySelector(`.item-name-${id}`)?.classList.add("selected")
        this.selected[item.slot]=id
    }

    /** @param {string} slot  */
    unselect(slot){
        const selected=this.selected[slot]
        delete this.selected[slot]
        if(selected!=null)this.element?.querySelector(`.item-name-${selected}`)?.classList.remove("selected")
    }

    init(world, objects){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        // Show/Hide
        if(eatKeyPress("KeyR")){
            this.element?.classList.toggle("hidden")
        }

        // Get what to add, what to remove
        let toRemove=[]
        let toAdd=[]
        for(const slot of [...Object.keys(this.previous),...Object.keys(this.selected)]){
            if(this.previous[slot]!=this.selected[slot]){
                if(this.previous[slot])toRemove.push(this.inventory[this.previous[slot]])
                if(this.selected[slot])toAdd.push(this.inventory[this.selected[slot]])
            }
            this.previous[slot]=this.selected[slot]
        }
        
        // Apply Changes
        if(toRemove.length || toAdd.length){
            for(const object of objects){
                for(const toRemoveItem of toRemove) removeEquip(object, toRemoveItem.slot)
                for(const toAddItem of toAdd) giveEquip(object, toAddItem.tags, toAddItem.slot)
            }
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const slot of Object.keys(this.selected)){
            for(const object of objects){
                removeEquip(object, slot)
            }
        }
    }

    close(){
        this.element?.remove()
    }
}