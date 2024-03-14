import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"

export class EffectItem extends Item{
    
    constructor(base, temporary, duration){
        super()
        this.base=base
        this.temporary=temporary
        this.time=duration
    }

    getClasses(...args){
        return [...this.base.getClasses(...args), ...this.temporary.getClasses(...args)]
    }
    
    onAdd(field,root,x,y){
        this.temporary.onAdd(field,root,x,y)
    }

    onRemove(field,root,x,y){
        this.temporary.onRemove(field,root,x,y)
    }

    onTrigger(field,root,x,y){
        this.temporary.onTrigger(field,root,x,y)
    }

    onTick(field,root,x,y){
        this.time--
        if(this.time<0){
            field.set(x,y,this.base)
        }
        this.temporary.onTick(field,root,x,y)
        field.schedule(x,y,root)
    }
}