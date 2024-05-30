import { Behaviour, behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { MovementBehaviour } from "../../objects/behaviour/MovementBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { TransformBehaviour } from "../../objects/behaviour/TransformBehaviour.mjs";
import { HitboxBehaviour } from "../../objects/behaviour/HitboxBehaviour.mjs";
import { GridCollisionBehaviour } from "../../objects/behaviour/collision/GridCollisionBehaviour.mjs";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PushCollisionBehaviour } from "../../objects/behaviour/PushCollisionBehaviour.mjs";
import { SimpleCollisionBehaviour } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PathBehaviour } from "../../objects/behaviour/PathBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { TeleportationBehaviour } from "../../objects/behaviour/teleportation/TeleportationBehaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/Maths/math.vector.js";


/**
 * Un pack de behaviours de base pour la gestion des collisions et de la physique
 */
export class PhysicPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {Object} options
     * @param {boolean=} options.simpleCollision
     */
    constructor(world,options={}){
        super(world)
        this.options=options
        this._registerNames()
    }

    // Movements
    move = this.behav(new MovementBehaviour(0.98))
    no_friction_move= this.behav(new MovementBehaviour(1))
    high_friction_move= this.behav(new MovementBehaviour(0.9))

    // Transform
    transform= this.behav(new TransformBehaviour())

    // Collisions
    collision= this.behav(new HitboxBehaviour(), ()=>(this.options.simpleCollision ? new SimpleCollisionBehaviour() : new GridCollisionBehaviour(60,1,60)))
    solid=this.behav(new PathBehaviour(new Vector3(1,1,1)))
    pushable= this.behav(tags(()=>this.solid.id), new PushCollisionBehaviour())
    pushable_all= this.behav(new PushCollisionBehaviour())

    // Forces
    gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,-0.015,0)))
    low_gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,-0.005,0)))
    anti_gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,0.015,0)))
    high_anti_gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,0.03,0)))

    // Teleporter
    teleporter= this.behav(tags(()=>this.pushable.id), new TeleportationBehaviour({use_count:Infinity,reload_time:60}))

    // Out of world
    out_of_world_suppression= this.behav(behaviourEach(o=>o.apply(TRANSFORM, tf=>{if(tf.position.y<-100)o.kill()})))

    // Compilations
    _FALLING= this.lazy(()=>[this.gravity.id, this.out_of_world_suppression.id])

    PHYSIC= this.lazy(()=>[this.transform.id, this.move.id, this.collision.id, this.pushable.id, this.solid.id])
    PHYSIC_SLIDE= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id, this.pushable.id, this.solid.id])
    PHYSIC_FALLING= this.lazy(()=>[...this.PHYSIC(), ...this._FALLING()])
    PHYSIC_FALLING_SLIDE= this.lazy(()=>[...this.PHYSIC_SLIDE(), ...this._FALLING()])

    MOVING= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id, this.solid.id])
    MOVING_GHOST= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id])
    MOVING_GHOST_FRICTION= this.lazy(()=>[this.transform.id, this.high_friction_move.id, this.collision.id])
    MOVING_NOCOLLISION= this.lazy(()=>[this.transform.id, this.no_friction_move.id])

    STATIC= this.lazy(()=>[this.transform.id, this.collision.id, this.solid.id])
    STATIC_GHOST= this.lazy(()=>[this.transform.id, this.collision.id])
    STATIC_NOCOLLISION= this.lazy(()=>[this.transform.id])
}