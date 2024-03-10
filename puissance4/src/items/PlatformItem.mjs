import { Item } from "../field/Item.mjs";

export class PlatformItem extends Item{
    
    constructor(){
        super()
    }

    getClasses(){
        return ["platform"]
    }
}