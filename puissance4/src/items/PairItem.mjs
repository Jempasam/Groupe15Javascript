import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"
import { adom } from "../../../samlib/DOM.mjs"
import { Class } from "./ItemUtils.mjs"

export class PairItem extends Item{
    
    constructor(a,b,dx,dy){
        super()
        this.a=a
        this.b=b
        this.dx=dx
        this.dy=dy
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="pair ${Class.direction(this.dx,this.dy)}">
                ${this.a.getDisplay(...args)}
                ${this.b.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        const dx=this.dx
        const dy=this.dy
        let left=field.get(x-dx,y-dy)
        let right=field.get(x+dx,y+dy)
        if(left===null){
            if(right===null){
                if(Math.random()>0.5){
                    field.set(x-dx,y-dy,this.a)
                    field.set(x,y,this.b)
                }
                else{
                    field.set(x,y,this.a)
                    field.set(x+dx,y+dy,this.b)
                }
            }
            else{
                field.set(x-dx,y-dy,this.a)
                field.set(x,y,this.b)
            }
        }
        else{
            if(right===null){
                field.set(x,y,this.a)
                field.set(x+dx,y+dy,this.b)
            }
            else{
                if(Math.random()>0.5){
                    field.set(x,y,this.a)
                }
                else{
                    field.set(x,y,this.b)
                }
            }
        }
    }
}