import { Behaviour } from "../Behaviour.mjs";

export class WorldLimitBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} max_strength 
     */
    constructor(max_strength){
        super()
        this.max_strength=max_strength || 0.1
    }

    /** @override */
    init(world, object){}

    /** @override */
    tick(world, objects){
        for(let object of objects){
            let vx=0
            let vy=0
            let vz=0
            if(object.x < object.size/2){
                vx=object.size/2-object.x
            }
            if(object.x > world.width-object.size/2){
                vx=world.width-(object.x+object.size/2)
            }
            if(object.y < object.size/2){
                vy=object.size/2-object.y
            }
            if(object.y > world.height-object.size/2){
                vy=world.height-(object.y+object.size/2)
            }
            if(object.z < object.size/2){
                vz=object.size/2-object.z
            }
            if(object.z > world.depth-object.size/2){
                vz=world.depth-(object.z+object.size/2)
            }
            if(vx || vy || vz)object.observers("on_collision").notify([-vx,-vy, -vz], object, this)

        }
    }


    /** @override */
    finish(world, object){}

    
}