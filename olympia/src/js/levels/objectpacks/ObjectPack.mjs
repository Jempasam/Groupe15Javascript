import { Behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { BehaviourEntry, World } from "../../objects/world/World.mjs";


/**
 * Un pack de behaviours de base pour la gestion des collisions et de la physique
 */
export class ObjectPack{

    /**
     * @param {World} world
     */
    constructor(world){
        this.world=world
        for(let [key,value] of Object.entries(this)){
            if(value instanceof BehaviourElement){
                value._setId(key.toLowerCase().replace(/[^a-z0-9_]/g,""))
            }
        }
    }

    static id_counter=34543
    #id(){ return ""+(ObjectPack.id_counter++) }

    /** @typedef {Behaviour|[Behaviour,number]} BehaviourToAdd*/
    /** @typedef {BehaviourToAdd|(()=>BehaviourToAdd)} BehaviourParam*/
    /**
     * @param {import("../../objects/world/TaggedDict.mjs").Tag[]|BehaviourParam} tags_or_behavour
     * @param {...(BehaviourParam)} behaviours
     * @returns {BehaviourElement}
     */
    behav(tags_or_behavour, ...behaviours){
        const marker={created:false}
        let tags
        let behaviour_list
        if(tags_or_behavour instanceof Behaviour || (tags_or_behavour?.[0] instanceof Behaviour) || tags_or_behavour['call'] ){
            behaviour_list=[tags_or_behavour,...behaviours]
            tags=[this.#id()]
        }
        else{
            behaviour_list=behaviours
            tags=[this.#id(), ...tags_or_behavour]
        }
        
        // @ts-ignore
        return new BehaviourElement( ()=>this.world.addBehaviours(tags, ...behaviour_list.map(a=>a['call']?a():a)), tags[0] )
    }

    /**
     * @template T
     * @param {()=>T} factory
     * @returns {()=>T}
     */
    lazy(factory){
        const ret=new LazyInit(factory)
        return ()=>ret.get()
    }

    empty(){
        return {id:this.#id(),entries:[]}
    }

}

/** @template T */
class LazyInit extends Function{

    /** @type {T?} */ #value=null

    /** @type {()=>T} */ #factory

    /** @param {()=>T} factory */
    constructor(factory){
        super()
        this.#factory=factory
    }

    get(){
        if(this.#value===null){
            this.#value=this.#factory()
        }
        return this.#value
    }
}

class BehaviourElement{

    /** @type {()=>BehaviourEntry[]} */ #factory
    /** @type {string} */ #id
    /** @type {BehaviourEntry[]} */ #entries
    /** @type {boolean} */ #created

    /**
     * @param {()=>BehaviourEntry[]} factory
     * @param {string} id 
     */
    constructor(factory,id){
        this.#factory=factory
        this.#id=id
        this.#created=false
    }

    #init(){
        if(!this.#created){
            this.#created=true
            this.#entries=this.#factory()
        }
    }

    get entries(){
        this.#init()
        return this.#entries
    }

    /** @type {string} */
    get id(){
        this.#init()
        return this.#id
    }

    _setId(id){
        this.#id=id+this.#id
    }
}