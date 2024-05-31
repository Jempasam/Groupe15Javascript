import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class SandMonster extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)
      
      message.send("Beeuh, j'ai du sable dans la bouche...",6000,"info")

      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]##0H------------#g09--------##0H------------
            2  ]                |          |
            3  ]##0H#I1H##0H----|----------|##0H----#I1H##0H
            4  ]#I1H#t01#t01##01----##01##01----#t01#t01#I1H
            5  ]##0H|  ||  ||       |  ||       |  ||  |##0H
            6  ]|  ||  ||  ||       |  ||       |  ||  ||  |
            7  ]|  |#t01#t01|       |  ||       #t01#t01|  |
            8  ]|  ||  ||  ||       |  ||       |  ||  ||  |
            9  ]|  ||  ||  ||       |__||       |  ||  ||  |
            10 ]|__|#t01#t01|       &T00|       #t01#t01|__|
            11 ]#I1H|__||__||_______##01|_______|__||__|#I1H
            12 ]##0H#I1H##0A------------------------#I1H##0H
            13 ]
            14 ]
            15 ]
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]##01--------
            21 ]|
            22 ]|
            23 ]|___________
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]    PP210j210a21        
            5  ]                        
            6  ]    
            7  ]    
            8  ]    #-21#-21                    #-21#-21
            9  ]    <>V0
            10 ]                    +S20
            11 ]                    
            12 ]
            13 ]
            14 ]
            15 ]
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]    ()22
            21 ]
            22 ]    &TD0
            23 ]
            24 ]
            25 ]
            26 ]
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]
            5  ]
            6  ]
            7  ]    ox81----                    ox81----
            `
            ,
            `
            1  ]#^08#^03    #^08#^06    #^08
            2  ]#^05    #g61#g61#g61    #^03
            3  ]            's03
            4  ]#^08        |__|        #^08
            5  ]
            6  ]    #^03#^07#^05
            7  ]    #^08    #^06
            8  ]    #^06    #^08
            `
         ]
      })
   }

}