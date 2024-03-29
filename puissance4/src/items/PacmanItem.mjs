import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { Controler } from "./controler/Controlers.mjs";

export class PacmanItem extends Item{
    
    /**
     * 
     * @param {number} dx 
     * @param {number} dy 
     * @param {Controler} controler 
     */
    constructor(dx, dy, controler){
        super()
        this.dx=dx
        this.dy=dy
        this.time=0
        this.action_time=0
        this.controler=controler
        this.px=0
        this.py=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="pacman ${Class.direction(this.dx,this.dy)} ${this.controler.team}">
            <div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        
        if(this.action_time<=0){
            this.controler.onAction(field,this.dx,this.dy,x,y, action=>{
                if(action.isDirection){
                    const under=field.get(x+action.dx,y+action.dy)
                    if(under===null || under?.isComestible){
                        this.dx=action.dx
                        this.dy=action.dy
                        this.action_time=5
                    }

                }
            })
        }
        else this.action_time--

        if(this.time>5){
            this.time=0
            let dx=this.dx
            let dy=this.dy
            let under=field.get(x+dx,y+dy)
            if(under===null || under?.isComestible){
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