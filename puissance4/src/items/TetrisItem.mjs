import { adom } from "../../../samlib/DOM.mjs"
import { Item } from "../field/Item.mjs"
import { Sounds } from "../sounds/SoundBank.mjs"

export class TetrisItem extends Item{
    
    constructor(team){
        super()
        this.team=team
        this.time=0
        this.finded=false
    }

    getDisplay(...args){
        return adom/*html*/`<div class="tetris ${this.team}"><div>`
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        for(let ox=0; ox<field.width; ox++){
            const element=field.get(ox,y)
            if(!element?.associateWithTetris){
                return
            }
        }
        for(let ox=0; ox<field.width; ox++){
            field.set(ox,y,null)

            for(let oy=y; oy>=0; oy--){
                const over=field.get(ox,oy-1)
                if(!over)break
                field.swap(ox,oy,ox,oy-1)
            }
        }
    }

    associateWithTetris=true
}