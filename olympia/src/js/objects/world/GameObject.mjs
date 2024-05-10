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
 * @typedef {{model_key:ModelKey<*>}} KeyedModel
 */

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
     * @template A,B
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB
     * @param {(valA:A, valB:B)=>void} callback
     */
    apply2(keyA,keyB,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        callback(valA,valB)
    }

    /**
     * @template A,B,C
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB @param {ModelKey<C>} keyC
     * @param {(valA:A, valB:B, valC:C)=>void} callback
     */
    apply3(keyA,keyB,keyC,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        callback(valA,valB,valC)
    }

    /**
     * @template A,B,C,D
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB @param {ModelKey<C>} keyC @param {ModelKey<D>} keyD
     * @param {(valA:A, valB:B, valC:C, valD:D)=>void} callback
     */
    apply4(keyA,keyB,keyC,keyD,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        callback(valA,valB,valC,valD)
    }

    /**
     * @template A,B,C,D,E
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB @param {ModelKey<C>} keyC @param {ModelKey<D>} keyD @param {ModelKey<E>} keyE
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E)=>void} callback
     */
    apply5(keyA,keyB,keyC,keyD,keyE,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        callback(valA,valB,valC,valD,valE)
    }

    /**
     * @template A,B,C,D,E,F
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB @param {ModelKey<C>} keyC @param {ModelKey<D>} keyD @param {ModelKey<E>} keyE @param {ModelKey<F>} keyF
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F)=>void} callback
     */
    apply6(keyA,keyB,keyC,keyD,keyE,keyF,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        let valF=this.get(keyF); if(valF==null)return
        callback(valA,valB,valC,valD,valE,valF)
    }

    /**
     * @template A,B,C,D,E,F,G
     * @param {ModelKey<A>} keyA @param {ModelKey<B>} keyB @param {ModelKey<C>} keyC @param {ModelKey<D>} keyD @param {ModelKey<E>} keyE @param {ModelKey<F>} keyF @param {ModelKey<G>} keyG
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F, valG:G)=>void} callback
     */
    apply7(keyA,keyB,keyC,keyD,keyE,keyF,keyG,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        let valF=this.get(keyF); if(valF==null)return
        let valG=this.get(keyG); if(valG==null)return
        callback(valA,valB,valC,valD,valE,valF,valG)
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
     * @template {KeyedModel} T
     * @param {T} value
     */
    setAuto(value){
        this.set(value.model_key,value)
    }

    /**
     * @param {ModelKey<*>} key
     */
    remove(key){
        delete this[key.name]
    }
}

