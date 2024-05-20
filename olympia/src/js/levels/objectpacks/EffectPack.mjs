import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { MOVEMENT } from "../../objects/model/MovementModel.mjs";
import { TemporaryBehaviour } from "../../objects/behaviour/generic/TemporaryBehaviour.mjs";
import { JUMP } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";
import { behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { TimedBehaviour } from "../../objects/behaviour/generic/TimedBehaviour.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { giveTag } from "../../objects/model/SlotModel.mjs";


/**
 * Un pack de behaviours de base d'effets temporaires.
 */
export class EffectPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {LivingPack} living
     */
    constructor(world,living){
        super(world)
        this._living=living
        this._particle=living._particle
        this._physic=this._particle._physic
        this._models=this._particle._models
        this._registerNames()
    }

    // Affiction
    smaller= this.behav( behaviourEach({ init(t){t.get(TRANSFORM)?.scale?.scaleInPlace(0.5)}, finish(t){t.get(TRANSFORM)?.scale?.scaleInPlace(2)} }) )
    bigger= this.behav( behaviourEach({ init(t){t.get(TRANSFORM)?.scale?.scaleInPlace(2)}, finish(t){t.get(TRANSFORM)?.scale?.scaleInPlace(0.5)} }) )
    infinite_jump= this.behav( behaviourEach(o => o.forAll(JUMP, j => j.remaining_jump=Math.max(j.remaining_jump, 1))) )
    slowed= this.behav( behaviourEach(o => o.get(MOVEMENT) ?.inertia .scaleInPlace(0.5) ) )
    slow_falling= this.behav( behaviourEach(o => o.get(MOVEMENT) ?.inertia .maximizeInPlaceFromFloats(Number.NEGATIVE_INFINITY,-0.05,Number.NEGATIVE_INFINITY) ) )
    fire_immune=this.empty()
    burning_damage=this.behav( tags(()=>this.fire_immune.id), new PoisonBehaviour(1,20) )

    // Affictions Groups
    SMALLER= this.lazy(()=>[this.smaller.id])
    BIGGER= this.lazy(()=>[this.bigger.id])
    INFINITE_JUMP= this.lazy(()=>[this.infinite_jump.id, this._particle.propulsion_emitter.id])
    PROPULSED= this.lazy(()=>[this._physic.high_anti_gravity.id, this._particle.wind_emitter.id, this._models.wind.id])
    SLOWED= this.lazy(()=>[this.slowed.id, this._particle.water_emitter.id])
    SLOW_FALLING= this.lazy(()=>[this.slow_falling.id, this._models.balloon.id])
    BURNING= this.lazy(()=>[this.burning_damage.id, this._particle.fire_emitter.id, this._particle.smoke_emitter.id, this._models.flame.id])

    // TEMPORARY
    timed_smaller=this.behav(()=>new TimedBehaviour(200, this.SMALLER()))
    timed_bigger=this.behav(()=>new TimedBehaviour(200, this.BIGGER()))
    timed_infinite_jump=this.behav(()=>new TimedBehaviour(100, this.INFINITE_JUMP()))
    timed_propulsed=this.behav(()=>new TimedBehaviour(40, this.PROPULSED()))
    timed_slowed=this.behav(()=>new TimedBehaviour(100, this.SLOWED()))
    timed_slow_falling=this.behav(()=>new TimedBehaviour(100, this.SLOW_FALLING()))
    timed_burning=this.behav(()=>new TimedBehaviour(100, this.BURNING()))

    // Give on collision
    /**
     * @param {import("../../objects/world/TaggedDict.mjs").Tag[]} tags
     */
    behaviourCollide(...tags){
        return behaviourObserve(ON_COLLISION,(_,{object})=>{
            if(object.world.age%10==0 && object.tags.includes(this._living.living.id)) giveTag(object,...tags)
        })
    }

    give_burning= this.behav(()=>this.behaviourCollide(this.timed_burning.id))
    give_smaller= this.behav(()=>this.behaviourCollide(this.timed_smaller.id))
    give_slowed= this.behav(()=>this.behaviourCollide(this.timed_slowed.id))
}

