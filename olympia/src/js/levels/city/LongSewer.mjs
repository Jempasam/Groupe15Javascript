import { Camera } from "../../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera } from "../../../../../babylonjs/core/index.js";
import { World } from "../../objects/world/World.mjs";
import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { Level, LevelContext } from "../Level.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { LavaHole } from "../lava/LavaHole.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class LongSewer extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Ca sent mauvais ici!",6000,"info")

      const pack=new BasicPack(world, { next_levels:()=>new LavaHole() })
      const player=pack.player
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]#b1D----#B1B----#b1D----#b1A----#B1B----                                                                ##0F#H0B##0F--------#H0B##0F
            2  ]|______||______|#%12----|______||______|                                                                |  |##02----------------|  |
            3  ]#b1D##12----------------##12----#%12----#B1B----                                                        |  ||                  ||  |
            4  ]|__||                  |&T20----|      ||      |                                                        |  ||__________________||  |
            5  ]#B1A|__________________||______||______||______|                                                        |  |                    |  |
            6  ]|__|            ##12----------------#B1B----                                                            |__|                    |__|
            7  ]                                    |______|                                                            |__|                    |__|
            8  ]                                                                                                        |__|                    |__|
            9  ]                                                               
            10 ]
            11 ]
            12 ]
            13 ]
            14 ]
            15 ]
            16 ]                                                                                                                                                                                                                                        #H02
            17 ]##0F------------------------------------------------------------##0F------------------------------------------------------------##0F------------------------------------------------------------#H0F##0F--------#H0F##0F--------#H0F##A8------------#H0M##0M--------#H0M
            18 ]        ##02--------                            ##02--------                                                                                ##02--------    ##58    ##02----                                                    ##02--------                            #H0D--------
            19 ]        |          |        >201                |          |        >201        ##02-------         ##02--------        ##02--------        |          |    |  |    |      |    o802        o802        o802        o802        |          |        *j02*jB2*j52        |
            20 ]        |__________|                            |__________|                                                                                |__________|    |  |    |______|                                                    |__________|                            |
            21 ]                                                                                                                                                            |__|               
            `
            ,
            `
            1  ]
            2  ]                    %o42                                                                                            @h42
            3  ]    PC41            |__|    #O40----                                                                                &TD0
            4  ]            0j42            |______|
            5  ]    
            6  ]        
            7  ]    <>A1
            8  ]        
            9  ]
            10 ]
            11 ]
            12 ]
            13 ]
            14 ]
            15 ]
            16 ]
            17 ]
            18 ]            &TD0                                                                                                                                                            #xA1------------#xA1------------#xA1-------|                        ##7F----        ##5A----&TC2-------- 
            19 ]                                                                                    +gA6                +gA6            +gA6    +gA6            $P24                        |               |               |          |            $P24        |      |        |      ||
            20 ]                                                                                                                                                                            |_______________|_______________|__________|                        |______|        |      ||-----------
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]#B08'a41                                                    
            2  ]|__|
            3  ]#b08
            4  ]|__|                                                        ##0A--------------------
            5  ]##0A-------------------------------------------------------------
            6  ]##0A:c00------------
            7  ]|__||
            8  ]
            9  ]                                                    's02------------
            `
         ]
      })
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
   stop(world,options){ }

}