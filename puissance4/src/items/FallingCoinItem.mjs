import { Item } from "../field/Item.mjs";
import { StaticCoinItem } from "./StaticCoinItem.mjs";

export class FallingCoinItem extends Item{
    
    constructor(team){
        super()
        this.team=team
        this.time=0
    }

    getClasses(){
        return ["falling","coin",this.team]
    }

    onAdd(field,x,y){
        field.ticks.schedule(x,y,this)
    }

    onTick(field,x,y){
        this.time++
        if(this.time>5){
            this.time=0
            let under=field.get(x,y+1)
            if(under===null){
                let underder=field.get(x,y+2)
                if(underder){
                    underder.onTrigger(field,x,y+2)
                }
                field.set(x,y,null)
                field.set(x,y+1,this)
                return
            }
            else{
                field.set(x,y,new StaticCoinItem(this.team))
            }
        }
        else field.ticks.schedule(x,y,this)
    }
}