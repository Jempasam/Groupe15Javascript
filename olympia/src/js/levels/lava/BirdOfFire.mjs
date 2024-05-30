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
            1  ]#m1D----------------#m1B--------#m1D----------------
            2  ]#m1D----------------#m1A#r06#m1A#m1D----------------
            3  ]#m1G#^1B            #m19|  |#m19            #^1B#m1G
            4  ]|  |                    |__|                    |  |
            5  ]|  |        #m06------------------------        |  |
            6  ]|  |        |                                   |  |
            7  ]|  |        |                                   |  |
            8  ]|__|        |                                   |__| 
            9  ]#m1D        |                                   #m1D
            10 ]|  |        |                                   |  |
            11 ]|  |        |___________________________        |  |
            12 ]|__|        >406--------#r08                    |__|
            13 ]            |__________||  |
            14 ]                        |__|
            `
            ,
            `
            1  ]
            2  ]                        PP71
            3  ]                        0a71
            4  ]                        
            5  ]
            6  ]
            7  ]                        <>R1
            8  ]            #p78                    #q78
            9  ]
            10 ]                        +B70
            `
            ,
            `
            1  ]
            2  ]#x00------------------------------------------------
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
            14 ]|
            15 ]|
            16 ]|
            `
            ,
            `
            1  ]    #v24----#^23#v24#m26----
            2  ]    |______|
            3  ]#v16----'f53----    #v16----
            4  ]|______||______|    |______|
            5  ]#v16----            #v16----
            6  ]|______|            |______|
            7  ]#x32------------------------
            8  ]|
            9  ]|___________________________
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