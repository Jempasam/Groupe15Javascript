import { Behaviour } from "../Behaviour.mjs";

export class GravityBehaviour extends Behaviour{

    /** @type {number} */
    x=0
    y=0
    z=0

    /**
     * 
     * @param {number=} x
     * @param {number=} y
     */
    constructor(x=0,y=0,z=0){
        super()
        this.x=x
        this.y=y
        this.z=z
    }

    /** @override */
    init(world, objects){}

    /** @override */
    tick(world, objects){
        for(let object of objects){
            object.dx+=this.x
            object.dy+=this.y
            object.dz+=this.z
        }
    }

    /** @override */
    finish(world, objects){ }

    
}