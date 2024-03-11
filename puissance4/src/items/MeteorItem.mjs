import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class MeteorItem extends Item{
    
    constructor(base, dx, dy){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
    }

    getClasses(...args){
        return ["meteor", ...this.base.getClasses(...args)]
    }

    onAdd(field,root,x,y){
        console.log("aa")
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
                    field.set(x+dx*2, y+dy*2, null)
                    field.set(x+dx, y+dy, new MovingItem(this.base, dx, dy))
                }
                else{
                    field.set(x+dx, y+dy, root)

                }
                field.set(x, y, null)
                return
            }
            else{
                field.set(x,y,this.base)
            }
        }
        else field.schedule(x,y,root)
    }
}