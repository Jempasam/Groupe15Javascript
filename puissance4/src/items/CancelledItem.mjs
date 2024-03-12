import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"

export class CancelledItem extends Item{
    
    constructor(base, duration){
        super()
        this.base=base
        this.time=duration
    }

    getClasses(...args){
        return [...this.base.getClasses(...args),"cancelled"]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time--
        if(this.time<0){
            field.set(x,y,this.base)
        }
        else field.schedule(x,y,root)
    }
}