import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { MOVEMENT } from "../../objects/model/MovementModel.mjs";
import { TemporaryBehaviour } from "../../objects/behaviour/generic/TemporaryBehaviour.mjs";
import { JUMP } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";



/**
 * Un pack de behaviours de base d'effets temporaires.
 */
export class EffectPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {ParticlePack} particle
     */
    constructor(world,particle){
        super(world)
        this._particle=particle
        this._models=particle._models
    }

    // Effects
    in_fire= this.behav(
        new PoisonBehaviour(1,20,60),
        new TemporaryBehaviour(60),
        ()=>new EmitterBehaviour(this._particle.FIRE(), new Vector3(1, 1, 1), 5),
        ()=>new EmitterBehaviour(this._particle.SMOKE(), new Vector3(1, 1, 1), 5),
        ()=>this._models.flame.entries[0].behaviour
    )

    in_tornado= this.behav(
        new TemporaryBehaviour(40),
        new ConstantForceBehaviour(new Vector3(0,0.3,0)),
        ()=>new EmitterBehaviour(this._particle.WIND(), new Vector3(1, 1, 1), 5),
    )

    propulsed= this.behav(
        new TemporaryBehaviour(60),
        behaviourEach(o => o.forAll(JUMP, j => j.remaining_jump=Math.max(j.remaining_jump, 1))),
        ()=>new EmitterBehaviour(this._particle.PROPULSION(), new Vector3(.4, .4, .4), 15),
    )

    slowness= this.behav(
        new TemporaryBehaviour(80),
        behaviourEach(o => o.get(MOVEMENT) ?.inertia .scaleInPlace(0.5) ),
        ()=>new EmitterBehaviour(this._particle.WATER(), new Vector3(0.5, 0.5, 0.5), 15),
    )

    slow_falling= this.behav(
        new TemporaryBehaviour(60),
        behaviourEach(o => o.get(MOVEMENT) ?.inertia .maximizeInPlaceFromFloats(Number.NEGATIVE_INFINITY,-0.05,Number.NEGATIVE_INFINITY) ),
        ()=>new EmitterBehaviour(this._particle.PROPULSION(), new Vector3(.8, .8, .8), 5),
    )

    // Emitters
    
}