import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { Controler } from "./controler/Controlers.mjs";
import { on_die, on_eat } from "./events";

export class SnakeItem extends Item{
    
    /**
     * 
     * @param {Item?} base 
     * @param {number} dx 
     * @param {number} dy 
     * @param {Controler} controler 
     */
    constructor(base, dx, dy, controler, growing=0){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
        this.length=1
        this.growing=growing
        this.controler=controler
        this.can_move=true
    }

    /**
     * @type {Item['getDisplay']}
     */
    getDisplay(...args){
        return adom/*html*/`
            <div class="snake ${Class.direction(this.dx,this.dy)} ${this.controler.team}">
                ${this.base?.getDisplay(...args)}
            <div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.can_move) this.controler.onAction(field,this.dx,this.dy,x,y,action=>{
            if(action.isDirection && (action.dx!=-this.dx || action.dy!=-this.dy)){
                this.length+=this.growing
                this.dx=action.dx
                this.dy=action.dy
                this.can_move=false
            }
        })
        if(this.time>5){
            this.can_move=true
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            if(under===null || under?.isComestible){
                if(under!=null){
                    this.length++
                    Sounds.CROCK.play()
                    observers(field,on_eat).notify({eater:this, eaten:under, pos:[x+dx,y+dy]})
                }

                field.swap(x,y, x+dx,y+dy)
                field.set(x, y, new SnakeBodyItem(this.length*5,this.controler.team))
                return
            }
            else{
                field.set(x,y,this.base)
                if(under)under.onTrigger(field, under, x+dx, y+dy)
                observers(field,on_die).notify({item:this, pos:[x,y]})
            }
        }
        else field.schedule(x,y,root)
    }

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
        this.base?.rotate(field, root, x, y)
    }
}

class SnakeBodyItem extends Item{

    constructor(time,team){
        super()
        this.time=time
        this.team=team
    }

    getClasses(...args){
        return ["snake_body",this.team]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time--
        if(this.time<0){
            field.set(x,y,null)
        }
        else field.schedule(x,y,root)
    }
}