import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";
import { ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";
import { EffectPack } from "./objectpacks/EffectPack.mjs";
import { FightPack } from "./objectpacks/FightPack.mjs";
import { IAPack } from "./objectpacks/IAPack.mjs";
import { LivingPack } from "./objectpacks/LivingPack.mjs";
import { ModelPack } from "./objectpacks/ModelPack.mjs";
import { MonsterPack } from "./objectpacks/MonsterPack.mjs";
import { ParticlePack } from "./objectpacks/ParticlePack.mjs";
import { PhysicPack } from "./objectpacks/PhysicPack.mjs";
import { PlayerPack } from "./objectpacks/PlayerPack.mjs";
import { SoilPack } from "./objectpacks/SoilPack.mjs";


export class Lvl1_2 extends Level{

   static playerPos=new Vector3(1.5, 3, 3)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context, world,options){

      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      const pack=new BasicPack(world)

      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         position: new Vector3(-4,0,-8),
         world,
         objects: pack.objects,
         name_length: 2,
         maps: [
`
1  ]
2  ]
3  ]        PP71
4  ]
5  ]
6  ]
7  ]        <>E1
`
,
`
1  ]##0H-...-...-...
2  ]##B6-...-...-...
3  ]|              |
4  ]|______________|
5  ]##0H-...-...-...
6  ]    0a61
7  ]
8  ]
`
,
`
1  ]                #^08#^08#^08#^08
2  ]    #n05-...-...-...-...-...#^08
3  ]    |                      |#^08
4  ]    |                      |#^08
5  ]    |                      |#^08
6  ]    |                      |#^08
7  ]    |______________________|#^08
8  ]    #n04-...-...-...-...-...
9  ]    #n03-...-...-...-...-...
10 ]    #n02-...-...-...-...-...-...-...-...-...                        #n02-...-...
11 ]    |                                      |                        |          |
12 ]    |                                      |>211                <211|__________|
13 ]    |                                      |
14 ]    |______________________________________|
`
         ]
      })

      this.player=world.objects.get(pack.player.player.id)?.[0]
      if(this.player==null)window.alert("Player not found")

      this.player.observers(ON_LIVE_CHANGE).add("Lvl1_2",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })
   }

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
   stop(world,options){ }

}