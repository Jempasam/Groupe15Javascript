import { Editor, EditorSpawnable, Puissance4Field } from "./editor/Editor.mjs"
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
import { GameMenu } from "../../samlib/gui/GameMenu.mjs"
import { create, html } from "../../samlib/DOM.mjs"
import { FileMenu } from "./editor/FileMenu.mjs"
import { Loader } from "./editor/Loader.mjs"

/* Get Host and create Menu */
let host=document.getElementById("host")
if(!host)throw new Error("No host")

function openMenu(){
    host.innerHTML=html`<sam-gamemenu title="Puissance 4"/>`

    let menu=document.querySelector("sam-gamemenu")
    if(!(menu instanceof GameMenu))throw new Error("No menu")

    menu.onplay= ()=> openLoader()
    menu.actions={
        "Editor": ()=> openEditor()
    }
}

function openEditor(){
    host.innerHTML=html`<puissance-4-editor/>`
    let editor=document.querySelector("puissance-4-editor")
    if(!(editor instanceof Editor))throw new Error("No editor")
    editor.spawnables=BASE_COLLECTION
}

function openLoader(){
    host.innerHTML=""
    let loader=new Loader()
    loader.spawnables=BASE_COLLECTION
    loader.onplay= field=>play(field)
    host?.appendChild(loader)
}

/**
 * 
 * @param {Puissance4Field} field 
 */
function play(field){
    host.innerHTML=""
    let game=new Puissance4()
    host.appendChild(game)
    game.width=field.content.width
    game.height=field.content.height
    field.load(game)
    setInterval(()=>{
        console.log(game.ticks)
        game.ticks.tick(game)
    },50)
}


openMenu()