import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Methods } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { on_destroy } from "./events";

export class MeteorItem extends Item{
    
    constructor(base, dx, dy){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="meteor">
                ${this.base?.getDisplay(...args)}
            </div>
        `
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
                    field.set(x+dx*2, y+dy*2, null)
                    field.set(x+dx, y+dy, new MovingItem(this.base, dx, dy))
                    field.set(x, y, null)
                    Sounds.TOP.play()
                    observers(field,on_destroy).notify({pos:[x+dx,y+dy], item:this, destroyed:underder, destroyed_pos:[x+dx*2, y+dy*2]})
                }
                else{
                    field.swap(x,y, x+dx,y+dy)
                }
                return
            }
            else{
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