import { Item } from "../field/Item.mjs";
import { StaticCoinItem } from "./StaticCoinItem.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs"
import { FallingCoinItem } from "./FallingCoinItem.mjs";

export class PlayerItem extends Item{
    
    constructor(team, factory, leftKey, rightKey, spawnKey){
        super()
        this.team=team
        this.leftKey=leftKey
        this.rightKey=rightKey
        this.spawnKey=spawnKey
        this.time=0
        this.factory=factory
    }

    getClasses(){
        return [
            "player",
            this.team,
            ...(this.time>0 ? ["loading"] : [])
        ]
    }

    onAdd(field,x,y){
        field.ticks.schedule(x,y,this)
    }

    onTick(field,x,y){
        if(eatKeyPress(this.leftKey)){
            this.tryMove(field,x,y,x-1,y)
        }
        if(eatKeyPress(this.rightKey)){
            this.tryMove(field,x,y,x+1,y)
        }
        if(this.time>0){
            this.time--
            if(this.time===0){
                field.updateElement(x,y)
            }
        }
        else{
            if(eatKeyPress(this.spawnKey)){
                this.time=40
                field.set(x,y+1,new FallingCoinItem(this.team))
                field.updateElement(x,y)
            }
        }
        field.ticks.schedule(x,y,this)
    }

    tryMove(field,x,y,newx,newy){
        let target=field.get(newx,newy)
        if(target!==undefined){
            field.set(x,y,target)
            field.set(newx,newy,this)
        }
    }
}