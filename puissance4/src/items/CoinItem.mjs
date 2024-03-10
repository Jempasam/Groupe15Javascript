import { Item } from "../field/Item.mjs";
import { ActivatedCoinItem } from "./ActivatedCoinItem.mjs";

export class CoinItem extends Item{
    
    constructor(team){
        super()
        this.team=team
        this.time=0
    }

    getClasses(){
        return ["static","coin",this.team]
    }

    onAdd(field,root,x,y){
        let aligneds=this.#getAligneds(field,x,y)
        console.log(aligneds.length)
        if(aligneds.length>0){
            for(let [a,b] of aligneds){
                field.set(a,b,new ActivatedCoinItem(this.team))
            }
            field.set(x,y,new ActivatedCoinItem(this.team))
            if(field.on_alignement)field.on_alignement([[x,y],...aligneds])
        }
    }

    onTick(field,root,x,y){
    }

    #collectInDirection(field,x,y,dx,dy){
        const team=this.team
        let collected=[]
        for(let i=1;i<6;i++){
            let item=field.get(x+dx*i,y+dy*i)
            if(item && item instanceof CoinItem && item.team===team)collected.push([x+dx*i,y+dy*i])
            else break
        }
        return collected
    }

    #getAligmentInDirection(field,x,y,dx,dy){
        let collected=[
            ...this.#collectInDirection(field,x,y,dx,dy),
            ...this.#collectInDirection(field,x,y,-dx,-dy)
        ]
        return collected
    }

    #getAligneds(field,x,y){
        let total=[]
        let line=this.#getAligmentInDirection(field,x,y,1,0)
        if(line.length>=3)total=[...total,...line]
        line=this.#getAligmentInDirection(field,x,y,0,1)
        if(line.length>=3)total=[...total,...line]
        line=this.#getAligmentInDirection(field,x,y,1,1)
        if(line.length>=3)total=[...total,...line]
        line=this.#getAligmentInDirection(field,x,y,1,-1)
        if(line.length>=3)total=[...total,...line]
        return total
    }
}

