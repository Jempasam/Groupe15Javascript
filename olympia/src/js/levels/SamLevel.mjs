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
import { BasicPack } from "./objectpacks/BasicPack.mjs";
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
      let id_counter=7532
      /**
       * @param {...(Behaviour|[Behaviour,number])} behaviours
       */
      function behav(...behaviours){
         const ret=id_counter++
         world.addBehaviours(ret, ...behaviours)
         return ret
      }
      
      const base=new BasicPack(world,message)
      const player=base.player

      // Platform
      const MOVING=behav(new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04))

      // Hint
      base.objects["hu"]={tags:[
         player.createHint(message,"Vous pouvez débloquer des améliorations grâce aux artefactes dorés!").id,
         base.model.question_mark.id, ...base.physic.STATIC_GHOST()
      ]}
      base.objects["hp"]={tags:[
         player.createHint(message,"Ces caisses peuvent être déplacées, peut être qu'elles peuvent vous être utile.").id,
         base.model.question_mark.id, ...base.physic.STATIC_GHOST()
      ]}
      base.objects["hd"]={tags:[
         player.createHint(message,"Attention aux dégats! Si vous fumez, il ne faut plus vous faire toucher.").id,
         base.model.question_mark.id, ...base.physic.STATIC_GHOST()
      ]}
   
      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         position: new Vector3(-4,0,-8),
         world,
         objects: base.objects,
         name_length: 2,
         maps:[
            `
            1  ]#^03##06-...-...-...-...    #^09                            ##08-...-...-...-...-...-...##0D-...-...
            2  ]    |                  |##51#I06##51#I06##51#I06##51#I07##71|                          ||          |
            3  ]#^09|__________________|        #^05                        |                          ||__________|
            4  ]    #^06##41-...-...#^03                                    |                          |##0F-...-...
            5  ]        ##31-...-...            #^0K-...-...                |                          ||          |
            6  ]#^07    ##21-...-...#^05        |          |                |__________________________||__________|
            7  ]        ##11-...-...    #^06    |__________|                        ##06                ##0C-...-...
            8  ]    ##01-...-...-...-...                                            |..                 |          |
            9  ]    #I09    #n10    #I09                                            |..                 |__________|
            10 ]        o801#n10                ##01                        ##08-...-...-...-...            ##06##60
            11 ]    #I09    #n10    #I09                                    |                  |            ##05##50
            12 ]##01-...-...-...-...-...-...                                |                  |            ##04##40
            13 ]|                          |##P2-...                        |                  |            ##03##30
            14 ]|                          ||______|    ##M1                |                  |            ##02##20
            15 ]|                          |                                |__________________|            ##01##10
            16 ]|                          |                                        #n71                    ##00##00
            17 ]|                          |##J1-...                                #n71
            18 ]|                          |                                        #n71
            19 ]|__________________________|o4D1-...                                #n71
            20 ]v401                    ##0D-...-...-...                        ##08-...-...-...-...-...-...
            21 ]                        |              |                        |                          |
            22 ]                        |              |##B1#I0B##91#I09##71#I07|                          |
            23 ]                        |              |##B1#I0B##91#I09##71#I07|                          |
            24 ]                        |______________|                        |                          |
            25 ]##01                                                            |__________________________|
            `
            ,
            `
            1  ]                                                                    %#91
            2  ]            0d82                                                %#91%#91----    
            3  ]                                                                    |______|%#91
            4  ]
            5  ]            hu53                                                                hp93
            6  ]
            7  ]
            8  ]                                                                           
            9  ]                                                                    hdA3
            10 ]
            11 ]                                                                            
            12 ]            PP22
            13 ]                            0sT2
            14 ]                                                                        +s90----
            15 ]                                                                        |______|
            16 ]                                                                            
            17 ]
            18 ]                    +k20
            19 ]                   
            20 ]                            
            21 ]                            0jF2                                                +pA0----
            22 ]                                                                    0aA2        |______|
            23 ]
            24 ]
            25 ]0b22
            `
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