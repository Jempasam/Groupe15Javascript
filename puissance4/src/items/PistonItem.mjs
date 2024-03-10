import { Item } from "../field/Item.mjs";
import { FallingPlatformItem } from "./FallingPlatformItem.mjs";
import { MovingItem } from "./MovingItem.mjs";

export class PistonItem extends Item{
    
    /**
     * 
     * @param {number} dx 
     * @param {number} dy 
     */
    constructor(dx,dy){
        super()
        this.dx=dx
        this.dy=dy
        this.time=0
    }

    getClasses(){
        let direction
        if(Math.abs(this.dx)>Math.abs(this.dy)){
            if(this.dx>0)direction="right"
            else direction="left"
        }
        else{
            if(this.dy>0)direction="bottom"
            else direction="top"
        }
        return ["piston",direction]
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>2){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            let under=field.get(x+dx,y+dy)
            if(under!==null){
                if(!(under instanceof MovingItem) || (under.dx!=dx && under.dy!=dy)){
                    field.set(x+dx, y+dy, new MovingItem(under,dx,dy))
                }
            }
        }
        field.schedule(x,y,root)
    }
}