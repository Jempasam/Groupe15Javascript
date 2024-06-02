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
import { giveTag } from "../../objects/model/SlotModel.mjs";
import { ElectronicPack } from "./ElectronicPack.mjs";
import { invocateToward } from "../../objects/behaviour/invocation/invocations.mjs";
import { ElectronicBehaviour, ON_POWERED } from "../../objects/behaviour/electronics/ElectronicBehaviours.mjs";
import { ON_HITTED } from "../../objects/behaviour/life/ProjectileBehaviour.mjs";
import { FollowStraightBehaviour } from "../../objects/behaviour/controls/FollowStraightBehaviour.mjs";


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
        this._living=effect._living
        this._models=effect._particle._models
        this._particle=effect._particle
        this._registerNames()
    }

    // Accelerating
    slidable= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>{
        const acc=m.inertia.normalize().scaleInPlace(0.2)
        accelerate(m.inertia, acc.x*0.001, acc.y*0.001, acc.z*0.001, Math.abs(acc.x), Math.abs(acc.y), Math.abs(acc.z))
    })))

    slowing= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>object.apply(MOVEMENT, m=>m.inertia.scaleInPlace(0.5))))

    watery= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>{
        object.apply(MOVEMENT, m=>{
            m.inertia.x*=0.9
            if(m.inertia.y<0)m.inertia.y*=0.7
            m.inertia.z*=0.9
        })
        object.forAll(JUMP, j=>j.remaining_jump=Math.max(j.remaining_jump,1))
    }))

    damaging= this.behav( tags(()=>this._living.living.id), behaviourOnContact({},(_,o)=>o.apply(LIVING, l=>{
        l.damage(1)
    })))

    jumping= this.behav(behaviourObserve(ON_COLLISION,(_,{object})=>{
        object.apply(MOVEMENT, m=> accelerateY(m.inertia, 1, 0.5))
    }))

    following= this.behav(tags(()=>this._living.living.id), new FollowStraightBehaviour(50, .02, .05))


    // Soil
    GROUND= this.lazy(()=>[this._models.block.id])
    LAVA= this.lazy(()=>[this.damaging.id, this._models.lava.id])
    MUD= this.lazy(()=>[this.slowing.id, this._models.mud.id])
    WATER= this.lazy(()=>[this.watery.id, this._models.water.id])
    ICE= this.lazy(()=>[this.slidable.id, this._models.ice.id])
    FIRE= this.lazy(()=>[this._models.flame.id, this._effect.give_burning.id, this._particle.smoke_emitter.id])
    TRAMPOLINE= this.lazy(()=>[this.jumping.id, this._models.trampoline.id])
    WOOD= this.lazy(()=>[...this._living.WOOD_DESTRUCTIBLE(), this._models.wood.id])
    FOLLOWING= this.lazy(()=>[...this._physic.MOVING_FRICTION(), this.following.id])


    // Moving
    elevator2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,1,0)], 0.1, 0.01, 0.02))
    elevator4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,2,0)], 0.1, 0.01, 0.02))
    elevator8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02))
    elevatorG=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,8,0)], 0.1, 0.01, 0.02))
    delevator2=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,-1,0)], 0.1, 0.01, 0.02))
    delevator4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,-2,0)], 0.1, 0.01, 0.02))
    delevator8=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,-4,0)], 0.1, 0.01, 0.02))
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
    door4=this.behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,3,0)], 0.1, 0.002, 0.005))

}