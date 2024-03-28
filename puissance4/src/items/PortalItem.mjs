import { adom } from "../../../samlib/DOM.mjs"
import { Item } from "../field/Item.mjs"
import { Sounds } from "../sounds/SoundBank.mjs"
import { Methods } from "./ItemUtils.mjs"

export class PortalItem extends Item{
    
    constructor(color){
        super()
        this.color=color
        this.time=0
        this.finded=false
    }

    getDisplay(...args){
        return adom/*html*/`<div class="candy _color${this.color}"><div>`
    }

    onAdd=Methods.onAdd.schedule

    onTick(field,root,x,y){
        let found=this.find(field,root,x,y)
        if(found.length>3){
            found.sort((a,b)=>a[2]-b[2])
            for(let [p,px,py] of found){
                field.set(px,py,null)
                for(let i=1; true; i++){
                    const over=field.get(px,py-i)
                    if(over && !over.finded){
                        field.swap(px,py-i,px,py-i+1)
                    }
                    else break
                }
            }
            Sounds.CROCK.play()
        }
        else{
            for(let [p,px,py] of found)p.finded=false
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