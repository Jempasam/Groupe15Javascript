import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";

/**
 * @template T
 * @typedef {[ObserverKey<T>,(GameObject,T)=>void]} ListenerAndKey
 */

export class ObserveBehaviour extends Behaviour{

    /** @type {ListenerAndKey<*>[]} */
    listeners=[]

    tick(world, ...objects){ }
    doTick=false

    init(world, objects){
        for(const obj of objects){
            for(const [key,listener] of this.listeners)obj.observers(key).add(this.uid,listener)
        }
    }

    finish(world, objects){
        for(const obj of objects){
            for(const [key] of this.listeners)obj.observers(key).remove(this.uid)
        }
    }

}

/**
 * Create a simple behaviour that register many observers on many events
 * @param {...ListenerAndKey<*>} listeners
 * @returns 
 */
export function behaviourObserveMany(...listeners){
    const ret=new ObserveBehaviour()
    ret.listeners=listeners
    return ret
}

/**
 * Create a simple behaviour that register an observer on the given event
 * @template T
 * @param {ObserverKey<T>} event
 * @param {(obj:GameObject,event:T)=>void} listener
 */
export function behaviourObserve(event,listener){
    return behaviourObserveMany([event,listener]) 
}
