import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { Vector3 } from "../../../../babylonjs/core/Maths/math.vector.js";

import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { LIVING } from "../objects/model/LivingModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level } from "./Level.mjs";
import { LIVE_EDITOR_SETTINGS } from "./LiveEditor.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";


export class Lvl1_2 extends Level{

   static playerPos=new Vector3(1.5, 3, 3)

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){

      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      const pack=new BasicPack(world)
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
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

   /** @override @type {BaseLevel['start']} */
   tick(context,world,options){
      if(isKeyPressed("Digit9"))context.switchTo(new SamLevel())
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){ }

}