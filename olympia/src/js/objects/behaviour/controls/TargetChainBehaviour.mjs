import { Quaternion, Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { TEAM, do_team_with } from "../../model/TeamModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";


/**
 * @typedef {(self:TransformModel,ennemy:TransformModel)=>Vector3?} Task
 */

/**
 * @param {Vector3} offset
 * @returns {Task}
 * */
export function FOLLOW(offset=Vector3.Zero()){
    return (self,ennemy)=>{
        return ennemy.position.add(offset)
    }
}

/**
 * Move to the target with an offset relative to the direction of the target:
 * While looking at the target, x is the right direction, y is the up direction, z is the forward direction
 * @param {Vector3} offset
 * @returns {Task}
 * */
export function FOLLOW_RELATIVE(offset){
    return (self,ennemy)=>{
        const forward=ennemy.position.subtract(self.position)
        forward.y=0
        forward.normalize()
        const right=new Vector3(-forward.z,0,forward.x)
        const pos=forward.scaleInPlace(offset.z).addInPlace(right.scaleInPlace(offset.x)).addInPlace(Vector3.Up().scaleInPlace(offset.y))
        return ennemy.position.add(pos)
    }
}

/**
 * @param {number} distance
 * @returns {Task}
 */
export function ESCAPE(distance){
    return (self,ennemy)=>{
        const offset=self.position.subtract(ennemy.position)
        offset.normalize().scaleInPlace(distance)
        return offset
    }
}

/** @type {Task} */
export function STAY(self,ennemy){
    return self.position
}

/**
 * @param {Vector3} position
 * @returns {Task}
 */
export function GO_TO(position){
    return (self)=>self.position.add(position)
}

/**
 * @param {...Task} tasks
 * @returns {Task}
 */
export function  RANDOM(...tasks){
    return (self,ennemy)=>tasks[Math.floor(Math.random()*tasks.length)](self,ennemy)
}

/**
 * Move relative to the direction of the target:
 * While looking at the target, x is the right direction, y is the up direction, z is the forward direction
 * @param {Vector3} position
 * @returns {Task}
 */
export function GO_TO_RELATIVE(position){
    return (self,ennemy)=>{
        const forward=ennemy.position.subtract(self.position)
        forward.y=0
        forward.normalize()
        const right=new Vector3(-forward.z,0,forward.x)
        const pos=forward.scaleInPlace(position.z).addInPlace(right.scaleInPlace(position.x)).addInPlace(Vector3.Up().scaleInPlace(position.y))
        return self.position.add(pos)
    }
}


/**
 * Un chaîne de tâche de déplacement à effectuer.
 */
export class TargetChainBehaviour extends Behaviour{
    /**
     * @typedef {[task:Task, acceleration:number, max_speed:number, duration:number, repetition?:number]} TaskEntry
     */
    /**
     * @param {number} follow_distance
     * @param {(TaskEntry|{random:TaskEntry[]})[]} tasks
     */
    constructor(follow_distance, tasks){
        super()
        this.follow_distance=follow_distance
        this.tasks=tasks
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.set([LOCAL,this.uid],{
                target_pos:Vector3.Zero(), 
                target_loading:Number.MAX_SAFE_INTEGER, 
                target_index:this.tasks.length-1, 
                target_task:[STAY,0,0,0], 
                current_repetition:Number.MAX_SAFE_INTEGER
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    tick(world, objects, targets){
        for(const obj of objects){
            const local=obj.get([LOCAL,this.uid]) ; if(!local)continue
            const objpos=obj.get(TRANSFORM); if(!objpos)continue
            const current_task=local.target_task
            local.target_loading++
            // Get the new target position
            if(local.target_loading>current_task[3]){
                local.target_loading=0
                local.current_repetition++
                if(local.current_repetition>=(local.target_task[4]??1)){
                    local.current_repetition=0
                    local.target_index=(local.target_index+1)%this.tasks.length
                    const newtask=this.tasks[local.target_index]
                    //@ts-ignore
                    if(newtask.random)local.target_task=newtask.random[Math.floor(Math.random()*newtask.random.length)]
                    //@ts-ignore
                    else local.target_task=newtask
                }
                // Get a target in the follow distance
                let found=null
                for(const target of targets){
                    if(do_team_with(obj,target,true))continue
                    const tarp=target.get(TRANSFORM); if(!tarp)continue
                    const offset=tarp.position.subtract(objpos.position)
                    if(offset.length()<=this.follow_distance){
                        found=tarp
                        break
                    }
                }
                if(!found)found=objpos
                
                // Get the position
                local.target_pos=local.target_task[0](objpos,found) ?? found.position
            }
            
            // Move toward the target
            obj.apply(MOVEMENT, m=>{
                const offset=local.target_pos.subtract(objpos.position)
                offset.normalize()
                const spd=current_task[1]
                const max=current_task[2]
                accelerate(
                    m.inertia,
                    offset.x*spd, offset.y*spd, offset.z*spd,
                    Math.abs(offset.x*max), Math.abs(offset.y*max), Math.abs(offset.z*max)
                )
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([LOCAL,this.uid])
        }
    }
}


/** @type {ModelKey<{target_pos:Vector3, target_index:number, target_task:TaskEntry, target_loading:number, current_repetition:number}>} */
const LOCAL=new ModelKey("targetchain")