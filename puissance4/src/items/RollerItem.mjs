import { Item } from "../field/Item.mjs";
import { StaticCoinItem } from "./StaticCoinItem.mjs";

export class RollerItem extends Item{
    
    constructor(direction){
        super()
        this.direction=direction
        this.time=0
    }

    getClasses(){
        return ["roller",this.direction>0?"right":"left"]
    }

    onAdd(field,x,y){
        field.ticks.schedule(x,y,this)
    }

    onTick(field,x,y){
        this.time++
        if(this.time>2){
            this.time=0
            let over=field.get(x,y-1)
            let after_over=field.get(x+this.direction,y-1)
            if(over && after_over===null){
                field.set(x,y-1,null)
                field.set(x+this.direction,y-1,over)
            }
        }
        field.ticks.schedule(x,y,this)
    }
}