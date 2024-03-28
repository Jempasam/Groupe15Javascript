import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Methods } from "./ItemUtils.mjs";

export class MovingItem extends Item{
    
    constructor(base, dx, dy){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
    }

    getDisplay(...args){
        let ret= this.base.getDisplay(...args)
        ret.classList.add("moving")
        return ret
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
                Sounds.TOP.play()
                field.set(x,y,this.base)
            }
        }
        else field.schedule(x,y,root)
    }

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
        this.base.rotate(field, root, x, y)
    }
}