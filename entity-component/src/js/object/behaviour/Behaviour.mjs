import { GameObject, ObjectQuery, World } from "../GameObject.mjs"

let id_counter=0

export class Behaviour{

    /** @type number */
    id;

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
     * Finish the behaviour
     * Called everytime objects of associated tags are removed from the world
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    finish(world, ...objects){
        throw new Error("Undefined method")
    }
}