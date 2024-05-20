import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT } from "../../model/MovementModel.mjs";
import { giveTag, removeTag } from "../../model/SlotModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { JUMP, JumpModel } from "../controls/PlayerJumpBehaviour.mjs";


/**
 * Ajoute des tags à un objet temporairement. Puis les retire en finissant en ajoutant de nouveaux.
 * Retire aussi ce propre tag en finissant.
 */
export class TimedBehaviour extends Behaviour{

    /**
     * @param {number} duration
     * @param {import("../../world/TaggedDict.mjs").Tag[]} tags Les tags à ajouter temporairement.
     * @param {import("../../world/TaggedDict.mjs").Tag[]} final_tags Les tags à ajouter en finissant.
     */
    constructor(duration, tags=[], final_tags=[]){
        super()
        this.duration=duration
        this.tags=tags
        this.final_tags=final_tags
    }
    
    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects){
            obj.set([TIMED,this.uid],{remaining_time:this.duration})
            giveTag(obj,...this.tags)
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply([TIMED,this.uid], temporary=>{
                temporary.remaining_time--
                if(temporary.remaining_time<0){
                    removeTag(obj, ...this.tags)
                    removeTag(obj, ...objects.tags)
                    giveTag(obj, ...this.final_tags)
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
            obj.remove([TIMED,this.uid])
        }
    }
}

/** @type {ModelKey<{remaining_time:number}>} */
export const TIMED=new ModelKey("timed")