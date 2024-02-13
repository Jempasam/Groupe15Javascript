import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlJumpBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} jump_strength
     * @param {number=} jump_count
     */
    constructor(jump_strength=200, jump_count=2){
        super()
        this.jump_strength=jump_strength
        this.jump_count=jump_count
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").add("ControlBehaviour", (v,obj1,obj2) => {
                if(v[1]>0){
                    obj1.jump_count=this.jump_count
                }
            })
        }
    }

    /** @override */
    tick(world, objects){
        // Jump
        if(eatKeyPress("Space")){
            for(let object of objects){
                if(object.jump_count>0){
                    let dy=Math.max(0,this.jump_strength+object.dy)
                    object.dy-=dy
                    object.jump_count--
                }
            }
        }
    }

    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("ControlBehaviour")
        }
    }

    
}