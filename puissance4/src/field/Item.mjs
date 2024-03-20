import { create, dom } from "../../../samlib/DOM.mjs";
import { Puissance4 } from "./Puissance4.mjs";

export class Item{
    /**
     * Get the classes to assign to the html element corresponding to this item
     * @param {Puissance4} field 
     * @param {Item} root
     * @param {number} x 
     * @param {number} y
     * @returns {Array.<string>}
     */
    getClasses(field,root,x,y){
        return ["undefined"]
    }

    /**
     * Get the html representation of this item
     * @param {Puissance4} field 
     * @param {Item} root 
     * @param {number} x 
     * @param {number} y 
     * @returns {Element}
     */
    getDisplay(field,root,x,y){
        let ret=create("div")
        this.getClasses(field,root,x,y).forEach(c=>ret.classList.add(c))
        return ret
    }

    /**
     * Called when the item is added to the field
     * @param {Puissance4} field
     * @param {Item} root 
     * @param {number} x
     * @param {number} y
     */
    onAdd(field,root,x,y){
    }

    /**
     * Called when the item is removed from the field
     * @param {Puissance4} field
     * @param {Item} root 
     * @param {number} x
     * @param {number} y
     */
    onRemove(field,root,x,y){
    }

    /**
     * Called when the item is ticked
     * @param {Puissance4} field
     * @param {Item} root 
     * @param {number} x
     * @param {number} y
     */
    onTick(field,root,x,y){
    }

    /**
     * Called when the item is triggered
     * @param {Puissance4} field
     * @param {Item} root 
     * @param {number} x
     * @param {number} y
     */
    onTrigger(field,root,x,y){
    }

    /**
     * Rotate the item by 90 degree clockwise
     * @param {Puissance4} field
     * @param {Item} root 
     * @param {number} x
     * @param {number} y
     */
    rotate(field,root,x,y){
    }
}