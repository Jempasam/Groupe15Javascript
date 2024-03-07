import { Field } from "./Field.mjs"
import { Item } from "./Item.mjs"

export class TickManager{
    /** @type {Map<[number,number],Item>} */
    #scheduleds

    constructor(){
        this.#scheduleds=new Map()
    }

    /**
     * Schedule a tick at a position of a given item
     * @param {number} x 
     * @param {number} y 
     * @param {Item} item
     */
    schedule(x,y,item){
        this.#scheduleds.set([x,y],item)
    }

    /**
     * Clear the scheduled ticks
     */
    clear(){    
        this.#scheduleds.clear()
    }

    /**
     * Iterate over the scheduled ticks
     * @param {function(number,number,Item):void} callback
     */
    forEach(callback){
        for(let [[x,y],item] of this.#scheduleds){
            callback(x,y,item)
        }
    }

    /**
     * Tick all the scheduled ticks
     * @param field {Field}
     */
    tick(field){
        let current_schedule=new Map(this.#scheduleds)
        this.clear()
        for(let [[x,y],item] of current_schedule){
            let field_item=field.get(x,y)
            if(field_item==item)item.onTick(field,item,x,y)
        }
    }

}