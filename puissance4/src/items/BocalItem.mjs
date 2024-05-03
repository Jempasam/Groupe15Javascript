import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { on_broken } from "./events.js";

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
        observers(field,on_broken).notify({item:this,pos:[x,y]})
    }

    rotate(field, root, x, y){
        this.base.rotate(field, root, x, y)
    }
}