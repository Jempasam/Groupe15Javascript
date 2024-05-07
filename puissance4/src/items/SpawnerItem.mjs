import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs"
import { adom, dom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { on_summon } from "./events.js";

export class SpawnerItem extends Item{
    
    constructor(cadency, factory){
        super()
        this.time=0
        this.cadency=cadency
        this.factory=factory
        this.next=factory()
    }
    
    getDisplay(...args){
        return adom/*html*/`
            <div class="spawner">
                ${this.next.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>=this.cadency){
            this.time=0
            for(let i=0; i<10; i++){
                let sx=Math.floor(Math.random()*field.width)
                let sy=Math.floor(Math.random()*field.height)
                let target=field.get(sx,sy)
                if(target==null){
                    const next=this.next
                    field.set(sx,sy,next)
                    this.next=this.factory()
                    field.updateElement(x,y)
                    observers(field, on_summon) .notify({pos:[x,y], item:this, summoned:next, summoned_pos:[sx,sy]})
                    break;
                }
            }
        }
        field.schedule(x,y,root)
    }
}