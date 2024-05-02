import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { on_die } from "./events";

export class GoombaItem extends Item{
    /**
     * 
     * @param {Item?} base 
     */
    constructor(base=null){
        super()
        this.base=base
        this.time=0
        this.dx=0
        this.duration=0
    }

    /**
     * @type {Item['getDisplay']}
     */
    getDisplay(...args){
        return adom/*html*/`
            <div class="goomba">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){
        field.set(x,y,this.base)
        observers(field,on_die).notify({item:this, pos:[x,y]})
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>10){
            let under=field.get(x,y+1)
            if(under===null){
                field.swap(x,y, x,y+1)
            }
            else{
                if(this.duration<=0){
                    this.duration=Math.random()*10
                    this.dx=Math.floor(Math.random()*3)-1
                }
                if(this.dx!=0){
                    let facing=field.get(x+this.dx,y)
                    if(facing!==null){
                        let over_facing=field.get(x+this.dx,y-1)
                        if(over_facing!==null){
                            this.dx=-this.dx
                        }
                        else field.swap(x,y, x+this.dx,y-1)
                    }
                    else field.swap(x,y, x+this.dx,y)
                }
            }
            this.duration--
            this.time=0
        }
        field.schedule(x,y,root)
    }
}