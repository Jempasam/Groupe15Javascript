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
            let x=object.transform.x
            let y=object.transform.y
            let z=object.transform.z
            let sx=object.transform.sx
            let sy=object.transform.sy
            let sz=object.transform.sz
            if(x < 0){
                vx=x
            }
            if(x > world.width-sx){
                vx=world.width-x+sx
            }
            if(y < 0){
                vy=y
            }
            if(y > world.height-sy){
                vy=world.height-y+sy
            }
            if(z < 0){
                vz=z
            }
            if(z > world.depth-sz/2){
                vz=world.depth-z+sz
            }
            if(vx || vy || vz)object.observers("on_collision").notify([vx/2, vy/2, vz/2], object, this)

        }
    }


    /** @override */
    finish(world, object){}

    
}