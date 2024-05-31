import { World } from "../objects/world/World.mjs";
import { Camera } from "../../../../babylonjs/core/Cameras/camera.js"
import { ModelKey } from "../objects/world/ModelHolder.mjs";


/** @type {ModelKey<LevelContext>} */
export const LEVEL_CONTEXT=new ModelKey("level_context")

/** @type {ModelKey<()=>Level>} */
export const NEXT_LEVEL=new ModelKey("level")

/** @type {ModelKey<()=>Level>} */
export const CURRENT_LEVEL=new ModelKey("current_level")

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
            this.world.model.set(LEVEL_CONTEXT,this)
            const level=this.#level
            this.world.model.set(CURRENT_LEVEL,()=>level)
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
    }

    /**
     * Called each tick when the world is running
     * @param {LevelContext} context
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    tick(context,world,options){
    }

    /**
     * Called when the level is finished.
     * It can restart after.
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    stop(world,options){
    }
}