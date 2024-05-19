import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { TRANSFORM } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { LiveEditor } from "./LiveEditor.mjs";
import { Lvl1_2 } from "./Lvl1_2.mjs";
import { Lvl1_3 } from "./Lvl1_3.mjs";
import { Lvl1_4 } from "./Lvl1_4.mjs";
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

export class SamLevel extends Level{

   static playerPos=new Vector3(1.5, 2, 9.5)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context,world,options){

      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      // Setup
      /** @type {import("../ressources/Models.mjs").ModelLibrary} */
      const models=world["models"]

      let id_counter=7532
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
      const player=new PlayerPack(world,fight,message)
      const soil=new SoilPack(world,effect,living)
      const ia=new IAPack(world,living)
      const monster=new MonsterPack(world,fight,ia,player)

      // Platform
      const MOVING=behav(new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04))

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
            B: { tags:[...physic.STATIC(), model.building.id]},
            c: { tags:[...physic.STATIC(), model.bridge.id] },
            d: { tags:[...physic.STATIC(), model.stone.id] },
            e: { tags:[...physic.STATIC(), physic.move.id, soil.elevator4.id, model.block.id] },
            E: { tags:[...physic.STATIC(), physic.move.id, soil.rotate_side4.id, model.block.id] },
            f: { tags:[...physic.STATIC(), physic.move.id, MOVING, model.block.id] },
            h: { tags:[...physic.PHYSIC_FALLING(), model.block.id] },

            g: { tags:[...player.JUMP_EQUIPPER(), model.artifact.id] },
            j: { tags:[...player.ATTACK_EQUIPPER(), model.artifact.id] },
            k: { tags:[...player.SHOOT_EQUIPPER(), model.artifact.id] },
            l: { tags:[...player.DASH_EQUIPPER(), model.artifact.id] },

            i: { tags:[...monster.SPHINX()], models:()=>[new LivingModel(10),fight.bad] },
            m: { tags:[...physic.STATIC(), model.hole.id, monster.panda_summoner.id] },
            r: { tags:[...physic.STATIC(), model.hole.id, monster.kangaroo_summoner.id] },

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
         maps:[
            `
            1  ]d03b06-..-..-..-..   d09                     b08-..-..-..-..-..-..B0D-..-..
            2  ]   |             |b51a06b51a06b51a06b51a07b71|                   ||       |
            3  ]d09|_____________|      d05                  |                   ||_______|
            4  ]   d06b41-..-..d03                           |                   |B0F-..-..
            5  ]      b31-..-..         d0K-..-..            |                   ||       |
            6  ]d07   b21-..-..d05      |       |            |___________________||_______|
            7  ]      b11-..-..   d06   |_______|                  b06            B0C-..-..
            8  ]   b01-..-..-..-..                                 |..            |       |
            9  ]   a09   c10   a09                                 |..            |_______|
            10 ]      e01c10               f01               b08-..-..-..-..            b06b60
            11 ]   a09   c10   a09                           |             |            b05b50
            12 ]b01-..-..-..-..-..-..                        |             |            b04b40
            13 ]|                   |bP2-..                  |             |            b03b30
            14 ]|                   ||____|   bM1            |             |            b02b20
            15 ]|                   |                        |_____________|            b01b10
            16 ]|                   |                              c71                  b00b00
            17 ]|                   |bJ1-..                        c71
            18 ]|                   |                              c71
            19 ]|___________________|eC1-..                        c71
            20 ]                  b0D-..-..-..               b08-..-..-..-..-..-..
            21 ]                  |          |               |                   |
            22 ]                  |          |bB1a0Bb91a09b71|                   |
            23 ]                  |          |bB1a0Bb91a09b71|                   |
            24 ]                  |__________|               |                   |
            25 ]                                             |___________________|`,
            `
            1  ]                                                h91   h91
            2  ]         l72                                       h91-..   qA3
            3  ]                                                   |____|
            4  ]                                                         
            5  ]                                                         
            6  ]                                                         
            7  ]                                                      
            8  ]         o23                                       pA3
            9  ]                                                   
            10 ]                                                   h91
            11 ]   
            12 ]         P22
            13 ]                     kS2
            14 ]               r20   
            15 ]                                                   i74-..
            16 ]                                                   |____|
            17 ]                              
            18 ]   
            19 ]                     
            20 ]   
            21 ]   
            22 ]                     gE2                           j92
            23 ]                                                            m90-..
            24 ]                                                            |____|
            25 ]                                                            `
         ]
      })
      this.player=world.objects.get(player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")

      this.player.observers(ON_LIVE_CHANGE).add("SamLevel",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
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
      if(isKeyPressed("Digit8"))context.switchTo(new Lvl1_2())
      if(isKeyPressed("Digit6"))context.switchTo(new Lvl1_3())
         if(isKeyPressed("Digit5"))context.switchTo(new Lvl1_4())
      if(isKeyPressed("Digit7"))context.switchTo(new LiveEditor())
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
      message.clearAll()
   }

}