import { isKeyPressed } from "../../controls/Keyboard.mjs";
import { DTarget } from "../../display/Display.mjs";
import { Drawable } from "../../drawable/Drawable.mjs";
import { World } from "../GameObject.mjs";


export class Plugin{

    /**
     * @returns {[number,number,number]}
     */
    get minimum_size(){ throw new Error("Not implemented") }

    /**
     * @param {Element} parent
     * @param {DTarget} target
     * @param {World} world
     */
    init(parent, target, world){
        throw new Error("Not implemented")
    }

    /**
     * @param {Element} parent
     * @param {DTarget} target
     * @param {World} world
     */
    logicTick(parent, target, world){
        throw new Error("Not implemented")
    }

    /**
     * @param {Element} parent
     * @param {DTarget} target
     * @param {World} world
     */
    drawTick(parent, target, world){
        throw new Error("Not implemented")
    }
}

/**
 * Create and tick a world
 * @param {DTarget} target
 * @param {Plugin[]} plugins 
 * @returns {{stop: function():void}}
 */
export function tickWorld(parent, target, plugins, logic_frame_rate=30){
    let width=0
    let height=0
    let depth=0
    
    // Get size
    for(let plugin of plugins){
        let [w,h,d]=plugin.minimum_size
        width=Math.max(width,w)
        height=Math.max(height,h)
        depth=Math.max(depth,d)
    }

    let stopper= {
        _stop: false,
        stop(){
            this._stop=true
        }
    }

    // Create World
    let world=new World(width,height,depth)

    // Init
    for(let plugin of plugins){
        plugin.init(parent,target,world)
    }

    // Display Loop
    requestAnimationFrame(function draw(){
        target.start()
        world.drawOnTarget(target)
        for(let plugin of plugins){
            plugin.drawTick(parent,target,world)
        }
        if(!stopper._stop)requestAnimationFrame(draw)
        target.end()
    })

    setTimeout(function tick(){
        world.tick()
        for(let plugin of plugins){
            plugin.logicTick(parent,target,world)
        }
        if(!stopper._stop)setTimeout(tick,logic_frame_rate)
    },logic_frame_rate)

    return stopper
}