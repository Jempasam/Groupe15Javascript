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
      
      const base=new BasicPack(world, { next_levels:[context, ()=>new Lvl1_3()] })
      const player=base.player
 
      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         position: new Vector3(-4,0,-8),
         world,
         objects: base.objects,
         name_length: 2,
         maps:[
            `
            1  ]#^03##06-...-...-...-...    #^09                            ##08-...-...-...-...-...-...##0H-...-...#m08-...-...-...-...#x02--------#m08-...-...-...-...
            2  ]    |                  |##51#I06##51#I06##51#I06##51#I07##71|                          ||          ||                  ||           |
            3  ]#^09|__________________|        #^05                        |                          ||__________||                  ||           |
            4  ]    #^06##41-...-...#^03                                    |                          |##08-...-...|                  ||___________|                               #r08-...-...
            5  ]        ##31-...-...            #^0K-...-...                |                          ||          ||                  |#r08-...-...|                   #r08-...-...|           #r08------------
            6  ]#^07    ##21-...-...#^05        |          |                |__________________________||__________||                  |#x02-...-...|                               |___________
            7  ]        ##11-...-...    #^06    |__________|                        ##06                ##0H-...-...|                  ||           |
            8  ]    ##01-...-...-...-...                                            |..                 |          ||                  ||           |
            9  ]    #I09    #n10    #I09                                            |..                 |__________||__________________||___________|___________________
            10 ]        o801#n10                ##01                        ##08-...-...-...-...            
            11 ]    #I09    #n10    #I09                                    |                  |            
            12 ]##01-...-...-...-...-...-...                                |                  |            
            13 ]|                          |##P2-...                        |                  |            
            14 ]|                          ||______|    ##M1                |                  |            
            15 ]|                          |                                |__________________|            
            16 ]|                          |                                        #n71                    
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
            1  ]                                                                    %#91                                            +o81                        #m90
            2  ]            0d82                                                %#91%#91----                            #m91----
            3  ]                                                                    |______|%#91                        |______|
            4  ]                                                                                        #w97
            5  ]            ?053                                                                ?%93    |  |                                            #m91----+O81                    0p92                ()92
            6  ]                                                                                        |__|                                            |______|
            7  ]                                                                                    
            8  ]                                                                                    
            9  ]                                                                    ?xA3                                            
            10 ]
            11 ]                                                                            
            12 ]            PP21
            13 ]                            0sT2
            14 ]                                                                        +s90----
            15 ]                                                                        |______|
            16 ]            <>B0
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
         console.log(this.player.tags)

      this.player.observers(ON_LIVE_CHANGE).add("SamLevel",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })

   }

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){
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