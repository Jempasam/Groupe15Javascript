import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlDashBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} strength
     * @param {number=} cooldown
     */
    constructor(strength=30, cooldown=100){
        super()
        this.strength=strength
        this.cooldown=cooldown
    }

    /** @override */
    init(world, objects){
        for(let object of objects){
            object.cooldown=0
        }
    }

    /** @override */
    tick(world, objects){
        // Dash
        if(isKeyPressed("ShiftLeft")){
            for(let object of objects){
                if(object.cooldown<=0){
                    let d=Math.sqrt(object.dx**2+object.dz**2)
                    if(d){
                        object.dx+=this.strength*object.dx/d
                        object.dz+=this.strength*object.dz/d
                        object.cooldown=this.cooldown
                    }
                }
            }
        }
        for(let object of objects){
            if(object.cooldown>0)object.cooldown--
        }
        
    }

    /** @override */
    finish(world, objects){
    }

    
}