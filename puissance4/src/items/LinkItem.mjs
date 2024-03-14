import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Class } from "./ItemUtils.mjs";

export class LinkItem extends Item{
    /**
     * 
     * @param {Item?} base 
     */
    constructor(base=null, keyset){
        super()
        this.base=base
        this.time=0
        this.keyset=keyset
        this.attack_time=0
        this.dx=0
        this.dy=1
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="link ${this.attack_time>0?"_attack":""} ${Class.direction(this.dx,this.dy)}">
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
        if(this.attack_time>0){
            this.attack_time--
            if(this.attack_time===0){
                field.updateElement(x,y)
            }
        }
        else if(this.time>5){
            if(isKeyPressed(this.keyset[0]) && this.tryMove(field,root,x,y,0,-1)){}
            else if(isKeyPressed(this.keyset[1]) && this.tryMove(field,root,x,y,1,0)){}
            else if(isKeyPressed(this.keyset[2]) && this.tryMove(field,root,x,y,0,1)){}
            else if(isKeyPressed(this.keyset[3]) && this.tryMove(field,root,x,y,-1,0)){}
        }
        field.schedule(x,y,root)
    }

    tryMove(field,root,x,y,dx,dy){
        let facing=field.get(x+dx,y+dy)
        if(facing===undefined){
            return false
        }
        if(facing===null){
            this.dx=dx
            this.dy=dy
            field.swap(x,y, x+dx,y+dy)
            this.time=0
        }
        else{
            facing.onTrigger(field,root,x+dx,y+dy)
            this.attack_time=10
            this.dx=dx
        this.dy=dy
            field.updateElement(x,y)
        }
        return true
    }
}