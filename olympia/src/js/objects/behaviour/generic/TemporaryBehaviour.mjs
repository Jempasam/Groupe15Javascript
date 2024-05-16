import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT } from "../../model/MovementModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { JUMP, JumpModel } from "../controls/PlayerJumpBehaviour.mjs";


/**
 * Inflige régulièrement des dégats avant de disparaitre.
 */
export class TemporaryBehaviour extends Behaviour{

    /**
     * @param {number} duration
     * @param {import("../../world/TaggedDict.mjs").Tag[]} extra_removed Other tags to be removeds
     */
    constructor(duration, extra_removed=[]){
        super()
        this.duration=duration
        this.extra_removed=extra_removed
    }
    
    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects) obj.set([TEMPORARY,this.uid],{remaining_time:this.duration})
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply([TEMPORARY,this.uid], (temporary)=>{
                temporary.remaining_time--
                if(temporary.remaining_time<0){
                    obj.removeTag(...objects.tags)
                    obj.removeTag(...this.extra_removed)
                }
            })
        }
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects) obj.remove([TEMPORARY,this.uid])
    }
}

/** @type {ModelKey<{remaining_time:number}>} */
export const TEMPORARY=new ModelKey("temporary")