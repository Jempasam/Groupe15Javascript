import { Behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { TaggedDict } from "../../objects/world/TaggedDict.mjs";
import { BehaviourEntry, World } from "../../objects/world/World.mjs";


/** @typedef {import("../../objects/world/TaggedDict.mjs").Tag} Tag*/


/**
 * @param {...(()=>Tag)} tags
 * @returns {{is_tag_list:0, builder:()=>Tag[]}}
 */
export function tags(...tags){
    return {is_tag_list:0, builder:()=>tags.map(a=>a())}
}


/**
 * Un pack de behaviours de base pour la gestion des collisions et de la physique
 */
export class ObjectPack{

    /**
     * @param {World} world
     */
    constructor(world){
        this.world=world
    }

    /** @type {{[key:Tag]:string}} */
    static #tag_names={}
    static #tag_colors={}

    _registerNames(){
        for(let [key,value] of Object.entries(this)){
            if(value instanceof BehaviourElement){
                //value._setId(key)
            }
            if(typeof value=="object" && ["number","string"].includes(typeof value.id)){
                ObjectPack.#tag_names[value.id]=this.modifyNames(key)
                const c=()=>"123456789A"[Math.floor(Math.random()*10)]
                ObjectPack.#tag_colors[value.id]="#"+c()+c()+c()+c()+c()+c()
            }
        }
    }

    modifyNames(str){return str}

    /** @param {Tag} tag @returns {string?}*/
    static getName(tag){ return ObjectPack.#tag_names[tag]??null}

    /** @param {Tag} tag @returns {string?}*/
    static getColor(tag){ return ObjectPack.#tag_colors[tag]??null}

    static id_counter=34543
    #id(){ return ""+(ObjectPack.id_counter++) }


    /** @typedef {Behaviour|[Behaviour,number]} BehaviourToAdd*/
    /** @typedef {BehaviourToAdd|(()=>BehaviourToAdd)} BehaviourParam*/
    /**
     * @param {{is_tag_list:0, builder:()=>Tag[]}|BehaviourParam} tags_or_behavour
     * @param {...(BehaviourParam)} behaviours
     * @returns {BehaviourElement}
     */
    behav(tags_or_behavour, ...behaviours){
        const marker={created:false}
        let tagfactory
        let behaviour_list
        const id=this.#id()
        if(tags_or_behavour['is_tag_list']===0){
            behaviour_list=behaviours
            // @ts-ignore
            tagfactory=()=>[...tags_or_behavour.builder()]
        }
        else{
            behaviour_list=[tags_or_behavour,...behaviours]
            tagfactory=()=>[]
        }
        
        // @ts-ignore
        return new BehaviourElement( (id)=>this.world.addBehaviours([id,...tagfactory()], ...behaviour_list.map(a=>a['call']?a():a)), id )
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

    /** @type {(id)=>BehaviourEntry[]} */ #factory
    /** @type {string} */ #id
    /** @type {BehaviourEntry[]} */ #entries
    /** @type {boolean} */ #created

    /**
     * @param {()=>BehaviourEntry[]} factory
     * @param {string} id
     */
    constructor(factory,id){
        this.#factory=factory
        this.#created=false
        this.#id=id
    }

    #init(){
        if(!this.#created){
            this.#created=true
            this.#entries=this.#factory(this.#id)
        }
    }

    get entries(){  
        this.#init()
        return this.#entries
    }

    get behaviour(){
        return this.entries[0].behaviour
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