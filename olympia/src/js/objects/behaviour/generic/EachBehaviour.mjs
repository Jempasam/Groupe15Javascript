import { GameObject } from "../../world/GameObject.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


export class EachBehaviour extends Behaviour{

    /** @override @type {Behaviour['tick']} */
    tick(world, objects, ...rest){
        for(const obj of objects) this.tick_each(obj, world, objects, ...rest)
    }

    /**
     * @param {GameObject} target
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    tick_each(target, world, ...objects){
        throw new Error("Undefined tick_each method")
    }

    init(world, ...objects){}

    finish(world, ...objects){}

}

/**
 * Create a simple behavioru with the given ticker function called on each objects of the first query
 * @param {EachBehaviour['tick_each']} ticker 
 */
export function behaviourEach(ticker){
    const ret=new EachBehaviour()
    ret.tick_each=ticker
    return ret
}