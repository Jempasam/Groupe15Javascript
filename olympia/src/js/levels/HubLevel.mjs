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
      message.send("Bienvenue dans Olympia! Entrez dans un portail pour commencer votre aventure!",6000,"info")
      
      const base=new BasicPack(world, { next_levels: ()=>new VolcanoField() })
      const player=base.player
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: base.objects,
         maps:[
            `
            1  ]                    #i3B----------------
            2  ]    ##39            ##39#i12--------##39            ##39
            3  ]    |  |#x1B--------|  ||           |  |#b1B--------|  |
            4  ]    |__||___________|__||___________|__||___________|__|
            5  ]#x1B##12#m12--------##12----------------#%12--------##12#b3G----
            6  ]|  ||   |           |                   |           |  ||  
            7  ]|  ||   |           |                   |           |  ||  
            8  ]|  ||   |           |                   |           |  ||_______
            9  ]|__||___|___________|___________________|___________|__|
            10 ]                    #~12----------------
            11 ]                    |
            12 ]                    |___________________
            13 ]                    ##12----------------
            14 ]
            15 ]
            16 ]
            17 ]
            18 ]
            19 ]
            20 ]
            21 ]
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]
            5  ]    #I49@I52    @v52#I49            #I49%842    @p52#I49
            6  ]                                    
            7  ]                            PP41
            8  ]         
            9  ]    #I49@b52        #I49%842        #I49        @s52#I49
            10 ]                            
            11 ]                            <>A1
            12 ]                    
            13 ]                    #I49            #I49
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