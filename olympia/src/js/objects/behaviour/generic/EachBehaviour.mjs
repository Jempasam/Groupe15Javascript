import { GameObject } from "../../world/GameObject.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


export class EachBehaviour extends Behaviour{

    /** @override @type {Behaviour['tick']} */
    tick(world, objects, ...rest){
        if(this.tick_each) for(const obj of objects) this.tick_each(obj, world, objects, ...rest)
    }

    /** @type {(target:GameObject, world:World, ...objects:ObjectQuery[])=>void=} */
    tick_each=undefined


    /** @override @type {Behaviour['init']} */
    init(world, objects, ...rest){
        if(this.init_each) for(const obj of objects) this.init_each(obj, world, objects, ...rest)
    }

    /** @type {(target:GameObject, world:World, ...objects:ObjectQuery[])=>void=} */
    init_each=undefined


    /** @override @type {Behaviour['finish']} */
    finish(world, objects, ...rest){
        if(this.finish_each) for(const obj of objects) this.finish_each(obj, world, objects, ...rest)
    }

    /** @type {(target:GameObject, world:World, ...objects:ObjectQuery[])=>void=} */
    finish_each=undefined

}

/**
 * Create a simple behavioru with the given ticker function called on each objects of the first query
 * @param {EachBehaviour['tick_each']|{init?:EachBehaviour['init_each'],tick?:EachBehaviour['tick_each'],finish?:EachBehaviour['finish_each']}} ticker 
 */
export function behaviourEach(ticker){
    if(!ticker || ticker instanceof Function) ticker={tick:ticker}
    const ret=new EachBehaviour()
    ret.init_each= ticker.init
    ret.tick_each= ticker.tick
    if(!ret.tick_each) ret.doTick=false
    ret.finish_each= ticker.finish
    return ret
}