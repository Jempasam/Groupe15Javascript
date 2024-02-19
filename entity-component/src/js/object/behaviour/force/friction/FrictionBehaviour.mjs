import { Behaviour } from "../../Behaviour.mjs";

export class FrictionBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} movement_preservation 
     */
    constructor(movement_preservation=0.9){
        super()
        this.movement_preservation=movement_preservation
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").add("FrictionBehaviour", (v,obj1,obj2) => {
                obj1.dx*=this.movement_preservation
                obj1.dy*=this.movement_preservation
                obj1.dz*=this.movement_preservation
            })
        }
    }

    /** @override */
    tick(world, objects){}


    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("FrictionBehaviour")
        }
    }

    
}