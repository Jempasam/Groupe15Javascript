import { adom } from "../../../samlib/DOM.mjs"
import { Item } from "../field/Item.mjs"

export class CandyItem extends Item{
    
    constructor(color){
        super()
        this.color=color
        this.time=0
        this.finded=false
    }

    getDisplay(...args){
        return adom/*html*/`<div class="candy _color${this.color}"><div>`
    }

    onAdd(field,root,x,y){
        let found=this.find(field,root,x,y)
        for(let [p,px,py] of found){
            p.finded=false
            if(found.length>4)field.set(px,py,null)
        }
    }

    find(field,root,x,y){
        let ret=[]
        for(let offset of [[0,1],[1,0],[0,-1],[-1,0]]){
            let under=field.get(x+offset[0],y+offset[1])
            if(under instanceof CandyItem && under.color===this.color && !under.finded){
                under.finded=true
                ret=[...ret, [under,x+offset[0],y+offset[1]], ...this.find(field,root,x+offset[0],y+offset[1])]
            }
        }
        return ret
    }

    static random(){
        return new CandyItem(Math.floor(Math.random()*4+1))
    }

}