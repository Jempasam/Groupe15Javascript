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
         tile_size: new Vector3(1.5,0.5,1.5),
         world,
         objects: pack.objects,
         name_length: 2,
         maps: [
            `
            1  ]
            2  ]    #v0H----------------#v0B--------                <251#m06----------------
            3  ]    |                   |                           #^0B|
            4  ]    |                   |___________    ^251            |
            5  ]    |                                   >251            |___________________
            6  ]    |__________________         #^06                            #x04-------
            7  ]                            #^0A                                |__________
            8  ]                                                ^251            #m06----
            9  ]    #m06------------                        #m06--------        |_______
            10 ]    |               >251                <251|                   v251----
            11 ]    |_______________                        |___________     
            12 ]
            13 ]
            14 ]                                #v0D--------
            15 ]                                |                               ^251----
            16 ]                                |                   ?083        v251----
            17 ]                #m06                                    
            18 ]                |__|
            19 ]                #m06----#w72#w72#w72#r06----                <451#r06---- 
            20 ]                |______||__||__||__||_______                |__||______|
            21 ]
            22 ]                        #x72--------
            23 ]                        ^451--------
            24 ]                        |          |
            25 ]                        |__________|
            `
            ,
            `
            1  ]                                                ##0D#x0D------------##0D----##0D
            2  ]#x00----------------------------------------------------#x00----------------|  |
            3  ]|                                                       |                   |  |
            4  ]|                                                       |                   |  |
            5  ]|                                                       |                   |__|
            6  ]|                                                       |                   #x0D----
            7  ]|                                                       |                   |______|
            8  ]|                                                       |                   ##0D--------
            9  ]|                                                       #x00----------------#v0B--------
            10 ]|                                                       |                   |
            11 ]|                                                       |                   |___________
            12 ]|                                                       |                       #v09----
            13 ]|                                                       |                       |
            14 ]##0G#x00------------------------#x00--------------------#x00--------------------##0G
            15 ]#x0G|                           |                       |                       #x0G----
            16 ]|   |                           |                       |                       |
            17 ]|   |                           |                       |                       |_______
            18 ]|   |                           |                       |                       ##0G
            19 ]|   |                           |                       |
            20 ]##0G|                           |                       |
            `
            ,
            `
            1  ]
            2  ]                                                                        ?%73
            3  ]                                                                %#71
            4  ]                                                            %#71
            5  ]                                                                %#71%#71
            6  ]             
            7  ]
            8  ]
            9  ]
            10 ]    PP71                                                        #x72
            11 ]
            12 ]                                                                    #r72
            13 ]
            14 ]    <>G1                                                        #x72
            15 ]                                                    ##51--------
            16 ]                                                    ##51#r72----------------
            17 ]                ()72                                ##51--------
            18 ]                                         
            19 ]                                                #882    #882
            20 ]                                                #882    #882        0a82
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