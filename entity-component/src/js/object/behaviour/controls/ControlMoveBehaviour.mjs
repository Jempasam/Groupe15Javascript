import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlMoveBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} speed
     */
    constructor(speed=10){
        super()
        this.speed=speed
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Move
        let dx=0
        let dz=0
        if(isKeyPressed("KeyA")) dx+=-1
        if(isKeyPressed("KeyD")) dx+=1
        if(isKeyPressed("KeyW")) dz+=1
        if(isKeyPressed("KeyS")) dz+=-1
        let d=Math.sqrt(dx*dx+dz*dz)
        if(d){
            dx*=this.speed/d
            dz*=this.speed/d

            for(let object of objects){
                object.dx+=dx
                object.dz+=dz
            }
        }
    }

    /** @override */
    finish(world, objects){
    }

    
}