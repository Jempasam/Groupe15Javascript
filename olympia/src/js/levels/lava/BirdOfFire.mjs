import { Camera } from "../../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera } from "../../../../../babylonjs/core/index.js";
import { World } from "../../objects/world/World.mjs";
import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { Level, LevelContext } from "../Level.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
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
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
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