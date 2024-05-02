import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";

export class MoblinItem extends Item{
    /**
     * 
     * @param {Item?} base 
     */
    constructor(base=null){
        super()
        this.base=base
        this.time=0
        this.dx=0
        this.dy=0
        this.duration=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="moblin ${Class.direction(this.dx,this.dy)}">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){
        field.set(x,y,this.base)
        observers(field,"on_die").notify(this,x,y)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>10){
            if(this.duration<=0){
                this.duration=Math.random()*10
                this.dx=Math.floor(Math.random()*3)-1
                this.dy=Math.floor(Math.random()*3)-1
                if(this.dx)this.dy=0
            }
            if(this.dx!=0 || this.dy!=0){
                let facing=field.get(x+this.dx,y+this.dy)
                if(facing!==null){
                    if(facing!==undefined){
                        Sounds.ITCHIK.play()
                        facing.onTrigger(field,root,x+this.dx,y+this.dy)
                        observers(field,"on_attack").notify(this, x, y, facing, x+this.dx, y+this.dy)
                    }
                    this.dx=-this.dx
                    this.dy=-this.dy
                }
                else field.swap(x,y, x+this.dx,y+this.dy)
            }
            this.duration--
            this.time=0
        }
        field.schedule(x,y,root)
    }

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
        this.base?.rotate(field, root, x, y)
    }
}