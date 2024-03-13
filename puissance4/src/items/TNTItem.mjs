import { Item } from "../field/Item.mjs";

export class TNTItem extends Item{
    
    constructor(){
        super()
        this.time=0
    }

    onAdd(field, root, x, y){
        field.schedule(x,y,this)
    }

    onTick(field, root, x, y){
        this.time++
        if(this.time>=40){
            for(let px=-2; px<2; px++){
                for(let py=-2; py<2; py++){
                    let target=field.get(x+px,y+py)
                    if(target){
                        field.set(x+px,y+py,null)
                    }
                }
            }
        }
        else field.schedule(x,y,root)
    }

    getClasses(){
        return ["tnt"]
    }
}