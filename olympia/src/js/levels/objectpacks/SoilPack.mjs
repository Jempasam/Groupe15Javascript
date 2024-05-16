import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { MOVEMENT, accelerate } from "../../objects/model/MovementModel.mjs";
import { TemporaryBehaviour } from "../../objects/behaviour/generic/TemporaryBehaviour.mjs";
import { JUMP } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { FightPack } from "./FightPack.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { behaviourOnContact } from "../../objects/behaviour/generic/OnContactBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { EffectPack } from "./EffectPack.mjs";


/**
 * Un pack de behaviours de base de sol de bases
 */
export class SoilPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {EffectPack} effect
     */
    constructor(world,effect){
        super(world)
        this._effect=effect
        this._physic=effect._particle._physic
        this._models=effect._particle._models
    }

    // Accelerating
    slidable= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>{
        const acc=m.inertia.normalize().scaleInPlace(0.2)
        console.log("slide")
        accelerate(m.inertia, acc.x*0.001, acc.y*0.001, acc.z*0.001, Math.abs(acc.x), Math.abs(acc.y), Math.abs(acc.z))
    })))

    slowing= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>m.inertia.scaleInPlace(0.5))))

    damaging= this.behav(behaviourOnContact({}, (_,o)=>o.apply(LIVING, l=>l.damage(1))))


    // Soil
    GROUND= this.lazy(()=>[...this._physic.STATIC(), this._models.block.id])
    LAVA= this.lazy(()=>[...this._physic.STATIC(), this.damaging.id, this._models.lava.id])
    MUD= this.lazy(()=>[...this._physic.STATIC(), this.slowing.id, this._models.mud.id])
    ICE= this.lazy(()=>[...this._physic.STATIC(), this.slidable.id, this._models.ice.id])
}