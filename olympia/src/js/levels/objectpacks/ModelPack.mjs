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
import { ObjectPack } from "./ObjectPack.mjs";
import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";


/**
 * Un pack de behaviours de modèles de base
 */
export class ModelPack extends ObjectPack{

    /**
     * @param {World} world
     */
    constructor(world){
        super(world)
        /** @type {import("../../ressources/Models.mjs").ModelLibrary} */
        this.models=world["models"]
    }

    // World
    cube= this.behav(()=>new MeshBehaviour(this.models.CUBE))
    pillar= this.behav(()=>new MeshBehaviour(this.models.PILLAR))
    block= this.behav(()=>new MeshBehaviour(this.models.BLOCK))
    bridge= this.behav(()=>new MeshBehaviour(this.models.BRIDGE))
    stone= this.behav(()=>new MeshBehaviour(this.models.STONE))
    hole= this.behav(()=>new MeshBehaviour(this.models.HOLE))
    lava= this.behav(()=>new MeshBehaviour(this.models.LAVA))
    mud= this.behav(()=>new MeshBehaviour(this.models.MUD))
    ice= this.behav(()=>new MeshBehaviour(this.models.ICE))

    question_mark= this.behav(()=>new MeshBehaviour(this.models.QUESTION_MARK))
    exclamation_mark= this.behav(()=>new MeshBehaviour(this.models.EXCLAMATION_MARK))

    // Monsters
    panda= this.behav(()=>new MeshBehaviour(this.models.PANDA))
    bird= this.behav(()=>new MeshBehaviour(this.models.BIRD))
    kangaroo= this.behav(()=>new MeshBehaviour(this.models.KANGAROO))
    bad_kangaroo= this.behav(()=>new MeshBehaviour(this.models.BAD_KANGAROO))
    demon= this.behav(()=>new MeshBehaviour(this.models.DEMON))
    bonnet= this.behav(()=>new MeshBehaviour(this.models.BONNET))
    sphinx= this.behav(()=>new MeshBehaviour(this.models.SPHINX))

    // Objects
    artifact= this.behav(()=>new MeshBehaviour(this.models.ARTIFACT))
    bomb= this.behav(()=>new MeshBehaviour(this.models.BOMB))

    // Particles
    cloud= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_CLOUD))
    fire= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_FIRE))
    rock= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_ROCK))
    water= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_WATER))
    wind= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_WIND))
    bats= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_BATS))
    vortex= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_VORTEX))
    smoke= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_SMOKE))
    slash= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_SLASH))
    flame= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_FLAME))
    blood= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_BLOOD))

    explosion= this.behav(()=>new MeshBehaviour(this.models.EXPLOSION))
    sphere_explosion= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION))
    sphere_explosion2= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION2))
    sphere_explosion3= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION3))

}