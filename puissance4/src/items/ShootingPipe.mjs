import { Item } from "../field/Item.mjs";
import { FallingPlatformItem } from "./FallingPlatformItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { PipeItem } from "./PipeItem.mjs";

export class ShootingPipeItem extends PipeItem{
    
    /**
     * 
     * @param {number} dx 
     * @param {number} dy 
     */
    constructor(dx,dy){
        super(dx,dy)
    }

    getClasses(...args){
        return ["shooting_pipe", Class.direction(this.dx,this.dy), ...(this.content?.getClasses(...args)??[])]
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>2){
            let dx=this.dx
            let dy=this.dy
            this.time=0
            if(this.content===null){
                let under=field.get(x-dx,y-dy)
                if(under && !(under instanceof PipeItem)){
                    field.set(x-dx, y-dy, null)
                    this.content=under
                    field.updateElement(x,y)
                }
            }
            else{
                let after=field.get(x+dx,y+dy)
                if(!after){
                    field.set(x+dx, y+dy, new MovingItem(this.content,dx,dy))
                    this.content=null
                    field.updateElement(x,y)
                }
                else if(after instanceof PipeItem && after.content===null){
                    after.content=this.content
                    field.updateElement(x+dx,y+dy)
                    after.time=0
                    this.content=null
                    field.updateElement(x,y)
                }
            }
        }
        field.schedule(x,y,root)
    }
}