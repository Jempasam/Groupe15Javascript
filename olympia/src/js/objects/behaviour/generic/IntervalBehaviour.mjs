import { LIVING } from "../../model/LivingModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


/**
 * Make the decorated behaviour tick only every interval ticks
 */
export class IntervalBehaviour extends Behaviour{

    /**
     * @param {Behaviour} decorated
     * @param {number} interval 
     */
    constructor(interval,decorated){
        super()
        this.decorated=decorated
        this.interval=interval+1
    }
    
    /**
     * @override
     * @type {Behaviour['init']}
     */
    init(...args){
        this.decorated.init(...args)
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        if(world.age%this.interval==0){
            this.decorated.tick(world,objects)
        }
    }

    /**
     * @override
     * @type {Behaviour['init']}
     */
    finish(...args){
        this.decorated.finish(...args)
    }
}

/**
 * Make the decorated behaviour tick only every interval ticks
 * @param {number} interval 
 * @param {Behaviour} decorated 
 */
export function behaviourInteval(interval,decorated){
    return new IntervalBehaviour(interval,decorated)
}