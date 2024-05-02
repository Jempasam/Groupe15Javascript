import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { on_destroy, on_explode } from "./events";

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
            for(let px=-2; px<=2; px++){
                for(let py=-2; py<=2; py++){
                    let target=field.get(x+px,y+py)
                    if(target){
                        field.set(x+px,y+py,null)
                        observers(field,on_destroy).notify({pos:[x,y], item:this, destroyed:target, destroyed_pos:[x+px,y+py]})
                    }
                }
            }
            observers(field, on_explode).notify({pos:[x,y], item:this})
            Sounds.BOMB.play()
        }
        else field.schedule(x,y,root)
    }

    getClasses(){
        return ["tnt"]
    }
}