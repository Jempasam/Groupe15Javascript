import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class DashFalls extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)
      
      message.send("Il fait froid ici... Brrrrr...",6000,"info")

      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]
            2  ]
            3  ]    #r09--------                                                    :c04------------        :c06----------------
            4  ]    |                                                               |                       |
            5  ]    |                                                               |                       |
            6  ]        #n09                                                                                |
            7  ]                                        :c01    :c04----                                    |
            8  ]                                                |
            9  ]
            10 ]
            11 ]
            12 ]        #n09
            13 ]#r09----------------                ##54        ##54                    ##54        ##54        #r09----------------
            14 ]|                                                                                               |
            15 ]|                           ##54                                                                |       
            16 ]|                                               ##54        ##54        ##54                    |
            17 ]|___________________                                                                            |__________________
            18 ]            #n09                                                                                        #M63
            19 ]                                                                                                       
            20 ]                                                                                                        ##G4
            21 ]                                                                                                       
            22 ]                                                                                                       
            23 ]                                                                                                        ##G4
            24 ]
            25 ]                                                                                                #rAA----------------
            26 ]            #n08                            #r08----------------                                |
            27 ]        #n08--------                        |                   #WA8    #WC8    #WE8##FB#WG8----|
            28 ]        |           #n08----#n08----#n08----|                   |   ##BB|       |       |       |
            29 ]        |                                   |                   |       |   ##DB|       |       |
            30 ]                                            |
            `
            ,
            `
            1  ]
            2  ]
            3  ]        @NB2
            4  ]
            5  ]
            6  ]
            7  ]
            8  ]
            9  ]
            10 ]
            11 ]
            12 ]
            13 ]
            14 ]                                                                                                        $PA3
            15 ]PCA1    0dB2                                                                                            
            16 ]
            17 ]
            18 ]
            19 ]<>K1
            20 ]
            21 ]
            22 ]
            23 ]
            24 ]
            25 ]
            26 ]
            27 ]
            28 ]            0jA2                                                                                        $PL3
            29 ]                                                    $P93                                                
            30 ]
            31 ]                                                                                                            
            32 ]
            33 ]
            34 ]
            35 ]                                                                                                            ##T1
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]                :c08-------
            2  ]:c44#r08--------#W08----#r08--------#^0D----
            3  ]#^08----:c01----#W01----#^06#^08----|
            4  ]|       |                   |       #^07
            5  ]                        :c14#W01--------#r0A----
            6  ]#r08:c41----'a44----        |           |
            7  ]|   |       |           :c01|           |
            8  ]|   |                   |   |           #W0A----
            9  ]#^08            :c41----        :c61----#W01----
            10 ]#^06            |               |
            `
         ]
      })
   }

}