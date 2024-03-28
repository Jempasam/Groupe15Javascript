
export class Class{
    static direction(dx,dy){
        if(Math.abs(dx)>Math.abs(dy)){
            if(dx>0)return "right"
            else return "left"
        }
        else{
            if(dy>0)return "bottom"
            else return "top"
        }
    } 
}

export const Methods={
    rotate:{
        dxdy(field,root,x,y){
            this.dx=this.dy
            this.dy=-this.dx
        }
    },
    onAdd:{
        schedule(field,root,x,y){
            field.schedule(x,y,root)
        }
    }
}

