import { Item } from "../field/Item.mjs";

export class WindItem extends Item{
    
    constructor(){
        super()
        this.time=0
    }

    getClasses(){
        return ["wind"]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,this)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>2){
            this.time=0
            this.#wind(field,x,y,1,0)
            this.#wind(field,x,y,-1,0)
        }
        field.schedule(x,y,this)
    }

    #wind(field,x,y,dx,dy){
        let xx=x+dx
        let yy=y+dy
        while(true){
            let moved=field.get(xx,yy)
            if(moved!==null){
                if(moved){
                    let next=field.get(xx+dx,yy+dy)
                    if(next===null){
                        field.set(xx,yy,null)
                        field.set(xx+dx,yy+dy,moved)
                    }
                }
                break
            }
            xx+=dx
            yy+=dy
        }
    }
}