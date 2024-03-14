import { Item } from "../field/Item.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs"
import { adom, dom } from "../../../samlib/DOM.mjs";

export class PlayerItem extends Item{
    
    constructor(team, factory, leftKey, rightKey, spawnKey){
        super()
        this.team=team
        this.leftKey=leftKey
        this.rightKey=rightKey
        this.spawnKey=spawnKey
        this.time=0
        this.movetime=0
        this.factory=factory
        this.next=factory(this.team)
    }
    
    getDisplay(...args){
        return adom/*html*/`
            <div class="player ${this.team} ${this.time>0?"loading":""}">
                ${this.next.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        if(this.movetime<=0){
            if(isKeyPressed(this.leftKey)){
                this.tryMove(field,root,x,y,x-1,y)
                this.movetime=2
            }
            else if(isKeyPressed(this.rightKey)){
                this.tryMove(field,root,x,y,x+1,y)
                this.movetime=2
            }
        }
        else this.movetime--
            
        if(this.time>0){
            this.time--
            if(this.time===0){
                field.updateElement(x,y)
            }
        }
        else{
            if(isKeyPressed(this.spawnKey) && field.get(x,y+1)===null){
                this.time=40
                field.set(x,y+1,this.next)
                this.next=this.factory(this.team)
                field.updateElement(x,y)
            }
        }
        field.schedule(x,y,root)
    }

    tryMove(field,root,x,y,newx,newy){
        let target=field.get(newx,newy)
        if(target===null || target instanceof PlayerItem){
            field.swap(x,y,newx,newy)
        }
        else if(target!==undefined){
            target.onTrigger(field,root,newx,newy)
        }
    }
}