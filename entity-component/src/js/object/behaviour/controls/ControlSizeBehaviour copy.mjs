import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlSizeBehaviour extends Behaviour{

    constructor(){
        super()
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Jump
        if(isKeyPressed("KeyQ")){
            for(let object of objects){
                if(object.jump_count>0){
                    object.size*=1.1
                }
            }
        }
        else if(isKeyPressed("KeyE")){
            for(let object of objects){
                if(object.jump_count>0){
                    object.size*=0.9
                }
            }
        }
    }

    /** @override */
    finish(world, objects){
    }

    
}