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
        let effect= this.effect= new EffectPack(world, particle)
        let fight= this.fight= new FightPack(world, living, effect)
        let player= this.player= new PlayerPack(world, fight)
        let soil= this.soil= new SoilPack(world, effect,living)
        let ia= this.ia= new IAPack(world, living)
        let monster= this.monster= new MonsterPack(world, fight, ia, player)

        /** @type {Object.<string,import("../../objects/world/WorldUtils.mjs").ObjectDefinition>} */
        this.objects={
            "##": { tags:[...physic.STATIC(), model.block.id] },
            "#I": { tags:[...physic.STATIC(), model.pillar.id] },
            "#b": { tags:[...physic.STATIC(), model.building.id] },
            "#n": { tags:[...physic.STATIC(), model.bridge.id] },
            "#^": { tags:[...physic.STATIC(), model.stone.id] },

            "#~": { tags:[...physic.STATIC(), ...soil.MUD()] },
            "#x": { tags:[...physic.STATIC(), ...soil.LAVA()] },
            "#i": { tags:[...physic.STATIC(), ...soil.ICE()] },
            "^4": { tags:[...physic.MOVING(), model.block.id, soil.elevator4.id] },
            "^8": { tags:[...physic.MOVING(), model.block.id, soil.elevator8.id] },

            "%#": { tags:[...physic.PHYSIC_FALLING(), model.block.id] },

            "0j": { tags:[...player.JUMP_EQUIPPER(), model.artifact.id] },
            "0a": { tags:[...player.ATTACK_EQUIPPER(), model.artifact.id] },
            "0s": { tags:[...player.SHOOT_EQUIPPER(), model.artifact.id] },
            "0d": { tags:[...player.DASH_EQUIPPER(), model.artifact.id] },

            "+p": { tags:[...physic.STATIC(), model.hole.id, monster.panda_summoner.id] },
            "+k": { tags:[...physic.STATIC(), model.hole.id, monster.kangaroo_summoner.id] },
            "+b": { tags:[...physic.STATIC(), model.hole.id, monster.bird_summoner.id] },
            "+s": { tags:[...physic.STATIC(), model.hole.id, monster.sphinx_summoner.id] },

            "PP": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
                models:()=>[new LivingModel(3), fight.good],
                size: it=>it.scale(0.8)
            },
        }
    }
}