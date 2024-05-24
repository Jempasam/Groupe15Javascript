import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING } from "../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { Lvl1_2 } from "./Lvl1_2.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";


export class Lvl1_4 extends Level{

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Il fait chaud ici...",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      const pack=new BasicPack(world,message)
      const player=pack.player

      pack.objects["()"]={tags:[...pack.physic.STATIC_GHOST(), pack.model.vortex.id, pack.player.createLevelChange(context,()=>new Lvl1_2()).id]}

      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         world,
         objects: pack.objects,
         name_length: 2,
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
            1  ]#m04--------        #m04--------------------------------()22    #m04------------------------
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

      this.player=world.objects.get(player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")

      this.player.observers(ON_LIVE_CHANGE).add("Lvl1_4",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })

      this.player.observers(ON_DEATH).add("Lvl1_4",(obj)=>{
         console.log("Player dead")
         context.switchTo(new Lvl1_4())
      })

      options.camera.lockedTarget=this.player.get(HITBOX)?.hitbox
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