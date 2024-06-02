import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";


export class BambooMaze extends BaseLevel{

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
1  ]#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8@F8#uZ8
2  ]#uZ8                        #uZ8            #uZ8            #uZ8            #uZ8                    #uZ8
3  ]#uZ8    #uZ8#uZ8#uZ8#uZ8            #uZ8            #uZ8            #uZ8    #uZ8    #uZ8#uZ8#uZ8#uZ8#uZ8
4  ]#uZ8    #uZ8        #uZ8    #uZ8    #uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8    #uZ8    #uZ8            #uZ8
5  ]#uZ8    #uZ8    #uZ8#uZ8    #uZ8    #uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8            #uZ8    #uZ8    #uZ8
6  ]#uZ8    #uZ8                #uZ8                #uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8        #uZ8
7  ]#uZ8    #uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8            #uZ8#uZ8
8  ]#uZ8                                                                                    #uZ8        #uZ8
9  ]#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8    #uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8#uZ8
10 ]#r0X-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
11 ]|
12 ]|
13 ]        #r01-.-.-.-.-.-.-.-.    #WF1-.-.-.-.-.-.        ^2J1            ^2S1
14 ]        |                       |                       |               |
15 ]        |                       |
16 ]        |                       |
17 ]        |                       |
18 ]        |                       |
19 ]        |                       |
20 ]        |                       |
21 ]        |                       |
22 ]        |                       |
23 ]        |                       |
24 ]        |                       #r01-.-.-.-.-.-.
25 ]        #r01-.-.-.-.-.-.-.-.-.-.#W01-.-.-.-.-.-.        #r61        #r81
26 ]        |                       |
27 ]        |                       |
28 ]        |                       |
29 ]
`
,
`
1  ]
2  ]
3  ]
4  ]
5  ]
6  ]
7  ]
8  ]
9  ]
10 ]
11 ]                                                            v2V1            v2L1
12 ]                                                            |               |
13 ]                            #rG7#rI7#rL5-.-.#rI7#rG7                                    ^2N1
14 ]                            |   |   |       |   |                                       |       
15 ]                            |   |   |       |   |        
16 ]                            |   |   |       |   |        
17 ]                PP21                                        
18 ]                                                0dG1    
19 ]
20 ]                0j21
21 ]
22 ]                <>G1
`
,
`
1  ]#rW3-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
2  ]|
3  ]|
4  ]|
5  ]|
6  ]|
7  ]|
8  ]|
9  ]|
10 ]|
11 ]|
12 ]
13 ]                            #r0F#r0E-.-.-.-.-.-.#r0F-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
14 ]                            |   |               |
15 ]                            |   |               |
16 ]                            |   |               |
17 ]                            |   |               |
18 ]                            |   |               |
19 ]                            |   |               |
20 ]                            |   |               |
21 ]                            |   |               |
22 ]                            |   |               |
23 ]                            |   |               |
24 ]                            |   #W0F-.-.-.-.-.-.|
25 ]                                #n02-.-.-.-.-.-.#r01-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.#r0F-.-.-.-.-.-.
26 ]                                |               |                                   |
27 ]                                |               |                                   |
28 ]                                |               |                                   |
`
,
`
1  ]'a0M-.-.-.-.
2  ]|
3  ]|
`
         ]
      })
   }

}