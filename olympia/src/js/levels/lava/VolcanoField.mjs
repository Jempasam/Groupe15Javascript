import { Camera } from "../../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../../controls/Keyboard.mjs";
import { MessageManager } from "../../messages/MessageManager.mjs";
import { ON_LIVE_CHANGE } from "../../objects/behaviour/life/LivingBehaviour.mjs";
import { ON_EQUIPPED } from "../../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../../objects/model/HitboxModel.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { Level, LevelContext } from "../Level.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { SamLevel } from "../SamLevel.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";
import { LavaHole } from "./LavaHole.mjs";


export class VolcanoField extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Il fait chaud ici...",6000,"info")

      const pack=new BasicPack(world, { next_levels:()=>new LavaHole() })
      const player=pack.player
      
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]
            2  ]
            3  ]    #v0H----------------#v0B--------                <251#m06----------------
            4  ]    |                   |                           #^0B|
            5  ]    |                   |___________    ^251            |
            6  ]    |                                   >251            |___________________
            7  ]    |__________________         #^06                            #x04-------
            8  ]                            #^0A                                |__________
            9  ]                                                ^251            #m06----
            10 ]    #m06------------                        #m06--------        |_______
            11 ]    |               >251                <251|                   v251----
            12 ]    |_______________                        |___________     
            13 ]
            14 ]
            15 ]                                #v0D--------
            16 ]                                |                               ^251----
            17 ]                                |                   ?083        v251----
            18 ]                #m06                                    
            19 ]                |__|
            20 ]                #m06----#w72#w72#w72#r06----                <451#r06---- 
            21 ]                |______||__||__||__||_______                |__||______|
            22 ]
            23 ]                        #x72--------
            24 ]                        ^451--------
            25 ]                        |          |
            26 ]                        |__________|
            `
            ,
            `
            1  ]
            2  ]                                                ##0D#x0D------------##0D----##0D
            3  ]#x00----------------------------------------------------#x00----------------|  |
            4  ]|                                                       |                   |  |
            5  ]|                                                       |                   |  |
            6  ]|                                                       |                   |__|
            7  ]|                                                       |                   #x0D----
            8  ]|                                                       |                   |______|
            9  ]|                                                       |                   ##0D--------
            10 ]|                                                       #x00----------------#v0B--------
            11 ]|                                                       |                   |
            12 ]|                                                       |                   |___________
            13 ]|                                                       |                       #v09----
            14 ]|                                                       |                       |
            15 ]##0G#x00------------------------#x00--------------------#x00--------------------##0G
            16 ]#x0G|                           |                       |                       #x0G----
            17 ]|   |                           |                       |                       |
            18 ]|   |                           |                       |                       |_______
            19 ]|   |                           |                       |                       ##0G
            20 ]|   |                           |                       |
            21 ]##0G|                           |                       |
            `
            ,
            `
            1  ]
            2  ]
            3  ]                                                                        ?%73
            4  ]                                                                %#71
            5  ]                                                            %#71
            6  ]                                                                %#71%#71
            7  ]             
            8  ]
            9  ]
            10 ]
            11 ]    PP71                                                        #x72
            12 ]
            13 ]                                                                    #r72
            14 ]
            15 ]    <>G1                                                        #x72
            16 ]                                                    ##51--------
            17 ]                                                    ##51#r72----------------
            18 ]                ()72                                ##51--------
            19 ]                                         
            20 ]                                                #882    #882
            21 ]                                                #882    #882        0a82
            `
            ,
            `
            1  ]            #v25----#v03
            2  ]            |_______
            3  ]    #v23        'f06---- 
            4  ]#v25----        |_______
            5  ]|_______
            6  ]#x02----------------------------
            7  ]|
            8  ]|
            9  ]|_______________________________
            `
         ]
      })

      this.player=world.objects.get(player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")
   }

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){ }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
      message.clearAll()
   }

}