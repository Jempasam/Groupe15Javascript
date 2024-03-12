import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";

export class MovingItem extends Item{
    
    constructor(base, dx, dy){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
    }

    getClasses(...args){
        return ["moving", ...this.base.getClasses(...args)]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>5){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            if(under===null){
                let underder=field.get(x+dx*2, y+dy*2)
                if(underder){
                    underder.onTrigger(field, underder, x+dx*2, y+dy*2)
                }
                field.swap(x,y, x+dx,y+dy)
                return
            }
            else{
                field.set(x,y,this.base)
            }
        }
        else field.schedule(x,y,root)
    }
}