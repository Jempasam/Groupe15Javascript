


let id_counter=0

/* --- KEYS --- */
/**
 * Une clé de modèle.
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
 * Une clé de modèle associé à un identifiant textuel, permet d'avoir plusieurs
 * modèles avec la même ModelKey.
 * @template T
 * @typedef {[ModelKey<T>,string]} TaggedModelKey
 */

/**
 * Une clé de modèle ou une clé de modèle taggée.
 * @template T
 * @typedef {TaggedModelKey<T>|ModelKey<T>} AnyModelKey
 */


/* --- MODELS --- */
/**
 * Un modèle qui a une méthode pour récupérer sa clé.
 * @typedef {{model_key:ModelKey<*>}} KeyedModel
 */

/**
 * Un paire de clé et de modèle.
 * @template T
 * @typedef {[AnyModelKey<T>,T]} ModelPair
 */

/**
 * Un modèle associé à une clé sous forme d'une paire [clé,modèle] ou juste d'un modèle avec une méthode model_key.
 * @typedef {KeyedModel|ModelPair<*>} ModelAndKey
 */


/**
 * Represents a game object.
 * @satisfies {any}
 * @class
 */
export class ModelHolder{
    
    /* --- GETTERS --- */

    /** @type {ModelHolder?} */
    _parentModelHolder=null

    /**
     * @template T
     * @param {AnyModelKey<T>} model_key
     * @returns {string} 
     */
    #anyKeyToId(model_key){
        if(Array.isArray(model_key))return model_key[1]
        return "_"+model_key.name
    }

    /**
     * @template T
     * @param {AnyModelKey<T>} model_key
     * @returns {any} 
     */
    #anyKeyToThis(model_key){
        if(Array.isArray(model_key))return this["_sub_"+model_key[0].name] ??= {}
        return this
    }

    /**
     * @template T
     * @param {ModelKey<T>} key 
     * @param {(value:T)=>void} callback 
     */
    forAll(key, callback){
        const main=this.get(key)
        if(main)callback(main)
        if(this["_sub_"+key.name])for(const sub of Object.values(this["_sub_"+key.name])) callback(sub)
        if(this._parentModelHolder)this._parentModelHolder.forAll(key,callback)
    }



    /**
     * @template T
     * @param {AnyModelKey<T>} key
     * @returns {T?}
     */
    get(key){
        return this.#anyKeyToThis(key)[this.#anyKeyToId(key)] ?? this._parentModelHolder?.get(key) ?? null
    }

    /**
     * @template T,R
     * @param {AnyModelKey<T>} key
     * @param {(value:T)=>R} callback
     * @returns {R=}
     */
    apply(key,callback){
        let value=this.get(key)
        if(value!==null)return callback(value)
        return
    }

    /**
     * @template A,B,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB
     * @param {(valA:A, valB:B)=>R} callback
     * @returns {R=}
     */
    apply2(keyA,keyB,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        return callback(valA,valB)
    }

    /**
     * @template A,B,C,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC
     * @param {(valA:A, valB:B, valC:C)=>R} callback
     * @returns {R=}
     */
    apply3(keyA,keyB,keyC,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        let valC=this.get(keyC); if(valC==null)return undefined
        return callback(valA,valB,valC)
    }

    /**
     * @template A,B,C,D,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD
     * @param {(valA:A, valB:B, valC:C, valD:D)=>R} callback
     * @returns {R=}
     */
    apply4(keyA,keyB,keyC,keyD,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        let valC=this.get(keyC); if(valC==null)return undefined
        let valD=this.get(keyD); if(valD==null)return undefined
        return callback(valA,valB,valC,valD)
    }

    /**
     * @template A,B,C,D,E,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E)=>R} callback
     * @returns {R=}
     */
    apply5(keyA,keyB,keyC,keyD,keyE,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        let valC=this.get(keyC); if(valC==null)return undefined
        let valD=this.get(keyD); if(valD==null)return undefined
        let valE=this.get(keyE); if(valE==null)return undefined
        return callback(valA,valB,valC,valD,valE)
    }

    /**
     * @template A,B,C,D,E,F,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE @param {AnyModelKey<F>} keyF
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F)=>R} callback
     * @returns {R=}
     */
    apply6(keyA,keyB,keyC,keyD,keyE,keyF,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        let valC=this.get(keyC); if(valC==null)return undefined
        let valD=this.get(keyD); if(valD==null)return undefined
        let valE=this.get(keyE); if(valE==null)return undefined
        let valF=this.get(keyF); if(valF==null)return undefined
        return callback(valA,valB,valC,valD,valE,valF)
    }

    /**
     * @template A,B,C,D,E,F,G,R
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE @param {AnyModelKey<F>} keyF @param {AnyModelKey<G>} keyG
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F, valG:G)=>R} callback
     * @returns {R=}
     */
    apply7(keyA,keyB,keyC,keyD,keyE,keyF,keyG,callback){
        let valA=this.get(keyA); if(valA==null)return undefined
        let valB=this.get(keyB); if(valB==null)return undefined
        let valC=this.get(keyC); if(valC==null)return undefined
        let valD=this.get(keyD); if(valD==null)return undefined
        let valE=this.get(keyE); if(valE==null)return undefined
        let valF=this.get(keyF); if(valF==null)return undefined
        let valG=this.get(keyG); if(valG==null)return undefined
        return callback(valA,valB,valC,valD,valE,valF,valG)
    }



    /* --- SETTERS --- */

    /**
     * @template T
     * @param {AnyModelKey<T>} key
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
     * @param {AnyModelKey<T>} key
     * @param {T?} value
     */
    set(key,value){
        if(value)this.#anyKeyToThis(key)[this.#anyKeyToId(key)]=value
        else this.remove(key)
    }
    
    /**
     * @template {ModelAndKey} T
     * @param {T} value
     */
    setAuto(value){
        if(Array.isArray(value))this.set(value[0],value[1])
        else this.set(value.model_key,value)
    }


    /* --- REMOVERS --- */

    /**
     * @param {AnyModelKey<*>} key
     */
    remove(key){
        delete this.#anyKeyToThis(key)[this.#anyKeyToId(key)]
    }
}