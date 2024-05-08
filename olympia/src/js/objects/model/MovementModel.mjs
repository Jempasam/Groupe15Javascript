import { Vector3 } from "../../../../../babylonjs/Maths/math.js";
import { ModelKey } from "../world/GameObject.mjs";

export class MovementModel{
    
    /**
     * @param {Vector3} inertia 
     */
    constructor(inertia){
        this.inertia=inertia
    }
}

/** @type {ModelKey<MovementModel>} */
export const MOVEMENT=new ModelKey("movement")