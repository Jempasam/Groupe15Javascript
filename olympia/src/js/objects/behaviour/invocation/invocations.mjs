import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { fastRemove } from "../../../../../../samlib/Array.mjs"
import { fromVectorLike } from "../../../typeutils/VectorLike.mjs"
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs"
import { TEAM, Team } from "../../model/TeamModel.mjs"
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { Behaviour } from "../Behaviour.mjs"


/**
 * @typedef {import("../../world/World.mjs").ObjectDefinition} ObjectDefinition
 * @typedef {{
 *  size?: import("../../../typeutils/VectorLike.mjs").VectorLike,
 *  team?: Team|null,
 *  copyRotation?:boolean
 * } & ObjectDefinition} Invocation
 *  
 */

/**
 * 
 * @param {World} world 
 * @param {GameObject} invoker 
 * @param {Invocation} invocation
 * @param {...import("../../world/ModelHolder.mjs").ModelAndKey} models
 */
export function invocate(world, invoker, invocation, ...models){
    let size= fromVectorLike(invocation.size)
    let team= invocation.team
    let copyRotation= invocation.copyRotation

    const obj=world.addDef(invocation, ...models)
    obj.getOrSet(TRANSFORM,()=>new TransformModel({}))

    // Team
    if(team===undefined)invoker.apply(TEAM, team=>obj.set(TEAM,team))
    else if(team!==null)obj.set(TEAM,team)

    // Size
    if(size){
        obj.apply(TRANSFORM, tf=>{
            invoker.apply(TRANSFORM, tfi=>{
                const mindim=Math.min(tfi.scale.x,tfi.scale.z)
                tf.scale.copyFrom(size.scale(mindim))
            })
        })
    }

    // Rotation
    if(copyRotation)obj.apply(TRANSFORM, tf=> invoker.apply(TRANSFORM, tfi=> tf.rotation.copyFrom(tfi.rotation)))
    return obj
}
