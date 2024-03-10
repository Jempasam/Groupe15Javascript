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
import { GameHeader } from "../../samlib/gui/GameHeader.mjs"
import { PistonItem } from "./items/PistonItem.mjs"

/* Get Host and create Menu */
let host=document.getElementById("host")
if(!host)throw new Error("No host")
host.innerHTML=""

/* Create Header */
let header=new GameHeader()
host.appendChild(header)
host.appendChild(create("div"))

function openMenu(){
    let menu=new GameMenu()
    host.removeChild(host.lastChild)
    host.appendChild(menu)
    header.onback=undefined
    header.onhome=undefined

    menu.onplay= ()=> openLoader()
    menu.actions={
        "Editor": ()=> openEditor(),
        "Test": ()=> test()
    }
}

function openEditor(){
    let editor=new Editor()
    host.removeChild(host.lastChild)
    host.appendChild(editor)
    header.onback= ()=>openMenu()
    header.onhome= ()=>openMenu()

    editor.spawnables=BASE_COLLECTION
}

function openLoader(){
    let loader=new Loader()
    host.removeChild(host.lastChild)
    host.appendChild(loader)
    header.onback= ()=>openMenu()
    header.onhome= ()=>openMenu()

    loader.spawnables=BASE_COLLECTION
    loader.onplay= field=>play(field)
}

function playGame(onback, callback){
    let game=new Puissance4()
    host.removeChild(host.lastChild)
    host.appendChild(game)
    let stopper= {val:true}
    header.onback= ()=>{
        stopper.val=false
        onback()
    }
    header.onhome= ()=>{
        stopper.val=false
        openMenu()
    }
    callback(game)
    setTimeout(function ticker(){
        game.ticks.tick(game)
        if(stopper.val)setTimeout(ticker,50)
        console.log(">>")
    },50)
}

/**
 * 
 * @param {Puissance4Field} field 
 */
function play(field){
    playGame(
        ()=>openLoader(),
        game=>{
            game.width=field.content.width
            game.height=field.content.height
            field.load(game)
        }
    )
}

function test(){
    playGame(
        ()=>openMenu(),
        game=>{
            game.width=10
            game.height=10

            game.set(6,1,new MovingItem(new StaticCoinItem("red"),0,1))
            game.set(5,8,new PistonItem(1,0))
        }
    )
}


openMenu()