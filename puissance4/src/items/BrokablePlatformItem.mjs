import { Item } from "../field/Item.mjs";
import { FallingPlatformItem } from "./FallingPlatformItem.mjs";

export class BrokablePlatformItem extends Item{
    
    constructor(){
        super()
        this.time=0
    }

    getClasses(){
        return ["brokable_platform"]
    }

    onTrigger(field,x,y){
        field.set(x,y,new FallingPlatformItem())
    }
}