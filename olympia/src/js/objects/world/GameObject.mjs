import { ObserverGroup, observers } from "../../../../../samlib/observers/ObserverGroup.mjs"
import { World } from "./World.mjs"

let obj_counter=0

/** @typedef {import("./TaggedDict.mjs").Tag} Tag */

/** @template T @typedef {import("./../../../../../samlib/observers/ObserverGroup.mjs").ObserverKey<T>} ObserverKey */


let id_counter=0

/**
 * @template T Event object
 */
export class ModelKey{

    /** @type {string} */ name

    /**
     * @param {string} name 
     */
    constructor(name="unamed"){
        this.name=name+"_"+id_counter
        id_counter++
    }
}

/**
 * Represents a game object.
 * @satisfies {any}
 * @class
 */
export class GameObject{
    /** @type {World} */
    world

    /** @type {Tag[]} */
    tags=[]

    /** @type {number} */
    id=obj_counter++

    /**
     * 
     * @param {World} world 
     * @param {any=} data 
     */
    constructor(world, data){
        this.world=world
        if(data){
            Object.assign(this,data)
        }
    }

    /**
     * @template T
     * @param {ObserverKey<T>} key
     * @returns {ObserverGroup<GameObject,T>}
     */
    observers(key){
        return observers(this,key)
    }

    /**
     * @template T
     * @param {ModelKey<T>} key
     * @returns {T?}
     */
    get(key){
        return this[key.name] ?? null
    }

    /**
     * @template T
     * @param {ModelKey<T>} key
     * @param {(value:T)=>void} callback
     */
    apply(key,callback){
        let value=this.get(key)
        if(value!==null)callback(value)
    }

    /**
     * @template T
     * @param {ModelKey<T>} key
     * @param {()=>T} constructor
     */
    getOrSet(key, constructor){
        let value=this.get(key)
        if(value===null){
            value=constructor()
            this.set(key,value)
        }
        return value
    }

    /**
     * @template T
     * @param {ModelKey<T>} key
     * @param {T?} value
     */
    set(key,value){
        if(value)this[key.name]=value
        else this.remove(key)
    }

    /**
     * @param {ModelKey<*>} key
     */
    remove(key){
        delete this[key.name]
    }
}

