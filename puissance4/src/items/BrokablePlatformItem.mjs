import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { FallingPlatformItem } from "./FallingPlatformItem.mjs";
import { on_broken } from "./events.js";

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
        observers(field, on_broken).notify({item:this,pos:[x,y]})
        Sounds.TCHI.play()
    }
}