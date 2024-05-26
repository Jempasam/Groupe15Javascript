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
import { PlayerPack } from "./PlayerPack.mjs";


/**
 * Un pack de behaviours de base d'effets temporaires.
 */
export class PlayerBonusPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {PlayerPack} player
     */
    constructor(world,player){
        super(world)
        this._player=player
    }

    // Affiction
    //jump_giver= this.behav(tags)
}

