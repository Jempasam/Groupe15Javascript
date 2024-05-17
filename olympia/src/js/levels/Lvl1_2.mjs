import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";
import { SummonerBehaviour } from "../objects/behaviour/SummonerBehaviour.mjs";
import { behaviourCollectable } from "../objects/behaviour/generic/CollectableBehaviour.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { EffectPack } from "./objectpacks/EffectPack.mjs";
import { FightPack } from "./objectpacks/FightPack.mjs";
import { IAPack } from "./objectpacks/IAPack.mjs";
import { LivingPack } from "./objectpacks/LivingPack.mjs";
import { ModelPack } from "./objectpacks/ModelPack.mjs";
import { MonsterPack } from "./objectpacks/MonsterPack.mjs";
import { ParticlePack } from "./objectpacks/ParticlePack.mjs";
import { PhysicPack } from "./objectpacks/PhysicPack.mjs";
import { PlayerPack } from "./objectpacks/PlayerPack.mjs";
import { SoilPack } from "./objectpacks/SoilPack.mjs";


export class Lvl1_2 extends Level{

   static playerPos=new Vector3(1.5, 3, 3)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      // Setup
      /** @type {import("../ressources/Models.mjs").ModelLibrary} */
      const models=world["models"]

      let id_counter=3512
      /**
       * @param {...(Behaviour|[Behaviour,number])} behaviours
       */
      function behav(...behaviours){
         const ret=id_counter++
         world.addBehaviours(ret, ...behaviours)
         return ret
      }

      const physic=new PhysicPack(world)
      const model=new ModelPack(world)
      const particle=new ParticlePack(world,physic,model)
      const living=new LivingPack(world,particle)
      const effect=new EffectPack(world,particle)
      const fight=new FightPack(world,living,effect)
      const player=new PlayerPack(world,fight)
      const soil=new SoilPack(world,effect)
      const ia=new IAPack(world,living)
      const monster=new MonsterPack(world,fight,ia,player)

      // Platform
      const MOVING=behav(new PathBehaviour([new Vector3(3,0,0),new Vector3(0,0,0)], 0.1, 0.02, 0.04))
      const MOVING2=behav(new PathBehaviour([new Vector3(-3,0,0),new Vector3(0,0,0)], 0.1, 0.02, 0.04))

      // Hint
      const unlock_hint=player.createHint(message,"Vous pouvez débloquer des améliorations grâce aux artefactes dorés!")
      const push_hint=player.createHint(message,"Ces caisses peuvent être déplacées, peut être qu'elles peuvent vous être utile.")
      const damage_hint=player.createHint(message,"Attention aux dégats! Si vous fumez, il ne faut plus vous faire toucher. ")

      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         position: new Vector3(-4,0,-8),
         world,
         objects: {
            a: { tags:[...physic.STATIC(), model.pillar.id] },
            b: { tags:[...physic.STATIC(), model.block.id] },
            c: { tags:[...physic.STATIC(), model.bridge.id] },
            d: { tags:[...physic.STATIC(), model.stone.id] },
            e: { tags:[...physic.STATIC(), physic.move.id, soil.elevator4.id, model.block.id] },
            f: { tags:[...physic.STATIC(), physic.move.id, MOVING, model.block.id] },
            F: { tags:[...physic.STATIC(), physic.move.id, MOVING2, model.block.id] },
            h: { tags:[...physic.PHYSIC_FALLING(), model.block.id] },

            g: { tags:[...player.JUMP_EQUIPPER(), model.artifact.id] },
            j: { tags:[...player.ATTACK_EQUIPPER(), model.artifact.id] },
            k: { tags:[...player.SHOOT_EQUIPPER(), model.artifact.id] },
            l: { tags:[...player.DASH_EQUIPPER(), model.artifact.id] },

            i: { tags:[...monster.SPHINX()], models:()=>[new LivingModel(10),fight.bad] },
            m: { tags:[...physic.STATIC(), model.hole.id, ...monster.panda_summoner.id] },
            r: { tags:[...physic.STATIC(), model.hole.id, ...monster.bird_summoner.id] },

            n: { tags:[...physic.PHYSIC(), model.block.id] },
            o: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, unlock_hint.id] },
            p: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, damage_hint.id] },
            q: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, push_hint.id] },
            z: { tags:soil.ICE() },
            y: { tags:soil.LAVA() },
            x: { tags:soil.MUD() },

            P: {
               tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
               models:()=>[new LivingModel(3), fight.good],
               size: it=>it.scale(0.8)
            },
         },
         maps: [
            `
            1  ]   
            2  ]   
            3  ]      P71
            `
            ,
            `
            1  ]b0H-..-..-..
            2  ]bB6-..-..-..
            3  ]|          |
            4  ]|__________|
            5  ]b0H-..-..-..
            6  ]      j61
            7  ]
            8  ]
            9  ]
            10 ]
            11 ]
            12 ]
            13 ]
            14 ]
            15 ]
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]
            21 ]
            22 ]
            23 ]
            24 ]
            25 ]`
            ,
            `
            1  ]            d08d08d08d08
            2  ]   c05-..-..-..-..-..d08
            3  ]   |                |d08
            4  ]   |                |d08
            5  ]   |                |d08
            6  ]   |                |d08
            7  ]   |________________|d08
            8  ]   c04-..-..-..-..-..
            9  ]   c03-..-..-..-..-..
            10 ]   c02-..-..-..-..-..-..-..-..-..                  c02-..-..
            11 ]   |                            |                  |       |
            12 ]   |                            |f11            F11|_______|
            13 ]   |                            |
            14 ]   |____________________________|
            15 ]
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]
            21 ]
            22 ]
            23 ]
            24 ]
            25 ]`
         ]
      })

      this.player=world.objects.get(player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")

      this.player.observers(ON_DEATH).add("Lvl1_2",(obj,_)=>{
         this.player?.apply(MOVEMENT, (movement)=>{
            movement.inertia.set(0,0,0)
         })
      })

      this.player.observers(ON_LIVE_CHANGE).add("Lvl1_2",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })

      this.player.observers(ON_EQUIPPED).add("SamLevel",(obj,{equipper})=>{
         if(equipper.given.includes(player.jump.id))message.send("Saut avec Espace",6000,"unlock")
         if(equipper.given.includes(player.dash.id))message.send("Dash avec Shift",6000,"unlock")
         if(equipper.given.includes(player.attack.id))message.send("Attaquez avec E",6000,"unlock")
         if(equipper.given.includes(player.shoot.id))message.send("Tirez avec E",6000,"unlock")
      })

      options.camera.lockedTarget=this.player.get(HITBOX)?.hitbox
   }

   camerapos=new Vector3(0,6,8)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){
      const pos=this?.player?.get(TRANSFORM)?.position
      if(pos){
         options.camera.position.copyFrom(pos)
         options.camera.position.addInPlace(this.camerapos)
      }
      if(isKeyPressed("Digit1"))this.camerapos=new Vector3(0,6,8)
      if(isKeyPressed("Digit2"))this.camerapos=new Vector3(0,8,10)
      if(isKeyPressed("Digit3"))this.camerapos=new Vector3(0,30,30)
      if(isKeyPressed("Digit9"))context.switchTo(new SamLevel())
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
   }

}