import { Behaviour } from "./Behaviour.mjs";

export class MovementBehaviour extends Behaviour{

    /** @type {number} */
    sloppiness=1

    /**
     * 
     * @param {number=} sloppiness 
     */
    constructor(sloppiness=1){
        super()
        this.sloppiness=sloppiness
    }

    /** @override */
    init(world, objects){
        for(let object of objects){
            object.dx=0
            object.dy=0
            object.dz=0
        }
    }

    /** @override */
    tick(world, objects){
        for(let object of objects){
            object.dx*=this.sloppiness
            if(object.dx>-0.1 && object.dx<0.1)object.dx=0
            
            object.dy*=this.sloppiness
            if(object.dy>-0.1 && object.dy<0.1)object.dy=0
            
            object.dz*=this.sloppiness
            if(object.dz>-0.1 && object.dz<0.1)object.dz=0

            object.x+=object.dx
            object.y+=object.dy
            object.z+=object.dz
        }
    }

    /** @override */
    finish(world, objects){
    }

    
}