import { SOUND } from "../../objects/behaviour/MusicBehaviour.mjs";
import { NAME } from "../../objects/behaviour/life/LifeBarBehaviour.mjs";
import { LivingModel } from "../../objects/model/LivingModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { HubLevel } from "../HubLevel.mjs";
import { Level, NEXT_LEVEL } from "../Level.mjs";
import { CityRace } from "../city/CityRace.mjs";
import { FlyingParis } from "../city/FlyingParis.mjs";
import { LongSewer } from "../city/LongSewer.mjs";
import { BirdBridge } from "../lava/BirdBridge.mjs";
import { BirdOfFire } from "../lava/BirdOfFire.mjs";
import { BurningCity } from "../lava/BurningCity.mjs";
import { LavaHole } from "../lava/LavaHole.mjs";
import { PandaPlane } from "../lava/PandaPlane.mjs";
import { VolcanoField } from "../lava/VolcanoField.mjs";
import { SandMonster } from "../sand/SandMonster.mjs";
import { DashFalls } from "../water/DashFalls.mjs";
import { BambooMaze } from "../water/BambooMaze.mjs";
import { DipolePack } from "./DipolePack.mjs";
import { EffectPack } from "./EffectPack.mjs";
import { ElectronicPack } from "./ElectronicPack.mjs";
import { ElementPack } from "./ElementPack.mjs";
import { FightPack } from "./FightPack.mjs";
import { IAPack } from "./IAPack.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { MonsterPack } from "./MonsterPack.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { PhysicPack } from "./PhysicPack.mjs";
import { PlayerBonusPack } from "./PlayerBonusPack.mjs";
import { PlayerPack } from "./PlayerPack.mjs";
import { SoilPack } from "./SoilPack.mjs";
import { SoundPack } from "./SoundPack.mjs";
import { SwimmingPool } from "../water/SwimmingPool.mjs";
import { Vector3 } from "../../../../../babylonjs/core/Maths/math.vector.js";



/**
 * Un pack de behaviours de base avec la liste d'objet de base
 */
export class BasicPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {object} options
     * @param {()=>Level=} options.next_levels
     * @param {boolean=} options.editor_mode
     */
    constructor(world,options={}){
        super(world)

        let physic= this.physic= new PhysicPack(world)
        let model= this.model= new ModelPack(world)
        let particle= this.particle= new ParticlePack(world, physic, model)
        let living= this.living= new LivingPack(world, particle)
        let effect= this.effect= new EffectPack(world, living)
        let fight= this.fight= new FightPack(world, living, effect)
        let electronic= this.electronic= new ElectronicPack(world, model, physic)
        let soil= this.soil= new SoilPack(world, effect)
        let element= this.element= new ElementPack(world, soil, fight)
        let player= this.player= new PlayerPack(world, element)
        let ia= this.ia= new IAPack(world, living)
        let monster= this.monster= new MonsterPack(world, fight, ia, player,soil)
        let sound= this.sound= new SoundPack(world,player)
        let bonus= this.bonus= new PlayerBonusPack(world,player)
        let dipole= this.dipole= new DipolePack(world,fight,soil,electronic)

        this.NEXT_LEVEL= options.next_levels==null ? [] : [player.createLevelChange(options.next_levels).id]
        if(options.next_levels!=null)world.model.set(NEXT_LEVEL,options.next_levels)
        /** @type {Object.<string,import("../../objects/world/WorldUtils.mjs").ObjectDefinition>} */
        this.objects={
            "##": { tags:[...physic.STATIC(), model.block.id] },
            "#I": { tags:[...physic.STATIC(), model.pillar.id] },
            "#b": { tags:[...physic.STATIC(), model.building.id] },
            "#B": { tags:[...physic.STATIC(), model.building2.id] },
            "#n": { tags:[...physic.STATIC(), model.bridge.id] },
            "#^": { tags:[...physic.STATIC(), model.stone.id] },
            "#m": { tags:[...physic.STATIC(), model.magma.id] },
            "#r": { tags:[...physic.STATIC(), model.rock_floor.id] },
            "#%": { tags:[...physic.STATIC(), model.stone_wall.id] },
            "#8": { tags:[...physic.STATIC(), ...living.WOOD_DESTRUCTIBLE(), model.barril.id], models:()=>[fight.bad] },
            "#w": { tags:[...physic.STATIC(), ...living.WOOD_DESTRUCTIBLE(), model.wood.id], models:()=>[fight.bad,new LivingModel(3)] },
            "#M": { tags:[...physic.STATIC(), ...soil.TRAMPOLINE()] },
            "#c": { tags:[...physic.STATIC(), model.cactus.id, soil.damaging.id], size: it=>it.multiplyByFloats(.4,1,.4) },
            "#C": { tags:[...physic.STATIC(), model.cactus2.id, soil.damaging.id], size: it=>it.multiplyByFloats(.4,1,.4) },
            "#p": { tags:[...physic.STATIC(), model.pannier_basket.id], size: it=>it.multiplyByFloats(.1,1,.1), rotation:()=>[0,-Math.PI/2,0]},
            "#q": { tags:[...physic.STATIC(), model.pannier_basket.id], size: it=>it.multiplyByFloats(.1,1,.1), rotation:()=>[0,Math.PI/2,0]},
            "#v": { tags:[...physic.STATIC(), model.volcano.id]},
            "#-": { tags:[...physic.STATIC(), model.barrier.id], size: it=>it.multiplyByFloats(.2,1,1), rotation:()=>[0,Math.PI/2,0]},
            "#|": { tags:[...physic.STATIC(), model.barrier.id], size: it=>it.multiplyByFloats(.2,1,1), rotation:()=>[0,0,0]},
            "N-": { tags:[...physic.STATIC(), model.barrier2.id], rotation:()=>[0,Math.PI/2,0]},
            "N|": { tags:[...physic.STATIC(), model.barrier2.id], rotation:()=>[0,0,0]},
            "#H": { tags:[...physic.STATIC(), model.pipe.id]},
            "#O": { tags:[...physic.STATIC(), model.sewer.id], size:it=>it.multiplyByFloats(1,.5,1)},
            "#t": { tags:[...physic.STATIC(), model.track.id] },
            "#g": { tags:[...physic.STATIC(), model.gradin.id] },
            "#=": { tags:[...physic.STATIC(), model.pancarte.id] },
            "#u": { tags:[...physic.STATIC(), model.bamboo.id ], size:it=>it.multiplyByFloats(.7,1,.7)},

            "Ox": { tags:[...soil.FOLLOWING(), ...soil.LAVA()] },

            ":f": { tags:[...soil.FIRE()] },
            ":b": { tags:[...fight.BOMB()], models:()=>[fight.bad]},
            ":d": { tags:[...monster.DEMON()], models:()=>[fight.bad]},
            ":m": { tags:[...monster.FIREBIRD()], models:()=>[fight.bad, new LivingModel(20), [NAME,"Firebird"]]},

            "#~": { tags:[...physic.STATIC(), ...soil.MUD()] },
            "#W": { tags:[...physic.STATIC_GHOST(), ...soil.WATER()] },
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

            "^x": {tags:[...physic.MOVING(), ...soil.LAVA(), soil.forward2.id]},
            "vx": {tags:[...physic.MOVING(), ...soil.LAVA(), soil.backward2.id]},
            "<x": {tags:[...physic.MOVING(), ...soil.LAVA(), soil.left2.id]},
            ">x": {tags:[...physic.MOVING(), ...soil.LAVA(), soil.right2.id]},
            "ox": {tags:[...physic.MOVING(), ...soil.LAVA(), soil.elevator4.id]},

            "d#": { tags:[...physic.MOVING(), model.block.id, soil.slow_door4.id] },
            "D#": { tags:[...physic.MOVING(), model.block.id, soil.door4.id] },

            "%#": { tags:[...physic.PHYSIC_FALLING(), model.block.id] },
            "%8": {
                tags:[...physic.PHYSIC_FALLING(), ...living.WOOD_DESTRUCTIBLE(), model.barril.id],
                models:()=>[fight.bad],
                size: it=>it.multiplyInPlace(new Vector3(.8,1,.8))
            },
            "%o": {
                tags:[...physic.PHYSIC_FALLING(), ...living.MACHINE_DESTRUCTIBLE(), model.car.id],
                models:()=>[fight.bad, new LivingModel(3)],
                size: it=>it.multiplyInPlace(new Vector3(1,1,1))
            },
            "%b": { tags:[...physic.PHYSIC_FALLING(), model.boombox.id], size:it=>it.scale(0.5) },

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
            "0^": { tags:[...player.SPIKE_EQUIPPER(), model.artifact.id] },

            "§r": { tags:[...dipole.REPEATER()], size: it=>it.scale(.5), position:(p,s)=>p.subtractFromFloats(0, s.y/4, 0) },
            "§d": { tags:[...dipole.OPENABLE_DOOR(), model.block.id] },
            "§b": { tags:[...dipole.BUTTON()], size: it=>it.multiplyByFloats(1,1,1) },


            "*j": { tags:[...bonus.JUMP_GIVER(), model.sphere.id], size:it=>it.scale(.5) },

            "$h": { tags:[...physic.STATIC_GHOST(), model.heart.id, living.health_giver.id] },
            "$P": { tags:[...physic.STATIC_GHOST(), model.checkpoint.id, living.checkpoint.id], size: it=>it.multiplyByFloats(.05,1,.05) },
            "&T": { tags:[...physic.STATIC_GHOST(), model.darkness.id, physic.teleporter.id], size:it=>it.scale(1.5)},

            "+p": { tags:[...physic.STATIC(), model.hole.id, monster.panda_summoner.id], models:()=>[fight.bad] },
            "+P": { tags:[...physic.STATIC(), model.hole.id, monster.big_panda_summoner.id], models:()=>[fight.bad] },
            "+k": { tags:[...physic.STATIC(), model.hole.id, monster.kangaroo_summoner.id], models:()=>[fight.bad] },
            "+b": { tags:[...physic.STATIC(), model.hole.id, monster.bird_summoner.id], models:()=>[fight.bad] },
            "+s": { tags:[...physic.STATIC(), model.hole.id, monster.sphinx_summoner.id], models:()=>[fight.bad] },
            "+o": { tags:[...physic.STATIC(), model.pannier.id, model.smoke.id, monster.basketball_summoner.id], models:()=>[fight.bad] },
            "+O": { tags:[...physic.STATIC(), model.pannier.id, model.flame.id, monster.super_basketball_summoner.id], models:()=>[fight.bad] },
            "+d": { tags:[...physic.STATIC(), model.hole.id, monster.demon_summoner.id], models:()=>[fight.bad]},
            "+B": { tags:[...physic.STATIC(), model.hole.id, monster.firebird_summoner.id], models:()=>[fight.bad]},
            "+S": { tags:[...physic.STATIC(), model.hole.id, monster.sphinx_summoner.id], models:()=>[fight.bad]},
            "+g": { tags:[...physic.STATIC(), model.pipe.id, fight.droplet_summoner.id], rotation: ()=>[Math.PI,0,0]},

            "PC": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
                models:()=>[new LivingModel(3), fight.good, [NAME,"Frigeosaure"]],
                size: it=>it.multiplyByFloats(.65,1.1,.65)
            },

            "PP": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id, ...(options.editor_mode ? [] : [living.reload_on_death.id])],
                models:()=>[new LivingModel(3), fight.good, [NAME,"Frigeosaure"]],
                size: it=>it.multiplyByFloats(.65,1.1,.65)
            },

            "Pp": {
                tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
                models:()=>[new LivingModel(3), fight.good, [NAME,"Petit Frigeosaure"]],
                size: it=>it.multiplyByFloats(.5,.6,.5)
            },

            "()":{ tags: [...physic.STATIC(), model.portal.id, ...this.NEXT_LEVEL], size:it=>it.multiplyByFloats(1,1,.2) },
            ")(":{ tags: [...physic.STATIC(), model.portal.id, ...this.NEXT_LEVEL], size:it=>it.multiplyByFloats(1,1,.2), rotation: ()=>new Vector3(0,Math.PI/2,0) },
            
            "@I": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new BurningCity()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@_": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new LavaHole()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@b": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new BirdOfFire()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@v": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new VolcanoField()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@P": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new PandaPlane()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@n": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new BirdBridge()).id], size:it=>it.multiplyByFloats(1,1,.2)},

            "@p": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new FlyingParis()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@s": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new LongSewer()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@r": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new CityRace()).id], size:it=>it.multiplyByFloats(1,1,.2)},

            "@S": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new SandMonster()).id], size:it=>it.multiplyByFloats(1,1,.2)},

            "@F": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new DashFalls()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@M": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new BambooMaze()).id], size:it=>it.multiplyByFloats(1,1,.2)},
            "@N": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new SwimmingPool()).id], size:it=>it.multiplyByFloats(1,1,.2)},

            "@h": { tags:()=>[...physic.STATIC(), model.portal.id, player.createLevelChange(()=>new HubLevel()).id], size:it=>it.multiplyByFloats(1,1,.2)},

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
            "?j": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_jump.id] },
            "?d": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_door.id] },
            "?D": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_dash_jump.id] },
            "?e": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_escalade.id] },
            "?u": { tags:[...physic.STATIC(), model.question_mark.id, player.hint_under.id] },

            ":c": { tags:[...physic.STATIC_NOCOLLISION(), model.big_cloud.id] },

            "'a": { tags:[...physic.STATIC_NOCOLLISION(), model.sky.id] },
            "'f": { tags:[...physic.STATIC_NOCOLLISION(), model.hell.id] },
            "'s": { tags:[...physic.STATIC_NOCOLLISION(), model.sand.id] },

            "<>": { tags:[...physic.MOVING_GHOST_FRICTION(), physic.pushable.id, player.camera_movement.id, player.camera.id], size:it=>it.scale(1.4)},

        }
    }
}