import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class BirdOfFire extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)

      message.send("Il fait chaud ici...",6000,"info")

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
   }


}