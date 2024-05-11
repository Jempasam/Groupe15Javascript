import { ObjectQuery, World } from "../world/World.mjs";

let id_counter=0

export class Behaviour{

    /** @type {number} */
    id;

    /** @type {string?}  */
    #unique_id=null

    constructor(){
        this.id=id_counter++
    }

    /**
     * Initialize the behaviour for many objects.
     * Called everytime objects of associated tags are added to the world
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    init(world, ...objects){
        throw new Error("Undefined method")
    }

    /**
     * Tick on all objects having at least one time this behaviour before individual ticks
     * @param {World} world 
     * @param {...ObjectQuery} objects 
     */
    tick(world, ...objects){
        throw new Error("Undefined method")
    }

    /**
     * Do the tick function of the behaviour should be called
     */
    doTick=true

    /**
     * Finish the behaviour
     * Called everytime objects of associated tags are removed from the world
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    finish(world, ...objects){
        throw new Error("Undefined method")
    }


    /**
     * Open the behaviour.
     * Called when the behaviour is added to the world
     * @param {World} world
     */
    open(world){

    }

    /**
     * Close the behaviour.
     * Called when the behaviour is removed from the world
     * @param {World} world
     */
    close(world){

    }

    /**
     * Returns a unique id for the behaviour
     * @param {string=} prefix 
     * @returns {string}
     */
    uniqueId(prefix=""){
        if(this.#unique_id==null)this.#unique_id=prefix+"_behav_"+this.constructor.name+"_"+this.id
        return this.#unique_id
    }
}