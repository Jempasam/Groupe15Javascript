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


export class BirdOfFire extends Level{

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
            1  ]#m1D----------------#m1A#r06#m1A#m1D----------------
            2  ]#m1G#^1B            #m19|  |#m19            #^1B#m1G
            3  ]|  |                    |__|                    |  |
            4  ]|  |        #m06------------------------        |  |
            5  ]|  |        |                                   |  |
            6  ]|  |        |                                   |  |
            7  ]|__|        |                                   |__| 
            8  ]            |
            9  ]            |
            10 ]            |
            `
            ,
            `
            1  ]                        PP71
            2  ]                        0a71
            3  ]                        
            4  ]
            5  ]
            6  ]                        <>R1
            7  ]            #p78                    #q78
            8  ]                                    
            9  ]                        +B70
            `
            ,
            `
            1  ]#x00------------------------------------------------
            2  ]|
            3  ]|
            4  ]|
            5  ]|
            6  ]|
            7  ]|
            8  ]|
            9  ]|
            10 ]|
            11 ]|
            12 ]|
            13 ]|
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