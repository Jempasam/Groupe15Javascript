import { World } from "../objects/world/World.mjs";
import { Camera } from "../../../../babylonjs/core/Cameras/camera.js"


export class LevelContext{

    /** @type {Level?} */#level=null

    /**
     * @param {World} world 
     * @param {{camera:Camera}} options
     */
    constructor(world,options){
        this.world=world
        this.options=options
    }

    /** @type {Level?} */
    current_level=null
    
    /**
     * @param {Level} level 
     */
    switchTo(level){
        this.#level=level
    }

    tick(){
        if(this.current_level!=null){
            this.current_level.tick(this,this.world,this.options)
        }
        if(this.#level!=null){
            if(this.current_level!=null){
                this.current_level.stop(this.world,this.options)
            }
            this.world.close()
            this.current_level=this.#level
            this.current_level.start(this,this.world,this.options)
            this.#level=null
        }
    }
}

export class Level{

    /**
     * Called when the level is started
     * @param {LevelContext} context
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    start(context,world,options){
        throw new Error("Not implemented")
    }

    /**
     * Called each tick when the world is running
     * @param {LevelContext} context
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    tick(context,world,options){
        throw new Error("Not implemented")
    }

    /**
     * Called when the level is finished.
     * It can restart after.
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    stop(world,options){
        throw new Error("Not implemented")
    }
}