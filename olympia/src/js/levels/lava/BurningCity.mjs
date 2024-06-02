import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class BurningCity extends BaseLevel{

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
            1  ]    #b09----------------
            2  ]#r04#r01----------------#b09
            3  ]|__||                   |  |
            4  ]#m03|                   |  |
            5  ]|__||                   |  |
            6  ]#m02|___________________|__|
            7  ]|  |#x00----------------#b07----------------#x07----
            8  ]|__||                   |__________________||      |
            9  ]#b09|                   #x06----------------|      |
            10 ]    |                   |__________________||      |
            11 ]    |                   #b07----#b0E--------|      |
            12 ]    |                   |______||          ||      |
            13 ]#b1A|                           |__________||______|
            14 ]|__||                   #b04        #x0F
            15 ]#b09|
            16 ]|__|#m01----------------    #b18----
            17 ]    |__________________|    |______|
            18 ]    #x00----------------
            19 ]    |__________________|
            `
            ,
            `
            1  ]                                <2O1>2O1        
            2  ]            PP21                                
            3  ]                                                ^2O1
            4  ]    >4O1                ^2O1                    #rO1
            5  ]    v4O1                                        v4O1
            6  ]            <>90                        <2G1
            7  ]            v210                        v4G1
            8  ]                            ^2G1
            9  ]                            #mG1
            10 ]                    <4O1##O1o8G1                
            11 ]#xU2                        <8S1#bP4--------
            12 ]|__|        ^210            |__||          |
            13 ]#bC8----    v210                |__________|
            14 ]|______|                            o4O1        ^4O1
            15 ]    #bL8##G1--------                #rO1        <2O1
            16 ]        |          |                <4G1^4G1
            17 ]        |__________|
            18 ]            oG10
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]                                                #8Q2
            5  ]
            6  ]
            7  ]
            8  ]
            9  ]                            #8I2
            10 ]                                        #8I2
            11 ]        #rU2    #8U2    #mU2    #bEA#xF0----
            12 ]        #8U2    #mU2    #8U2    |  ||      |
            13 ]#bL8----#mU2                    |__||______|
            14 ]|______|
            15 ]    ()U1                            #8Q2
            16 ]            0aJ2
            `
         ]
      })

   }


}