import { adom } from "../../../samlib/DOM.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class OctorokItem extends Item{
    /**
     * 
     * @param {function():Item} factory 
     */
    constructor(factory){
        super()
        this.base=factory()
        this.factory=factory
        this.time=0
        this.dx=0
        this.dy=0
        this.duration=0
        this.shooting_time=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="octorok ${Class.direction(this.dx,this.dy)} ${this.shooting_time>0?"_shooting":""}">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){
        field.set(x,y,this.base)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>20){
            if(this.shooting_time>0){
                this.shooting_time--
                if(this.shooting_time==0)field.updateElement(x,y)
            }
            else if(this.duration<=0){
                this.duration=Math.random()*8
                this.dx=Math.floor(Math.random()*3)-1
                this.dy=Math.floor(Math.random()*3)-1
                if(this.dx)this.dy=0

                if(this.dx!=0 || this.dy!=0){
                    let already=field.get(x-this.dx,y-this.dy)
                    if(already!==undefined){
                        field.set(x-this.dx,y-+this.dy,new MovingItem(this.base,-this.dx,-this.dy))
                        Sounds.POP.play()
                        if(already===null)this.base=this.factory()
                        else this.base=already
                        this.shooting_time=1
                    }
                }
                field.updateElement(x,y)
            }
            else if(this.dx!=0 || this.dy!=0){
                let facing=field.get(x+this.dx,y+this.dy)
                if(facing!==null){
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
}