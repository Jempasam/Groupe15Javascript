import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class SwimmingPool extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)
      
      message.send("Bizarre cette piscine. Je vais me plaindre à la mairie!",6000,"info")

      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]    
            2  ]   
            3  ]    
            4  ]    ##0A------------
            5  ]    |
            6  ]    |
            7  ]    |
            8  ]    |
            9  ]    |
            10 ]    |
            11 ]    |
            12 ]    #W0A------------
            13 ]    |
            14 ]    |
            15 ]    #W0A----#x0K----
            16 ]    |       |
            17 ]    #W0A------------
            18 ]    |
            19 ]    |
            20 ]    #x0K----#W0A----
            21 ]    |       |
            22 ]    #W0A------------
            23 ]    |
            24 ]    |
            25 ]    #W0A------------
            26 ]    |
            27 ]    #W0A------------
            28 ]    |
            29 ]    |
            30 ]    #x0A#W0A----#x0A
            31 ]    |   |       |
            32 ]    |   |       |
            33 ]    #W0A------------
            34 ]    |
            35 ]    #W0A#x0A----#W0A
            36 ]    |   |       |
            37 ]    |   |       |
            38 ]    #W0A------------
            39 ]    |
            40 ]    |
            41 ]        #W0A----
            42 ]        |
            43 ]    #W0A------------
            44 ]+OG2|
            45 ]            #W0A----
            46 ]            |       +oG2
            47 ]            |
            48 ]    #W0A------------
            49 ]    |
            50 ]    #W0A
            51 ]+OG2|
            52 ]    |
            53 ]    #W0A------------
            54 ]                #W0A
            55 ]                |   +oG2
            56 ]    #W0A------------
            57 ]    #W0A
            58 ]    |   
            59 ]    ##0A------------
            60 ]    |
            61 ]    |
            62 ]    |
            `
            ,
            `
            1  ]    Ox0F------------
            2  ]    |
            3  ]    |
            4  ]    |
            5  ]    
            6  ]    
            7  ]    
            8  ]    
            9  ]    
            10 ]        PPB1
            11 ]        0jB2
            12 ]    
            13 ]    
            14 ]    
            15 ]        <>Z1
            16 ]    
            17 ]    
            18 ]    
            19 ]    
            20 ]    
            21 ]    
            22 ]    
            23 ]    
            24 ]    
            25 ]#xA8--------------------
            26 ]|
            27 ]
            28 ]
            29 ]
            30 ]
            31 ]
            32 ]
            33 ]
            34 ]
            35 ]
            36 ]
            37 ]
            38 ]
            39 ]
            40 ]
            41 ]
            42 ]
            43 ]
            44 ]
            45 ]
            46 ]
            47 ]
            48 ]
            49 ]
            50 ]
            51 ]
            52 ]
            53 ]
            54 ]
            55 ]
            56 ]
            57 ]
            58 ]
            59 ]
            60 ]
            61 ]
            62 ]        @MD6----
            63 ]        |
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]#g42----#g42----#g42----
            2  ]#g22----#g22----#g22----
            3  ]:c03--------:c03--------
            4  ]#g42#g42    #g42#g42
            5  ]:c03--------:c13--------
            6  ]
            7  ]
            8  ]
            9  ]#u28:c21'a24    :c21#B24
            10 ]:c24    |   :c21#u28#b25
            11 ]        |   |   :c21:c22
            12 ]
            13 ]:c22            :c22
            14 ]#u24:c22
            15 ]:c22        :c22----
            16 ]            |       #u24
            17 ]                    :c22
            18 ]
            19 ]        :c22
            20 ]
            `
         ]
      })
   }

}