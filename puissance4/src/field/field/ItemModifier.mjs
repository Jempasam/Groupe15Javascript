import { Item } from "../Item.mjs"

/**
 * A modifier that can be applied to an item spawned in the item and that can be saved in a field. 
 */
export class ItemModifier{
    /**
     * @param {string} name
     * @param {string} desc
     * @param {function(Item,number):Item} apply
     * @param {function(number):string=} variantNames
     */
    constructor(name, desc, price, apply, variantNames=v=>"Normal"){
        this.name=name
        this.description=desc
        this.price=price
        this.apply=apply
        this.variantNames=variantNames
    }
}

/** @typedef {Object<string,ItemModifier>} ItemModifierDict */