import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { fastRemove } from "../../../../../../samlib/Array.mjs"
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs"
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
 * @param {...(import("../../world/ModelHolder.mjs").ModelAndKey|null)} models
 */
export function invocate(world, invoker, invocation, ...models){
    let size= fromVectorLike(invocation.size)
    let team= invocation.team
    let copyRotation= invocation.copyRotation

    const obj=world.addDef(invocation, ...models)
    obj.getOrSet(TRANSFORM,()=>new TransformModel({}))

    // Team
    if(obj.get(TEAM)!=null){}
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
    
    invoker.observers(ON_INVOCATION).notify({invoker,invocation:obj})
    return obj
}

/**
 * 
 * @param {World} world 
 * @param {GameObject} invoker 
 * @param {Invocation} invocation 
 * @param {Vector3} direction 
 * @param  {...any} models 
 */
export function invocateToward(world, invoker, invocation, direction, ...models){
    // Summon the invocation
    const summoned=invocate(world, invoker, invocation,
        invoker.apply(TRANSFORM, tf=>new TransformModel({position:tf.position}))??null,
        ...models
    )

    // Move it in the direction
    direction=direction.normalizeToNew()
    const invokerTf= invoker.get(TRANSFORM)
    const summonedTf= summoned.get(TRANSFORM)
    if(invokerTf && summonedTf){
        summonedTf.position
            .copyFrom(invokerTf.position.clone())
            .addInPlace(invokerTf.scale .add(summonedTf.scale) .multiply(direction) .scale(0.6))
    }
    return summoned
}

/** @type {ObserverKey<{invoker:GameObject, invocation: GameObject}>} */
export const ON_INVOCATION=new ObserverKey("on_invocation")