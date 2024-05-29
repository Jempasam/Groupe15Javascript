import { UniversalCamera } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { LIVE_EDITOR_SETTINGS, LiveEditor } from "./LiveEditor.mjs";
import { VolcanoField } from "./lava/VolcanoField.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";

export class HubLevel extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context,world,options){
      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      
      const base=new BasicPack(world, { next_levels: ()=>new VolcanoField() })
      const player=base.player
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: base.objects,
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
            1  ]    @I82@_82@b82                                                    %#91                                            +o81                        #m90
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
            12 ]            PC21
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

   }

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){
      if(isKeyPressed("Digit7"))context.switchTo(new LiveEditor())
   }

   stop(world,options){ }

}