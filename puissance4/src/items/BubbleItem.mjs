import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class BubbleItem extends Item{
    
    constructor(base=null){
        super()
        this.base=base
        this.time=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="bubble">
                ${this.base?.getDisplay(...args)}
            <div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>50){
            field.set(x,y,this.base)
            Sounds.POP.play()
        }
        field.schedule(x,y,root)
    }
}