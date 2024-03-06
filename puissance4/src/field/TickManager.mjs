import { Field } from "./Field.mjs"
import { Item } from "./Item.mjs"

export class TickManager{
    /** @type {Array.<[number,number,Item]>} */
    #scheduleds

    constructor(){
        this.#scheduleds=[]
    }

    /**
     * Schedule a tick at a position of a given item
     * @param {number} x 
     * @param {number} y 
     * @param {Item} item
     */
    schedule(x,y,item){
        this.#scheduleds.push([x,y,item])
    }

    /**
     * Clear the scheduled ticks
     */
    clear(){    
        this.#scheduleds=[]
    }

    /**
     * Iterate over the scheduled ticks
     * @param {function(number,number,Item):void} callback
     */
    forEach(callback){
        for(let [x,y,item] of this.#scheduleds){
            callback(x,y,item)
        }
    }

    /**
     * Tick all the scheduled ticks
     * @param field {Field}
     */
    tick(field){
        let current_schedule=this.#scheduleds
        this.clear()
        for(let [x,y,item] of current_schedule){
            let field_item=field.get(x,y)
            if(field_item==item)item.onTick(field,x,y)
        }
    }

}