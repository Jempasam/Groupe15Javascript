import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { MOVEMENT, accelerate, accelerateY } from "../../objects/model/MovementModel.mjs";
import { TemporaryBehaviour } from "../../objects/behaviour/generic/TemporaryBehaviour.mjs";
import { JUMP } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { FightPack } from "./FightPack.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { behaviourOnContact } from "../../objects/behaviour/generic/OnContactBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { EffectPack } from "./EffectPack.mjs";
import { PathBehaviour } from "../../objects/behaviour/movement/PathBehaviour.mjs";
import { LivingPack } from "./LivingPack.mjs";


/**
 * Un pack de behaviours de base de sol de bases
 */
export class SoilPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {EffectPack} effect
     * @param {LivingPack} living
     */
    constructor(world,effect,living){
        super(world)
        this._effect=effect
        this._physic=effect._particle._physic
        this._living=living
        this._models=effect._particle._models
        this._particle=effect._particle

    }

    // Accelerating
    slidable= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>{
        const acc=m.inertia.normalize().scaleInPlace(0.2)
        accelerate(m.inertia, acc.x*0.001, acc.y*0.001, acc.z*0.001, Math.abs(acc.x), Math.abs(acc.y), Math.abs(acc.z))
    })))

    slowing= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>m.inertia.scaleInPlace(0.5))))

    damaging= this.behav( tags(()=>this._living.living.id), behaviourOnContact({},(_,o)=>o.apply(LIVING, l=>{
        l.damage(1)
    })))

    burning= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>{
        if(object.tags.includes(this._living.living.id)) object.addTag(this._effect.in_fire.id)
    }))

    jumping= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>{
        object.apply(MOVEMENT, m=> accelerateY(m.inertia, 1, 0.5))
    }))


    // Soil
    GROUND= this.lazy(()=>[this._models.block.id])
    LAVA= this.lazy(()=>[this.damaging.id, this._models.lava.id])
    MUD= this.lazy(()=>[this.slowing.id, this._models.mud.id])
    ICE= this.lazy(()=>[this.slidable.id, this._models.ice.id])
    FIRE= this.lazy(()=>[this._models.flame.id, this.burning.id, this._particle.smoke_emitter.id])
    TRAMPOLINE= this.lazy(()=>[this.jumping.id, this._models.trampoline.id])


    // Moving
    elevator2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,1,0)], 0.1, 0.01, 0.02))
    elevator4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,2,0)], 0.1, 0.01, 0.02))
    elevator8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02))
    elevatorG=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,8,0)], 0.1, 0.01, 0.02))
    forward2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,-3)], 0.1, 0.01, 0.02))
    forward4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,-6)], 0.1, 0.01, 0.02))
    forward8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,-12)], 0.1, 0.01, 0.02))
    backward2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,3)], 0.1, 0.01, 0.02))
    backward4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,6)], 0.1, 0.01, 0.02))
    backward8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,0,12)], 0.1, 0.01, 0.02))
    right2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(-3,0,0)], 0.1, 0.01, 0.02))
    right4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(-6,0,0)], 0.1, 0.01, 0.02))
    right8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(-12,0,0)], 0.1, 0.01, 0.02))
    left2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(3,0,0)], 0.1, 0.01, 0.02))
    left4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(6,0,0)], 0.1, 0.01, 0.02))
    left8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(12,0,0)], 0.1, 0.01, 0.02))
    rotate_side4=this.behav(new PathBehaviour([new Vector3(2,0,0),new Vector3(2,4,0),new Vector3(-2,4,0),new Vector3(-2,0,0)], 0.1, 0.01, 0.02))
    rotate_side8=this.behav(new PathBehaviour([new Vector3(4,0,0),new Vector3(4,8,0),new Vector3(-4,8,0),new Vector3(-4,0,0)], 0.1, 0.01, 0.02))
    
    // Slow Door
    slow_door4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,3,0)], 0.1, 0.001, 0.0015))
}