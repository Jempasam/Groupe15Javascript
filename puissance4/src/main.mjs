import { Editor, EditorSpawnable } from "./editor/Editor.mjs"
import { Puissance4 } from "./field/Puissance4.mjs"
import { SamSelector, SamOption } from "../../samlib/gui/Selector.mjs"
import { Item } from "./field/Item.mjs"
import { BrokablePlatformItem } from "./items/BrokablePlatformItem.mjs"
import { MovingItem } from "./items/MovingItem.mjs"
import { PlatformItem } from "./items/PlatformItem.mjs"
import { PlayerItem } from "./items/PlayerItem.mjs"
import { RollerItem } from "./items/RollerItem.mjs"
import { StaticCoinItem } from "./items/StaticCoinItem.mjs"
import { WindItem } from "./items/WindItem.mjs"
import { BASE_COLLECTION } from "./field/collection/base_collection.mjs"

let editor=document.querySelector("puissance-4-editor")
if(!(editor instanceof Editor))throw new Error("No editor")
editor.spawnables=BASE_COLLECTION
//let target=document.getElementById("target")
//if(!target)throw new Error("No target")
//new Editor(target)

/*let field=new Field(target, 14, 14)

let simple=(team)=>new MovingItem(new StaticCoinItem(team),0,1)

field.set(4,0,new PlayerItem("red",simple,"KeyA","KeyD","KeyS"))
field.set(7,0,new PlayerItem("blue",simple,"KeyU","KeyO","KeyI"))
field.set(2,9,new WindItem())

for(let i=0; i<5; i++){
    field.set(i+6,8,new BrokablePlatformItem())
}


for(let i=0; i<3; i++){
    field.set(i+9,5,new RollerItem(-1))
}

setInterval(()=>{
    field.ticks.tick(field)
},50)*/

/** EDITOR */
/** */

