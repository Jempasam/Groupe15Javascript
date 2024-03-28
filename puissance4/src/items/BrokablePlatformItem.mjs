import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { FallingPlatformItem } from "./FallingPlatformItem.mjs";

export class BrokablePlatformItem extends Item{
    
    constructor(){
        super()
        this.time=0
    }

    getClasses(){
        return ["brokable_platform"]
    }

    onTrigger(field,root,x,y){
        field.set(x,y,new FallingPlatformItem())
        observers(field,"on_broken").notify(this,x,y)
        Sounds.TCHI.play()
    }
}