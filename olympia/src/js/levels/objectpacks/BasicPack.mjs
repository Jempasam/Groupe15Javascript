import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { LivingBehaviour } from "../../objects/behaviour/life/LivingBehaviour.mjs";
import { ParticleLivingBehaviour } from "../../objects/behaviour/life/ParticleLivingBehaviour.mjs";
import { RespawnBehaviour } from "../../objects/behaviour/life/RespawnBehaviour.mjs";
import { LIVING, LivingModel } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { PhysicPack } from "./PhysicPack.mjs";
import { FightPack } from "./FightPack.mjs";
import { PlayerPack } from "./PlayerPack.mjs";
import { SoilPack } from "./SoilPack.mjs";
import { IAPack } from "./IAPack.mjs";
import { MonsterPack } from "./MonsterPack.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { EffectPack } from "./EffectPack.mjs";
import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { Team } from "../../objects/model/TeamModel.mjs";
import { MessageManager } from "../../messages/MessageManager.mjs";
import { ElementPack } from "./ElementPack.mjs";



/**
 * Un pack de behaviours de base avec la liste d'objet de base
 */
export class BasicPack extends ObjectPack{

    /**
     * @param {World} world
     */
    constructor(world){
        super(world)

        let physic= this.physic= new PhysicPack(world)
        let model= this.model= new ModelPack(world)
        let particle= this.particle= new ParticlePack(world, physic, model)
        let living= this.living= new LivingPack(world, particle)
        let effect= this.effect= new EffectPack(world, living)
        let fight= this.fight= new FightPack(world, living, effect)
        let soil= this.soil= new SoilPack(world, effect,living)
        let element= this.element= new ElementPack(world, soil, fight)
        let player= this.player= new PlayerPack(world, element)
        let ia= this.ia= new IAPack(world, living)
        let monster= this.monster= new MonsterPack(world, fight, ia, player,soil)

        /** @type {Object.<string,import("../../objects/world/WorldUtils.mjs").ObjectDefinition>} */
        this.objects={
            "##": { tags:[...physic.STATIC(), model.block.id] },
            "#I": { tags:[...physic.STATIC(), model.pillar.id] },
            "#b": { tags:[...physic.STATIC(), model.building.id] },
            "#n": { tags:[...physic.STATIC(), model.bridge.id] },
            "#^": { tags:[...physic.STATIC(), model.stone.id] },
            "#m": { tags:[...physic.STATIC(), model.magma.id] },
            "#r": { tags:[...physic.STATIC(), model.rock_floor.id] },
            "#%": { tags:[...physic.STATIC(), model.stone_wall.id] },
            "#8": { tags:[...physic.STATIC(), ...living.DESTRUCTIBLE(), model.barril.id], models:()=>[fight.bad] },
            "#w": { tags:[...physic.STATIC(), ...living.DESTRUCTIBLE(), model.wood.id], models:()=>[fight.bad,new LivingModel(3)] },
            "#M": { tags:[...physic.STATIC(), ...soil.TRAMPOLINE()] },
            "#c": { tags:[...physic.STATIC(), model.cactus.id, soil.damaging.id], size: it=>it.multiplyByFloats(.4,1,.4) },
            "#C": { tags:[...physic.STATIC(), model.cactus2.id, soil.damaging.id], size: it=>it.multiplyByFloats(.4,1,.4) },

            ":f": { tags:[...soil.FIRE()] },
            ":b": { tags:[...fight.BOMB()], models:()=>[fight.bad]},
            ":d": { tags:[...monster.DEMON()], models:()=>[fight.bad]},

            "#~": { tags:[...physic.STATIC(), ...soil.MUD()] },
            "#x": { tags:[...physic.STATIC(), ...soil.LAVA()] },
            "#i": { tags:[...physic.STATIC(), ...soil.ICE()] },
            
            "o2": { tags:[...physic.MOVING(), model.block.id, soil.elevator2.id] },
            "o4": { tags:[...physic.MOVING(), model.block.id, soil.elevator4.id] },
            "o8": { tags:[...physic.MOVING(), model.block.id, soil.elevator8.id] },
            "oG": { tags:[...physic.MOVING(), model.block.id, soil.elevatorG.id] },
            "^2": { tags:[...physic.MOVING(), model.block.id, soil.forward2.id] },
            "^4": { tags:[...physic.MOVING(), model.block.id, soil.forward4.id] },
            "^8": { tags:[...physic.MOVING(), model.block.id, soil.forward8.id] },
            ">2": { tags:[...physic.MOVING(), model.block.id, soil.right2.id] },
            ">4": { tags:[...physic.MOVING(), model.block.id, soil.right4.id] },
            ">8": { tags:[...physic.MOVING(), model.block.id, soil.right8.id] },
            "<2": { tags:[...physic.MOVING(), model.block.id, soil.left2.id] },
            "<4": { tags:[...physic.MOVING(), model.block.id, soil.left4.id] },
            "<8": { tags:[...physic.MOVING(), model.block.id, soil.left8.id] },
            "v2": { tags:[...physic.MOVING(), model.block.id, soil.backward2.id] },
            "v4": { tags:[...physic.MOVING(), model.block.id, soil.backward4.id] },
            "v8": { tags:[...physic.MOVING(), model.block.id, soil.backward8.id] },

            "d#": { tags:[...physic.MOVING(), model.block.id, soil.slow_door4.id] },

            "%#": { tags:[...physic.PHYSIC_FALLING(), model.block.id] },
            "%8": {
                tags:[...physic.PHYSIC_FALLING(), ...living.DESTRUCTIBLE(), model.barril.id],
                models:()=>[fight.bad],
                size: it=>it.multiplyInPlace(new Vector3(.8,1,.8))
            },

            "&b": { tags:[...player.POTION_SLOW_FALLING()], size: it=>it.scale(.6) },
            "&t": { tags:[...player.POTION_TORNADO()], size: it=>it.scale(.6) },
            "&p": { tags:[...player.POTION_PROPULSED()], size: it=>it.scale(.6) },
            "&s": { tags:[...player.POTION_SMALLING()], size: it=>it.scale(.6) },
            "&g": { tags:[...player.POTION_GROWING()], size: it=>it.scale(.6) },

            "0j": { tags:[...player.JUMP_EQUIPPER(), model.artifact.id] },
            "0a": { tags:[...player.ATTACK_EQUIPPER(), model.artifact.id] },
            "0s": { tags:[...player.SHOOT_EQUIPPER(), model.artifact.id] },
            "0d": { tags:[...player.DASH_EQUIPPER(), model.artifact.id] },
            "0b": { tags:[...player.BOMB_EQUIPPER(), model.artifact.id] },
            "0p": { tags:[...player.PINGPONG_EQUIPPER(), model.artifact.id] },

            "$h": { tags:[...physic.STATIC_GHOST(), model.heart.id, living.health_giver.id] },

            "+p": { tags:[...physic.STATIC(), model.hole.id, monster.panda_summoner.id] },
            "+k": { tags:[...physic.STATIC(), model.hole.id, monster.kangaroo_summoner.id] },
            "+b": { tags:[...physic.STATIC(), model.hole.id, monster.bird_summoner.id] },
            "+s": { tags:[...physic.STATIC(), model.hole.id, monster.sphinx_summoner.id] },
            "+o": { tags:[...physic.STATIC(), model.pannier.id, model.smoke.id, monster.basketball_summoner.id] },
            "+O": { tags:[...physic.STATIC(), model.pannier.id, model.flame.id, monster.super_basketball_summoner.id] },
            "+d": { tags:[...physic.STATIC(), model.hole.id, monster.demon_summoner.id]},

            "PP": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id, player.inventory.id],
                models:()=>[new LivingModel(3), fight.good],
                size: it=>it.multiplyByFloats(.7,1.2,.7)
            },

            "Pp": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
                models:()=>[new LivingModel(3), fight.good],
                size: it=>it.multiplyByFloats(.5,.6,.5)
            },

            "()":{ tags: [...physic.STATIC(), model.vortex.id]},

            "?1": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?2": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?3": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?4": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?5": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?6": { tags:[...physic.STATIC(), model.question_mark.id] },
            "?7": { tags:[...physic.STATIC(), model.question_mark.id] },

            "?0": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_upgrade.id] },
            "?%": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_movable.id] },
            "?x": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_damage.id] },

            "<>": { tags:[...physic.MOVING_GHOST_FRICTION(), physic.pushable.id, player.camera_movement.id, player.camera.id], size:it=>it.scale(1.4)},

        }
    }
}