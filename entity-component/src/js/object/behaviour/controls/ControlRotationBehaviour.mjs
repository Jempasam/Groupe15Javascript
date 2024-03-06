import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlRotationBehaviour extends Behaviour{

    /**
     * @param {Object.<string,[number,number,number]>} actions The set used to controls the movement
     * 
     */
    constructor(actions){
        super()
        this.actions=actions
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Move
        let rotation=[0,0,0]
        for(let key in this.actions){
            if(isKeyPressed(key)){
                let rot=this.actions[key]
                rotation[0]+=rot[0]
                rotation[1]+=rot[1]
                rotation[2]+=rot[2]
            }
        }
        if(rotation[0] || rotation[1] || rotation[2]){
            for(let object of objects){
                object.transform.rotateAround(rotation[0],rotation[1],rotation[2],.5,.5,.5)
                //object.transform.rx+=rotation[0]
                //object.transform.ry+=rotation[1]
                //object.transform.rz+=rotation[2]
            }
        }
    }

    /** @override */
    finish(world, objects){
    }

    
}