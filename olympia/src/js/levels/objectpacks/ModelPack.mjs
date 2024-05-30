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
import { PathShadowBehaviour } from "../../objects/behaviour/path/PathShadowBehaviour.mjs";


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
        this._registerNames()
    }

    modifyNames(str){return "["+str.toUpperCase()+"]"}

    // World
    cube= this.behav(()=>new MeshBehaviour(this.models.CUBE))
    pillar= this.behav(()=>new MeshBehaviour(this.models.PILLAR))
    block= this.behav(()=>new MeshBehaviour(this.models.BLOCK))
    bridge= this.behav(()=>new MeshBehaviour(this.models.BRIDGE))
    stone= this.behav(()=>new MeshBehaviour(this.models.STONE))
    hole= this.behav(()=>new MeshBehaviour(this.models.HOLE))
    building= this.behav(()=>new MeshBehaviour(this.models.BUILDING))
    building2= this.behav(()=>new MeshBehaviour(this.models.BUILDING2))
    stone_wall= this.behav(()=>new MeshBehaviour(this.models.STONE_WALL))
    wood= this.behav(()=>new MeshBehaviour(this.models.WOOD))
    barril= this.behav(()=>new MeshBehaviour(this.models.BARRIL))
    trampoline= this.behav(()=>new MeshBehaviour(this.models.TRAMPOLINE))
    pannier= this.behav(()=>new MeshBehaviour(this.models.PANNIER))
    cactus= this.behav(()=>new MeshBehaviour(this.models.CACTUS))
    cactus2= this.behav(()=>new MeshBehaviour(this.models.CACTUS2))
    cactus3= this.behav(()=>new MeshBehaviour(this.models.CACTUS3))
    portal= this.behav(()=>new MeshBehaviour(this.models.PORTAL))
    pannier_basket= this.behav(()=>new MeshBehaviour(this.models.PANNIER_BASKET))
    volcano= this.behav(()=>new MeshBehaviour(this.models.VOLCANO))
    barrier= this.behav(()=>new MeshBehaviour(this.models.BARRIER))
    pipe= this.behav(()=>new MeshBehaviour(this.models.PIPE))
    sewer= this.behav(()=>new MeshBehaviour(this.models.SEWER))
    car= this.behav(()=>new MeshBehaviour(this.models.CAR))

    big_cloud= this.behav(()=>new MeshBehaviour(this.models.CLOUD))

    // Environments
    sky= this.behav(()=>new MeshBehaviour(this.models.ENV_SKY))
    sand= this.behav(()=>new MeshBehaviour(this.models.ENV_SAND))
    hell= this.behav(()=>new MeshBehaviour(this.models.ENV_HELL))
    
    magma= this.behav(()=>new MeshBehaviour(this.models.MAGMA))
    rock_floor= this.behav(()=>new MeshBehaviour(this.models.ROCK))
    lava= this.behav(()=>new MeshBehaviour(this.models.LAVA))
    mud= this.behav(()=>new MeshBehaviour(this.models.MUD))
    ice= this.behav(()=>new MeshBehaviour(this.models.ICE))

    question_mark= this.behav(()=>new MeshBehaviour(this.models.QUESTION_MARK))
    exclamation_mark= this.behav(()=>new MeshBehaviour(this.models.EXCLAMATION_MARK))
    heart= this.behav(()=>new MeshBehaviour(this.models.HEART))
    potion= this.behav(()=>new MeshBehaviour(this.models.POTION))
    sphere= this.behav(()=>new MeshBehaviour(this.models.SPHERE))
    checkpoint= this.behav(()=>new MeshBehaviour(this.models.CHECKPOINT))

    // Monsters
    panda= this.behav(()=>new MeshBehaviour(this.models.PANDA))
    bird= this.behav(()=>new MeshBehaviour(this.models.BIRD))
    kangaroo= this.behav(()=>new MeshBehaviour(this.models.KANGAROO))
    bad_kangaroo= this.behav(()=>new MeshBehaviour(this.models.BAD_KANGAROO))
    demon= this.behav(()=>new MeshBehaviour(this.models.DEMON))
    bonnet= this.behav(()=>new MeshBehaviour(this.models.BONNET))
    sphinx= this.behav(()=>new MeshBehaviour(this.models.SPHINX))
    gorilla= this.behav(()=>new MeshBehaviour(this.models.GORILLA))
    aigle_feu_moche= this.behav(()=>new MeshBehaviour(this.models.AIGLE_FEU_MOCHE))

    // Objects
    artifact= this.behav(()=>new MeshBehaviour(this.models.ARTIFACT))
    bomb= this.behav(()=>new MeshBehaviour(this.models.BOMB))
    basketball= this.behav(()=>new MeshBehaviour(this.models.BASKETBALL))

    // Details
    balloon= this.behav(()=>new MeshBehaviour(this.models.BALLOON))
    shadow= this.behav(()=>new PathShadowBehaviour(this.models.SHADOW))

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
    wood_piece= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_WOOD))
    pingpong= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_PINGPONG))
    darkness= this.behav(()=>new MeshBehaviour(this.models.PARTICLE_DARKNESS))

    explosion= this.behav(()=>new MeshBehaviour(this.models.EXPLOSION))
    sphere_explosion= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION))
    sphere_explosion2= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION2))
    sphere_explosion3= this.behav(()=>new MeshBehaviour(this.models.SPHERE_EXPLOSION3))

}