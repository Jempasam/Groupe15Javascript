import { Item } from "../field/Item.mjs";

export class ActivatedCoinItem extends Item{
    
    constructor(team){
        super()
        this.team=team
        this.time=0
    }

    getClasses(){
        return ["activated","coin",this.team]
    }

    onAdd(field,x,y){

    }

    onTick(field,x,y){
    }
}

