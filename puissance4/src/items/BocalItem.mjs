import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class BocalItem extends Item{
    
    constructor(base){
        super()
        this.base=base
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="bocal">
                ${this.base.getDisplay(...args)}
            <div>
        `
    }

    onTrigger(field,root,x,y){
        field.set(x,y,this.base)
    }

    rotate(field, root, x, y){
        this.base.rotate(field, root, x, y)
    }
}