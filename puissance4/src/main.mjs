import { Field } from "./field/Field.mjs"
import { Item } from "./field/Item.mjs"
import { BrokablePlatformItem } from "./items/BrokablePlatformItem.mjs"
import { FallingCoinItem } from "./items/FallingCoinItem.mjs"
import { PlatformItem } from "./items/PlatformItem.mjs"
import { PlayerItem } from "./items/PlayerItem.mjs"
import { RollerItem } from "./items/RollerItem.mjs"
import { WindItem } from "./items/WindItem.mjs"

let target=document.getElementById("target")
if(!target)throw new Error("No target")

let field=new Field(target, 14, 14)

let simple=(team)=>new FallingCoinItem(team)

field.set(0,0,new FallingCoinItem("red"))
field.set(1,0,new FallingCoinItem("red"))
field.set(2,0,new FallingCoinItem("red"))
field.set(3,0,new FallingCoinItem("red"))
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
},50)