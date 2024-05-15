import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";



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
    }

    // Effects
    in_fire= this.behav(
        new PoisonBehaviour(1,20,60),
        ()=>new EmitterBehaviour(this._particle.FIRE(), new Vector3(1, 1, 1), 5),
    )

    in_tornado= this.behav(
        new ConstantForceBehaviour(new Vector3(0,0.3,0)),
        ()=>new EmitterBehaviour(this._particle.WIND(), new Vector3(1, 1, 1), 5),
    )
}