import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { CancelledItem } from "./CancelledItem.mjs";
import { CoinItem } from "./CoinItem.mjs";

export class RollerItem extends Item{
    
    constructor(direction){
        super()
        this.direction=direction
        this.time=0
    }

    getClasses(){
        return ["roller",this.direction>0?"right":"left"]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>2){
            this.time=0
            let over=field.get(x,y-1)
            let after_over=field.get(x+this.direction,y-1)
            if(over && after_over===null){
                if(!(over instanceof CancelledItem)){
                    over=new CancelledItem(over,4)
                }
                field.swap(x,y-1, x+this.direction,y-1)
                Sounds.TCHI.play()
            }
        }
        field.schedule(x,y,this)
    }
}