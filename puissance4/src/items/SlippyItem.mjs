import { Item } from "../field/Item.mjs";
import { StaticCoinItem } from "./StaticCoinItem.mjs";

export class SlippyItem extends Item{
    
    constructor(base, dx, dy){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.leftdx=dy
        this.leftdy=-dx
        this.time=0
    }

    getClasses(){
        return ["slippy", ...this.base.getClasses()]
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
            if(this.tryFall(field,root,x,y,x+dx,y+dy))return
            if(this.tryFall(field,root,x,y,x+this.dx+this.leftdx ,y+this.dy+this.leftdy))return
            if(this.tryFall(field,root,x,y,x+this.dx-this.leftdx, y+this.dy-this.leftdy))return
            field.set(x,y,this.base)
        }
        else field.schedule(x,y,root)
    }

    tryFall(field,root,x,y,newx,newy){
        let under=field.get(newx,newy)
        if(under===null){
            let underder=field.get(newx+this.dx, newy+this.dy)
            if(underder){
                underder.onTrigger(field, underder, newx+this.dx, newy+this.dy)
            }
            field.set(x, y, null)
            field.set(newx, newy, root)
            return true
        }
        else return false
    }
}