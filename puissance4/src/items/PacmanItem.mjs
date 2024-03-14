import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class PacmanItem extends Item{
    
    constructor(dx, dy, keySet){
        super()
        this.dx=dx
        this.dy=dy
        this.time=0
        this.keySet=keySet
        this.px=0
        this.py=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="pacman ${Class.direction(this.dx,this.dy)}">
            <div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++

        let ndx
        let ndy
        if(isKeyPressed(this.keySet[0])){
            ndx=0
            ndy=-1
        }
        else if(isKeyPressed(this.keySet[1])){
            ndx=1
            ndy=0
        }
        else if(isKeyPressed(this.keySet[2])){
            ndx=0
            ndy=1
        }
        else if(isKeyPressed(this.keySet[3])){
            ndx=-1
            ndy=0
        }
        if(ndx!==undefined){
            this.dx=ndx
            this.dy=ndy
            this.time=3
            field.updateElement(x,y)
        }
        if(this.time>5){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            if(under===null){
                if(this.keySet){
                    this.canPress=true
                    this.px=dx
                    this.py=dy
                }
                field.swap(x,y, x+dx,y+dy)
            }
        }
        field.schedule(x,y,root)
    }
}