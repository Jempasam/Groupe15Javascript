import { adom } from "../../../samlib/DOM.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { FruitItem } from "./FruitItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class SnakeItem extends Item{
    
    constructor(base, dx, dy, keySet){
        super()
        this.base=base
        this.dx=dx
        this.dy=dy
        this.time=0
        this.length=1
        this.keySet=keySet
        this.until_jump=Math.random()*5
        this.px=0
        this.py=0
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="snake ${Class.direction(this.dx,this.dy)}">
                ${this.base.getDisplay(...args)}
            <div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.keySet){
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
                if(ndx!==-this.px || ndy!==-this.py){
                    this.dx=ndx
                    this.dy=ndy
                    //field.updateElement(x,y)
                }
            }
        }
        if(this.time>5){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            if(under===null || (this.keySet && under instanceof CoinItem) || under.isComestible){
                if(under!=null){
                    this.length++
                }

                // Rotation
                if(this.keySet){
                    this.canPress=true
                    this.px=dx
                    this.py=dy
                }
                else{
                    this.until_jump--
                    if(this.until_jump<0){
                        this.until_jump=Math.random()*5
                        this.length++
                        if(Math.random()>0.5){
                            this.dx=dy
                            this.dy=-dx
                        }
                        else{
                            this.dx=-dy
                            this.dy=dx
                        }
                    }
                }

                field.swap(x,y, x+dx,y+dy)
                field.set(x, y, new SnakeBodyItem(this.length*5))
                //field.set(x+dx, y+dy, root)

                return
            }
            else{
                field.set(x,y,this.base)
                if(under)under.onTrigger(field, under, x+dx, y+dy)
            }
        }
        else field.schedule(x,y,root)
    }
}

class SnakeBodyItem extends Item{

    constructor(time){
        super()
        this.time=time
    }

    getClasses(...args){
        return ["snake_body"]
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