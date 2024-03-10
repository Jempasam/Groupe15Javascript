import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"

export class MixItem extends Item{
    
    constructor(...components){
        super()
        this.components=components
    }

    getClasses(){
        let ret=[]
        for(let c of this.components){
            ret=[...ret, ...c.getClasses()]
        }
        return ret
    }

    onAdd(field,root,x,y){
        for(let c of this.components){
            c.onAdd(field,root,x,y)
        }
    }

    onRemove(field,root,x,y){
        for(let c of this.components){
            c.onRemove(field,root,x,y)
        }
    }

    onTrigger(field,root,x,y){
        for(let c of this.components){
            c.onTrigger(field,root,x,y)
        }
    }

    onTick(field,root,x,y){
        for(let c of this.components){
            c.onTick(field,root,x,y)
        }
    }
}