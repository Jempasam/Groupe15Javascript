import { Item } from "../field/Item.mjs";

export class FruitItem extends Item{
    
    constructor(){
        super()
    }

    onTrigger(field, root, x, y){
        field.set(x,y,null)
    }

    getClasses(){
        return ["fruit"]
    }

    isComestible=true
}