import { Behaviour } from "../../Behaviour.mjs";

export class DepthFrictionBehaviour extends Behaviour{

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
            obj.observers("on_collision").add("DepthFrictionBehaviour", (v,obj1,obj2) => {
                let depth=Math.abs(v[0])+Math.abs(v[1])+Math.abs(v[2])
                obj1.dx*=Math.min(this.movement_preservation/depth, 1)
                obj1.dy*=Math.min(this.movement_preservation/depth, 1)
                obj1.dz*=Math.min(this.movement_preservation/depth, 1)
            })
        }
    }

    /** @override */
    tick(world, objects){}


    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("DepthFrictionBehaviour")
        }
    }

    
}