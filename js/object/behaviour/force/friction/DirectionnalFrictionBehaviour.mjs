import { Behaviour } from "../../Behaviour.mjs";

export class DirectionnalFrictionBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} movement_preservation 
     */
    constructor(movement_preservation=0.9){
        super()
        this.movement_preservation=movement_preservation
        this.move_deprev=1-movement_preservation
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").add("DirectionnalFrictionBehaviour", (v,obj1,obj2) => {
                let depth=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
                let nx=1-v[0]/depth
                let ny=1-v[1]/depth
                let nz=1-v[2]/depth
                obj1.dx*=this.movement_preservation+this.move_deprev*nx
                obj1.dy*=this.movement_preservation+this.move_deprev*ny
                obj1.dz*=this.movement_preservation+this.move_deprev*nz
            })
        }
    }

    /** @override */
    tick(world, objects){}


    /** @override */
    finish(world, objects){
        for(let obj of objects){
            obj.observers("on_collision").remove("DirectionnalFrictionBehaviour")
        }
    }

    
}