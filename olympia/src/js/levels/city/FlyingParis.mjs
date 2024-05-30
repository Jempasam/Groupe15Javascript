import { Camera } from "../../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera } from "../../../../../babylonjs/core/index.js";
import { World } from "../../objects/world/World.mjs";
import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { Level, LevelContext } from "../Level.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { LavaHole } from "../lava/LavaHole.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class FlyingParis extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("J'ai un peu le vertige!",6000,"info")

      const pack=new BasicPack(world, { next_levels:()=>new LavaHole() })
      const player=pack.player
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]                #B0C--------            #b0H--------
            2  ]                |___________#b0G----    |
            3  ]            #B0C----        |_______    |___________                        #BEA----        #bEE--------
            4  ]    #b28----|______                                                 #bEE----|_______#BEB----|___________
            5  ]#b28##02----        ##02--------            #b09----                ##0G--------------------------------#bBE----
            6  ]|__||_______        |___________            |_______                |                                   |
            7  ]#B1C#%01----        #%01--------    #b05----            #B0D----    |                                   |_______
            8  ]|  ||               |               |_______            |_______    |                                       #BBE----
            9  ]|__||_______        |___________                                    |___________________________________    |
            10 ]#b1C##02----        ##02--------                                    #B0T------------#b0T--------    #%0G    |
            11 ]|__||_______        |___________                                    |               |               |  |    |_______
            12 ]#b1M----------------#B1J------------#b1L------------                |_______________|___________    |  |
            13 ]|                   |               |                                                               |  |
            14 ]|                   |               |                                                               |  |            #b0K------------
            15 ]|                   |_______________|_______________                                                #%0G            |
            16 ]|___________________                                                                                |  |            |
            17 ]                                                                #B1F--------                        |  |            |______________
            18 ]                                                    *jF1        |                                   |  |
            19 ]                                                                |___________                        |  |
            20 ]            #b1F--------                                                                            |  |
            21 ]            |               *jF1        #b1F--------                                            ##1F--------
            22 ]            |___________                |                               *jF1        *jF1        |           
            23 ]                                        |___________                                            |___________
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]
            5  ]                            %o22                                        #|H1        #|H1        #|H1
            6  ]                            |__|                                        |  |        |  |        |  |
            7  ]                                                                        #|H1        #|H1        #|H1
            8  ]    PC210j22                                                            #|H1        #|H1        #|H1
            9  ]                                                                        |  |        |  |        |  |
            10 ]                                                                                            
            11 ]                                                                                                    
            12 ]    <>90                                                                                            
            13 ]                                                                                                    #xH0
            14 ]                                                                                                    
            15 ]
            16 ]                                                                                                    #xH0
            17 ]
            18 ]
            19 ]                                                                                                    #xH0
            20 ]                @sI2
            21 ]                                                                                                        
            22 ]                                                                                                        ?jH3
            23 ]                                                                                                    $PH3
            24 ]                                                                                                                
            25 ]                                                                
            26 ]            
            27 ]                                                                                                    
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]#b0B    #B54:c54----#B08#b05
            2  ]            |_______    :c01----
            3  ]            :c21----    |_______
            4  ]:c91        |_______
            5  ]                                    #b0B
            6  ]        'a06--------    :c41----    :c32----#B0B
            7  ]    #b58|___________    |_______    |______|
            8  ]:c91----
            9  ]|______|
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