import { createLevel } from "../../objects/world/WorldUtils.mjs";
import { message } from "../../script.js";
import { BaseLevel } from "../BaseLevel.mjs";
import { LIVE_EDITOR_SETTINGS } from "../LiveEditor.mjs";
import { BasicPack } from "../objectpacks/BasicPack.mjs";

export class PandaPlane extends BaseLevel{

   /** @override @type {BaseLevel['start']} */
   start(context, world,options){
      const pack=new BasicPack(world)
      super.init(world,pack)
      
      message.send("Je risque pas de tomber sur un panda dans un endroit pareil!",6000,"info")
      
      createLevel({
         ...LIVE_EDITOR_SETTINGS,
         world,
         objects: pack.objects,
         maps: [
`
1  ]
2  ]
3  ]
4  ]
5  ]            #m07-.-.-.-.-.-.-
6  ]            |                                                                               #m34-.-.-.-.-.-.-.-.-.-.-.
7  ]            |                                               #m30-.-.o421-.  o221-.  o421-.  |                                   #m14-.-.-.-.-.-.-
8  ]            |                                               |       |       |       |       |                           #m24#m14|
9  ]            |                                               |                               |                           |   |   |
10 ]                #m06-.-.-.                                  |                               |                                   |
11 ]                #m05-.-.-.                                  |                               |                                   |
12 ]            #m04-.-.-.-.-.-.-.                          #m30-.-.-.-.-.-.-.-.-                                                   |                           #m64-.-
13 ]            |                                           |                                                   #m11-.-.-m11#m12#m13|                           |
14 ]            |                   >230                <230|                                                                                                   |
15 ]            |                   |                   |   |                                                                           >250                    |
16 ]            |                                           |                                                                               <250                |
17 ]                #m30-.-.-.                              |                                                                           >250                    |
18 ]                #m20-.-.-.                                                                                                              <250                |
19 ]                #m10-.-.-.                                                                                                          #m14-.-.-.-.-           #m54-.-
20 ]                                                                                                                                    |               #m24#m34#m44-.-
21 ]                                                                                                                                    |               |   |   |
22 ]                                                                                                                                    |
`
,
`
1  ]
2  ]
3  ]
4  ]
5  ]            PP81
6  ]                                                                                                      
7  ]                                                
8  ]            0a72                                                                                          
9  ]                                                
10 ]                                                                                                                                            
11 ]            <>K0                                            #w42-.-                                                                         +P60            ()94-.-
12 ]                            #w51
13 ]                            |                                                                               $h32
14 ]                            |                                               #q48                                                            
15 ]                            |                                           
16 ]                            |                                           +k40
17 ]
18 ]
19 ]                                                                                                                                            
20 ]                                                                                                                                    #p66
21 ]                                                                                                                                            
22 ]                                                                                                                                        +p60
`
,
`
1  ]#x00-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-
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
12 ]|
13 ]|
14 ]|
15 ]|
16 ]|
17 ]|
18 ]|
19 ]|
20 ]|
21 ]|
22 ]|
23 ]|
24 ]|
`
,
`
1  ]#v09----#v06#v09----        #v05#v08--------    #x24#m24--------
2  ]|_______    |_______            |               |__||
3  ]#v06            'f06--------    |___________        |___________
4  ]                |
5  ]#m05            |___________
6  ]|  |
7  ]|  |
8  ]|  |
9  ]|__|
`
         ]
      })
   }

}