import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT } from "../../model/MovementModel.mjs";
import { giveTag, removeTag } from "../../model/SlotModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { JUMP, JumpModel } from "../controls/PlayerJumpBehaviour.mjs";


/**
 * Ajoute temporairement des tags, dans un ordre particulier pendant des periode de temps donnés et de manière cyclique.
 */
export class PhaseBehaviour extends Behaviour{

    /**
     * @param {{tags:import("../../world/TaggedDict.mjs").Tag[], duration:number, probability?:number}[]} phases Les phases
     */
    constructor(...phases){
        super()
        this.phases=phases
    }
    
    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects){
            obj.set([PHASE,this.uid],{loading:0, phase:0})
            giveTag(obj,...this.phases[0].tags)
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply([PHASE,this.uid], phase=>{
                phase.loading++
                if(phase.loading>this.phases[phase.phase].duration){
                    // Reset info and tags
                    removeTag(obj,...this.phases[phase.phase].tags)
                    phase.loading=0
                    
                    // Select next phase
                    do{
                        phase.phase=(phase.phase+1)%this.phases.length
                    }while((this.phases[phase.phase].probability??1)<Math.random())
                    
                    // Add tags
                    giveTag(obj, ...this.phases[phase.phase].tags)
                }
            })
        }
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects){
            obj.apply([PHASE,this.uid], p=>removeTag(obj, ...this.phases[p.phase].tags))
            obj.remove([PHASE,this.uid])
        }
    }
}

/** @type {ModelKey<{loading:number, phase:number}>} */
export const PHASE=new ModelKey("phase")