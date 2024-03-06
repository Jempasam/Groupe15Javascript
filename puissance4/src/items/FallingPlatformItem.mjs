import { Item } from "../field/Item.mjs";
import { BrokablePlatformItem } from "./BrokablePlatformItem.mjs";

export class FallingPlatformItem extends Item{
    
    constructor(){
        super()
        this.time=0
    }

    getClasses(){
        return ["falling_platform"]
    }

    onAdd(field,x,y){
        field.ticks.schedule(x,y,this)
    }

    onTick(field,x,y){
        this.time++
        if(this.time>4){
            this.time=0
            let under=field.get(x,y+1)
            if(under===null){
                field.set(x,y,null)
                field.set(x,y+1,this)
                return
            }
            else{
                field.set(x,y,new BrokablePlatformItem())
                if(under){
                    under.onTrigger(field,x,y+1)
                }
            }
        }
        else field.ticks.schedule(x,y,this)
    }
}