import { Behaviour } from "./Behaviour.mjs";

export class DyingBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} latency
     * @param {number=} death_speed 
     */
    constructor(latency, death_speed){
        super()
        this.latency=latency || 20
        this.death_speed=death_speed || 20
    }

    /** @override */
    init(world, objects){
        for(let object of objects){
            object["dying:lifetime"]=0
        }
    }

    /** @override */
    tick(world, objects){
        for(let object of objects){
            let time=object["dying:lifetime"]++
            if(time>this.latency){
                object.size-=this.death_speed
                if(object.size<=0){
                    object.size=0
                    world.removeObj(object)
                }
            }
        }
    }


    /** @override */
    finish(world, objects){
        for(let object of objects){
            delete object["dying:lifetime"]
        }
    }

    
}