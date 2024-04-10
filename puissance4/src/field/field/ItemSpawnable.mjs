import { Item } from "../Item.mjs"

/**
 * A spawnable element, that can be placed in the item and saved in a field.
 */
export class ItemSpawnable{
    /**
     * 
     * @param {string} name 
     * @param {string} desc 
     * @param {function(number):Item} factory 
     * @param {function(number):string=} variantNames
     */
    constructor(name, desc, price, factory, variantNames=v=>"Normal"){
        this.name=name
        this.description=desc
        this.price=price
        this.factory=factory
        this.variantNames=variantNames
    }
}

/** @typedef {Object<string,ItemSpawnable>} ItemSpawnableDict */