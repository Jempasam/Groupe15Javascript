import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";

export class LavaHole extends BaseLevel{

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
            1  ]            #r01----                                    #r01----
            2  ]            v801----
            3  ]            #x22                                        #m22
            4  ]
            5  ]                #m22                                        #x22
            6  ]        ##01                                                
            7  ]        |  |#x22----                                            #m01------------
            8  ]        |__|                                            #x22----------------#m01
            9  ]        #m13----#822                                            #m01------------
            10 ]                                                        ^801----
            11 ]                #x22                                    v801----
            12 ]                    ##01----
            13 ]            #m22--------#n01                            ##22#w22
            14 ]    ##01----        ##01----                                |  |
            15 ]    #n01#x22--------                                        |__|
            16 ]    ##01----                                            #w22##22
            17 ]            #m22                                        |  |
            18 ]                                                        |__|
            19 ]            ^801----                                    ##22
            20 ]            #r01---->801                                #r01----
            21 ]            |______||__|                                |______|
            `
            ,
            `
            1  ]            PP200a21
            2  ]            
            3  ]            <>D0
            `
            ,
            `
            1  ]#m04--------        #m04--------------------------------@b22    #m04------------------------
            2  ]#m04#x00------------#x00------------#x00------------#x00------------#x00----------------#m04
            3  ]|   |               |               |               |               |                   |   
            4  ]|   |               |               |               |               |                   |   
            5  ]|   |               |               |               |               |                   |   
            6  ]|   |               |               |               |               |                   |   
            7  ]|   |               |               |               |               |                   |   
            8  ]#m04#x00------------#x00------------#x00------------#x00------------#x00----------------#m04
            9  ]|   |               |               |               |               |                   |   
            10 ]|   |               |               |               |               |                   |   
            11 ]|   |               |               |               |               |                   |   
            12 ]|   |               |               |               |               |                   |   
            13 ]|   |               |               |               |               |                   |   
            14 ]#m04#x00------------#x00------------#x00------------#x00------------#x00----------------#m04
            15 ]|   |               |               |               |               |                   |   
            16 ]|   |               |               |               |               |                   |   
            17 ]|   |               |               |               |               |                   |   
            18 ]|   |               |               |               |               |                   |   
            19 ]|   |               |               |               |               |                   |   
            20 ]#m04#x00------------#x00------------#x00------------#x00------------#x00----------------#m04
            21 ]|   |               |               |               |               |                   |   
            22 ]|   |               |               |               |               |                   |   
            23 ]|   |               |               |               |               |                   |   
            24 ]|   |               |               |               |               |                   |   
            25 ]|   |               |               |               |               |                   |   
            26 ]
            `
         ]
      })
   }

}