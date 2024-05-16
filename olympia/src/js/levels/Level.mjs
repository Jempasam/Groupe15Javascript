import { World } from "../objects/world/World.mjs";
import { Camera } from "../../../../babylonjs/core/Cameras/camera.js"


export class LevelContext{

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
        if(this.current_level!=null){
            this.current_level.stop(this.world,this.options)
        }
        this.world.close()
        this.current_level=level
        this.current_level.start(this,this.world,this.options)
    }

    tick(){
        if(this.current_level!=null){
            this.current_level.tick(this,this.world,this.options)
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