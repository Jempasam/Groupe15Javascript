import { Behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { MovementBehaviour } from "../../objects/behaviour/MovementBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { TransformBehaviour } from "../../objects/behaviour/TransformBehaviour.mjs";
import { HitboxBehaviour } from "../../objects/behaviour/HitboxBehaviour.mjs";
import { GridCollisionBehaviour } from "../../objects/behaviour/collision/GridCollisionBehaviour.mjs";
import { ConstantForceBehaviour } from "../../objects/behaviour/ConstantForceBehaviour.mjs";
import { PushCollisionBehaviour } from "../../objects/behaviour/PushCollisionBehaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { SimpleCollisionBehaviour } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";


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
    solid=this.empty()
    pushable= this.behav(tags(()=>this.solid.id), new PushCollisionBehaviour())
    pushable_all= this.behav(new PushCollisionBehaviour())

    // Forces
    gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,-0.015,0)))
    low_gravity= this.behav(new ConstantForceBehaviour(new Vector3(0,-0.005,0)))

    // Compilations
    PHYSIC= this.lazy(()=>[this.transform.id, this.move.id, this.collision.id, this.pushable.id, this.solid.id])
    PHYSIC_SLIDE= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id, this.pushable.id, this.solid.id])
    PHYSIC_FALLING= this.lazy(()=>[...this.PHYSIC(), this.gravity.id])
    PHYSIC_FALLING_SLIDE= this.lazy(()=>[...this.PHYSIC_SLIDE(), this.gravity.id])

    MOVING= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id, this.solid.id])
    MOVING_GHOST= this.lazy(()=>[this.transform.id, this.no_friction_move.id, this.collision.id])
    MOVING_NOCOLLISION= this.lazy(()=>[this.transform.id, this.no_friction_move.id])

    STATIC= this.lazy(()=>[this.transform.id, this.collision.id, this.solid.id])
    STATIC_GHOST= this.lazy(()=>[this.transform.id, this.collision.id])
    STATIC_NOCOLLISION= this.lazy(()=>[this.transform.id])
}