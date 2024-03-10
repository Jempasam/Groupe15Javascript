import { Puissance4 } from "./Puissance4.mjs";

export class Item{
    /**
     * Get the classes to assign to the html element corresponding to this item
     * @param {Puissance4} field 
     * @param {number} x 
     * @param {number} y
     * @returns {Array.<string>}
     */
    getClasses(field,root,x,y){
        return ["undefined"]
    }

    /**
     * Called when the item is added to the field
     * @param {Puissance4} field
     * @param {number} x
     * @param {number} y
     */
    onAdd(field,root,x,y){
    }

    /**
     * Called when the item is removed from the field
     * @param {Puissance4} field
     * @param {number} x
     * @param {number} y
     */
    onRemove(field,root,x,y){
    }

    /**
     * Called when the item is ticked
     * @param {Puissance4} field
     * @param {number} x
     * @param {number} y
     */
    onTick(field,root,x,y){
    }

    /**
     * Called when the item is triggered
     * @param {Puissance4} field
     * @param {number} x
     * @param {number} y
     */
    onTrigger(field,root,x,y){
    }
}