import { Item } from "../field/Item.mjs";
import { StaticCoinItem } from "./StaticCoinItem.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs"

export class PlayerItem extends Item{
    
    constructor(team, factory, leftKey, rightKey, spawnKey){
        super()
        this.team=team
        this.leftKey=leftKey
        this.rightKey=rightKey
        this.spawnKey=spawnKey
        this.time=0
        this.factory=factory
        this.next=factory(this.team)
    }

    getClasses(){
        return [
            "player",
            this.team,
            ...(this.time>0 ? ["loading"] : []),
            ...this.next.getClasses()
        ]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        if(eatKeyPress(this.leftKey)){
            this.tryMove(field,root,x,y,x-1,y)
        }
        if(eatKeyPress(this.rightKey)){
            this.tryMove(field,root,x,y,x+1,y)
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
                field.set(x,y+1,this.next)
                this.next=this.factory(this.team)
                field.updateElement(x,y)
            }
        }
        field.schedule(x,y,this)
    }

    tryMove(field,root,x,y,newx,newy){
        let target=field.get(newx,newy)
        if(target!==undefined){
            field.set(x,y,target)
            field.set(newx,newy,root)
        }
    }
}