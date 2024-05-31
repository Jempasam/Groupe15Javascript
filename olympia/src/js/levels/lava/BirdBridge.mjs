import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class BirdBridge extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)

      message.send("J'ai l'impression que cette porte a du mal à souffrir!",6000,"info")

      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
            `
            1  ]#r09------------------------#r09                                                    #n11        #n11        #n11        #n11        #n11        #n11
            2  ]#r09#m01--------------------|__|                                    #n02---->811----                                                                <811----#n02--------
            3  ]|   |                       #m01#n01#n02#n03#M04            #n02#n02|      ||______|                                                                |______||          |
            4  ]|   |                       |  |#n01#n02#n03#M04            #n02#n02#n02----                +b10                    #n11                +b10                #n02--------
            5  ]|   |                       |__|#n01#n02#n03#M04            #n02#n02#n02----                                <811---->811----                                #n02--------
            6  ]|   |                       #r09                                    |______|                                |______||______|                                |__________|
            7  ]|   |_______________________|__|                                                    #n11        #n11        #n11        #n11        #n11        #n11
            8  ]#I09                    #I09                
            `
            ,
            `
            1  ]
            2  ]    PC21    #c24                                                                                                                                                @h33
            3  ]    %822                    d#19
            4  ]                #C24    ?d23|  |                            $P42                                                    0a32                                                
            5  ]        #c24                |__|                                                                                    
            6  ]                #c24    #C24
            7  ]    <>H1
            8  ]
            9  ]
            10 ]            +O21
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]    #v08----    #x0A----#v05#v04#m06#x06----#m06----
            2  ]    |           #x01----            #x01----
            3  ]                |                   |
            4  ]                'f04--------        |
            `
         ]
      })
   }


}