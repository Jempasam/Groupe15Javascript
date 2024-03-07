import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"

export class CancelledItem extends Item{
    
    constructor(base, duration){
        super()
        this.base=base
        this.time=duration
    }

    getClasses(){
        return [...this.base.getClasses(),"cancelled"]
    }

    onAdd(field,root,x,y){
        field.ticks.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time--
        if(this.time<0){
            field.set(x,y,this.base)
        }
        else field.ticks.schedule(x,y,root)
    }
}