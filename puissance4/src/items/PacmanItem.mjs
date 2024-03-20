import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
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
            let target=field.get(x+ndx,y+ndy)
            if(target===null || target?.isComestible){
                this.dx=ndx
                this.dy=ndy
            }
        }
        if(this.time>5){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            console.log(under+" "+(under?.isComestible)+" "+new FruitItem().isComestible)
            if(under===null || under?.isComestible){
                if(this.keySet){
                    this.canPress=true
                    this.px=dx
                    this.py=dy
                }
                if(under?.isComestible){
                    field.set(x+dx,y+dy,null)
                    Sounds.CROCK.play()
                }
                field.swap(x,y, x+dx,y+dy)
            }
            else if(under){
                under.onTrigger(field,under,x+dx,y+dy)
            }
        }
        field.schedule(x,y,root)
    }

    rotate=Methods.rotate.dxdy
}