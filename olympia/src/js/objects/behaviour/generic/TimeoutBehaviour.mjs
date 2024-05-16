import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT } from "../../model/MovementModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { JUMP, JumpModel } from "../controls/PlayerJumpBehaviour.mjs";


/**
 * Appelle une fonction au bout d'un certain temps
 */
export class TimeoutBehaviour extends Behaviour{

    /**
     * @param {number} duration
     */
    constructor(duration){
        super()
        this.duration=duration
    }
    
    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects) obj.set([TIMEOUT,this.uid],{remaining_time:this.duration})
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply([TIMEOUT,this.uid], timeout=>{
                if(timeout.remaining_time==0){
                    this.on_time_out(obj,world,objects)
                    timeout.remaining_time=-1
                }
                else if(timeout.remaining_time>0)timeout.remaining_time--
            })
        }
    }

    /**
     * @param {GameObject} target
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    on_time_out(target, world, objects){
        throw new Error("Function on_time_out not implemented")
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects) obj.remove([TIMEOUT,this.uid])
    }
}

/** @type {ModelKey<{remaining_time:number}>} */
export const TIMEOUT=new ModelKey("timeout")

/**
 * @param {number} duration
 * @param {TimeoutBehaviour['on_time_out']} on_timeout 
 */
export function behaviourTimeout(duration,on_timeout){
    const ret=new TimeoutBehaviour(duration)
    ret.on_time_out=on_timeout
    return ret
}