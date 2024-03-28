import { Item } from "../field/Item.mjs"
import "../../../samlib/Array.mjs"
import { adom } from "../../../samlib/DOM.mjs"
import { Class, Methods } from "./ItemUtils.mjs"

export class TripleItem extends Item{
    
    constructor(a,b,c,dx,dy){
        super()
        this.a=a
        this.b=b
        this.c=c
        this.dx=dx
        this.dy=dy
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="triple ${Class.direction(this.dx,this.dy)}">
                ${this.a.getDisplay(...args)}
                ${this.b.getDisplay(...args)}
                ${this.c.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.set(x,y,null)

        let px=x
        let py=y
        const dx=this.dx
        const dy=this.dy

        let left=field.get(px-dx,py-dy)
        let center=field.get(px,py)
        let right=field.get(px+dx,py+dy)

        if(left!==null){
            px+=dx
            py+=dy
        }
        if(right){
            px-=dx
            py-=dy
        }

        left=field.get(px-dx,py-dy)
        center=field.get(px,py)
        right=field.get(px+dx,py+dy)

        if(left===null){
            field.set(px-dx, py-dy, this.a)
        }
        if(right===null){
            field.set(px+dx, py+dy, this.b)
        }
        field.set(px, py, this.c)
    }

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
        this.a.rotate(field, root, x, y)
        this.b.rotate(field, root, x, y)
        this.c.rotate(field, root, x, y)
    }
}