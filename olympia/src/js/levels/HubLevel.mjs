import { UniversalCamera } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { BaseLevel } from "./BaseLevel.mjs";
import { Level, LevelContext } from "./Level.mjs";
import { LIVE_EDITOR_SETTINGS, LiveEditor } from "./LiveEditor.mjs";
import { VolcanoField } from "./lava/VolcanoField.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";

export class HubLevel extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context,world,options){
      const base=new BasicPack(world)
      this.init(world,base)
      message.send("Bienvenue dans Olympia! Entrez dans un portail pour commencer votre aventure!",6000,"info")
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: base.objects,
         maps:[
            `
            1  ]                    ##3B----------------
            2  ]    ##39            ##39##12--------##39            ##39
            3  ]    |  |#x1B--------|  ||           |  |#b1B--------|  |        *jJ2
            4  ]    |__||___________|__|d#19--------|__||___________|__|
            5  ]#x1B##12#m12--------##12----------------#%12--------##12#b3G----*jE2
            6  ]|  ||   |           |                   |           |  ||  
            7  ]|  ||   |           |                   |           |  ||       *jA2
            8  ]|  ||   |           |                   |           |  ||_______
            9  ]|__||___|___________|___________________|___________|__|        *j62
            10 ]                    #~12----------------
            11 ]                    |                                       *j32
            12 ]                    |___________________
            13 ]                    ##12----------------
            14 ]                            ##010j12
            15 ]                            
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]
            21 ]
            22 ]
            23 ]
            `
            ,
            `
            1  ]
            2  ]                        @P46--------
            3  ]
            4  ]
            5  ]    #I49            #I49%b42--------#I49%842        #I49
            6  ]            @v52                            @p52
            7  ]                                                
            8  ]         
            9  ]    #I49            #I49%842        #I49            #I49
            10 ]                                #=46----
            11 ]                            PP41
            12 ]                        
            13 ]                    #I49            #I49
            14 ]
            15 ]                            <>A1
            `
            ,
            `
            1  ]
            `
            ,
            `
            1  ]    #m63----#i55----
            2  ]    #v53----        #b55----
            3  ]                'a12
            4  ]#m33#x30--------:c11----:c33
            5  ]|__||__________||______||__|
            `
         ]
      })

   }

   /** @override @type {BaseLevel['start']} */
   tick(context,world,options){
      if(isKeyPressed("Digit7"))context.switchTo(new LiveEditor())
   }

   stop(world,options){ }

}