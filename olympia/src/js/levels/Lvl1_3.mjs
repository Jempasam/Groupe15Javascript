import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING } from "../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { Lvl1_4 } from "./Lvl1_4.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";


export class Lvl1_3 extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Il fait chaud ici...",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      const pack=new BasicPack(world, { next_levels:[context, ()=>new Lvl1_4()] })
      const player=pack.player

      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         world,
         objects: pack.objects,
         name_length: 2,
         maps: [
            `
            1  ]    #b09----------------
            2  ]#r04#r01----------------#b09
            3  ]|__||                   |  |
            4  ]#m03|                   |  |
            5  ]|__||                   |  |
            6  ]#m02|___________________|__|
            7  ]|  |#x00----------------#b07----------------#x07----
            8  ]|__||                   |__________________||      |
            9  ]#b09|                   #x06----------------|      |
            10 ]    |                   |__________________||      |
            11 ]    |                   #b07----#b0E--------|      |
            12 ]    |                   |______||          ||      |
            13 ]#b1A|                           |__________||______|
            14 ]|__||                   #b04        #x0F
            15 ]#b09|
            16 ]|__|#m01----------------    #b18----
            17 ]    |__________________|    |______|
            18 ]    #x00----------------
            19 ]    |__________________|
            `
            ,
            `
            1  ]                                <2O1>2O1        
            2  ]            PP21                                
            3  ]                                                ^2O1
            4  ]    >4O1                ^2O1                    #rO1
            5  ]    v4O1                                        v4O1
            6  ]            <>90                        <2G1
            7  ]            v210                        v4G1
            8  ]                            ^2G1
            9  ]                            #mG1
            10 ]                    <4O1##O1o8G1                
            11 ]#xU2                        <8S1#bP4--------
            12 ]|__|        ^210            |__||          |
            13 ]#bC8----    v210                |__________|
            14 ]|______|                            o4O1        ^4O1
            15 ]    #bL8##G1--------                #rO1        <2O1
            16 ]        |          |                <4G1^4G1
            17 ]        |__________|
            18 ]            oG10
            `
            ,
            `
            1  ]
            2  ]
            3  ]
            4  ]                                                #8Q2
            5  ]
            6  ]
            7  ]
            8  ]
            9  ]                            #8I2
            10 ]                                        #8I2
            11 ]        #rU2    #8U2    #mU2    #bEA#xF0----
            12 ]        #8U2    #mU2    #8U2    |  ||      |
            13 ]#bL8----#mU2                    |__||______|
            14 ]|______|
            15 ]    ()U1                            #8Q2
            16 ]            0aJ2
            `
         ]
      })

      this.player=world.objects.get(player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")

      this.player.observers(ON_LIVE_CHANGE).add("Lvl1_2",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })
   }

   camerapos=new Vector3(0,6,8)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){
      if(isKeyPressed("Digit9"))context.switchTo(new SamLevel())
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
      message.clearAll()
   }

}