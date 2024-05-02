import {Puissance4} from "../../puissance4/src/field/Puissance4.mjs"
import { Puissance4Game } from "../../puissance4/src/game.mjs"
import { BocalItem } from "../../puissance4/src/items/BocalItem.mjs"
import { BrokablePlatformItem } from "../../puissance4/src/items/BrokablePlatformItem.mjs"
import { BubbleItem } from "../../puissance4/src/items/BubbleItem.mjs"
import { FruitItem } from "../../puissance4/src/items/FruitItem.mjs"
import { GoombaItem } from "../../puissance4/src/items/GoombaItem.mjs"
import { LinkItem } from "../../puissance4/src/items/LinkItem.mjs"
import { LynelItem } from "../../puissance4/src/items/LynelItem.mjs"
import { MasterhandItem } from "../../puissance4/src/items/MasterhandItem.mjs"
import { MeteorItem } from "../../puissance4/src/items/MeteorItem.mjs"
import { SnakeItem } from "../../puissance4/src/items/SnakeItem.mjs"
import { SpawnerItem } from "../../puissance4/src/items/SpawnerItem.mjs"
import { TNTItem } from "../../puissance4/src/items/TNTItem.mjs"
import { ACCOUNT_STORAGE } from "../../samlib/Storage.mjs"
import { observers } from "../../samlib/observers/ObserverGroup.mjs"
import { achievement_registry } from "./achievement_list.mjs"

let host=document.getElementById("host")
if(!host)throw new Error("No host")

let game=new Puissance4Game(host)
game.on_start_game=function(field){

    // Les observers des achievements
    observers(field,"on_alignement").add("achievements",(aligneds)=>{
        console.log("aligneds", aligneds)
        if(aligneds.length>=4){
            achievement_registry.edit("puissance4", "row", v=>v+1)
            achievement_registry.edit("puissance4", "50row", v=>v+1)
            let team=field.get(aligneds[0][0],aligneds[0][1]).team
            console.log("team", team)
            if(team=="green")achievement_registry.edit("puissance4", "green", v=>v+1)
        }
        if(aligneds.length>=5){
            achievement_registry.edit("puissance4", "row5", v=>v+1)
            achievement_registry.edit("puissance4", "50row5", v=>v+1)
        }
        let pos=aligneds[0]
        
        let under=field.get(pos[0],pos[1]+1)
        if(under instanceof BubbleItem){
            achievement_registry.edit("puissance4", "coolbubble", v=>v+1)
        }
    })

    observers(field,"on_broken").add("achievements",(obj,x,y)=>{
        if(obj instanceof BocalItem){
            achievement_registry.edit("puissance4", "10bocal", v=>v+1)
            achievement_registry.edit("puissance4", "100bocal", v=>v+1)
        }
        if(obj instanceof BrokablePlatformItem){
            achievement_registry.edit("puissance4", "miner", v=>v+1)
        }
    })

    observers(field,"on_eat").add("achievements",(obj,eaten,x,y)=>{
        if(eaten instanceof FruitItem){
            achievement_registry.edit("puissance4", "apple1", v=>v+1)
            achievement_registry.edit("puissance4", "apple50", v=>v+1)
            achievement_registry.edit("puissance4", "apple300", v=>v+1)
        }
        if(obj instanceof SnakeItem){
            achievement_registry.edit("puissance4", "snake", v=>Math.max(v,obj.length))
        }
    })

    observers(field,"on_destroy").add("achievements",(obj, x, y, destroyed, dx, dy)=>{
        if(obj instanceof TNTItem){
            achievement_registry.edit("puissance4", "20boom", v=>v+1)
            achievement_registry.edit("puissance4", "200boom", v=>v+1)
        }
        if(obj instanceof MeteorItem && destroyed instanceof GoombaItem){
            achievement_registry.edit("puissance4", "goomboom", v=>v+1)
        }
    })

    observers(field,"on_crushed").add("achievements",(crusheds)=>{
        achievement_registry.edit("puissance4", "crush", v=>Math.max(v,crusheds.length))
        achievement_registry.edit("puissance4", "crush30", v=>Math.max(v,crusheds.length))
    })

    observers(field,"on_grab").add("achievements",(obj,x,y,previous,grabbed,gx,gy)=>{
        if(obj instanceof LynelItem && grabbed instanceof LinkItem){
            achievement_registry.edit("puissance4", "kidnap", v=>v+1)
        }
    })

    observers(field,"on_attack").add("achievements",(obj,x,y,attacked,ax,ay)=>{
        if(obj instanceof LinkItem && attacked instanceof LinkItem){
            achievement_registry.edit("puissance4", "fratricide", v=>v+1)
        }
    })

    observers(field,"on_summon").add("achievements",(obj,x,y,summoned,sx,sy)=>{
        if(obj instanceof MasterhandItem && summoned instanceof MasterhandItem){
            achievement_registry.edit("puissance4", "masterhand", v=>v+1)
        }
        if(obj instanceof SpawnerItem){
            achievement_registry.edit("puissance4", "spawner", v=>v+1)
        }
    })

}