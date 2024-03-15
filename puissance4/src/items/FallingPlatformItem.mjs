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

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>4){
            this.time=0
            let under=field.get(x,y+1)
            if(under===null){
                field.swap(x,y,x,y+1)
                return
            }
            else{
                field.set(x,y,new BrokablePlatformItem())
                if(under){
                    under.onTrigger(field,under,x,y+1)
                }
            }
        }
        else field.schedule(x,y,root)
    }
}