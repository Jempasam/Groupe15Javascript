import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
import { Controler } from "./controler/Controlers.mjs";

export class LinkItem extends Item{
    /**
     * 
     * @param {Item?} base 
     * @param {Controler} controler
     */
    constructor(base=null, controler){
        super()
        this.base=base
        this.time=0
        this.controler=controler
        this.attack_time=0
        this.can_do=true
        this.dx=0
        this.dy=1
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="link ${this.attack_time>0?"_attack":""} ${Class.direction(this.dx,this.dy)} ${this.controler.team}">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){
        field.set(x,y,this.base)
        observers(field,"on_die").notify(this,x,y)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.attack_time>0){
            this.attack_time--
            if(this.attack_time===0){
                field.updateElement(x,y)
            }
        }
        else if(this.can_do){
            let commands=this.controler.getCurrentAction(field,this.dx,this.dy,x,y)
            for(let command of commands){
                if(command.isDirection){
                    this.dx=command.dx
                    this.dy=command.dy
                    this.can_do=false
                }
                else if(command==Controler.MOVE){
                    this.tryMove(field,root,x,y,this.dx,this.dy)
                    this.can_do=false
                }
            }
        }
        else if(this.time>5){
            this.can_do=true
            /*if(isKeyPressed(this.keyset[0]) && this.tryMove(field,root,x,y,0,-1)){}
            else if(isKeyPressed(this.keyset[1]) && this.tryMove(field,root,x,y,1,0)){}
            else if(isKeyPressed(this.keyset[2]) && this.tryMove(field,root,x,y,0,1)){}
            else if(isKeyPressed(this.keyset[3]) && this.tryMove(field,root,x,y,-1,0)){}*/
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

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
    }
}