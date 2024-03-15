
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