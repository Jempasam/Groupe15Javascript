import { Editor, EditorSpawnable, Puissance4Field } from "./editor/Editor.mjs"
import { Puissance4 } from "./field/Puissance4.mjs"
import { SamSelector, SamOption } from "../../samlib/gui/Selector.mjs"
import { Item } from "./field/Item.mjs"
import { BrokablePlatformItem } from "./items/BrokablePlatformItem.mjs"
import { MovingItem } from "./items/MovingItem.mjs"
import { PlatformItem } from "./items/PlatformItem.mjs"
import { PlayerItem } from "./items/PlayerItem.mjs"
import { RollerItem } from "./items/RollerItem.mjs"
import { CoinItem } from "./items/CoinItem.mjs"
import { WindItem } from "./items/WindItem.mjs"
import { BASE_COLLECTION } from "./field/collection/base_collection.mjs"
import { GameMenu } from "../../samlib/gui/GameMenu.mjs"
import { create, dom, html } from "../../samlib/DOM.mjs"
import { FileMenu } from "./editor/FileMenu.mjs"
import { Loader } from "./editor/Loader.mjs"
import { GameHeader } from "../../samlib/gui/GameHeader.mjs"
import { PistonItem } from "./items/PistonItem.mjs"
import { SlippyItem } from "./items/SlippyItem.mjs"
import { PipeItem } from "./items/PipeItem.mjs"
import { Shop, ShopData } from "../../samlib/gui/Shop.mjs"
import { ACCOUNT_STORAGE, LOCAL_STORAGE } from "../../samlib/Storage.mjs"
import { NumberInput } from "../../samlib/gui/NumberInput.mjs"
import { SnakeItem } from "./items/SnakeItem.mjs"
import { SpawnerItem } from "./items/SpawnerItem.mjs"
import { GoombaItem } from "./items/GoombaItem.mjs"
import { FruitItem } from "./items/FruitITem.mjs"

/* SETTINGS */
let USED_STORAGE=ACCOUNT_STORAGE

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
    menu.title="Puissance 4"
    host.removeChild(host.lastChild)
    host.appendChild(menu)
    header.onback=undefined
    header.onhome=undefined

    menu.onplay= ()=> openLoader()
    menu.onshop= ()=>openShop()
    menu.actions={
        "Editor": ()=> openEditor(),
        "Test": ()=> test(),
        "Reset": ()=>{
            let shopdata=ShopData.get(USED_STORAGE,"test")
            shopdata.money=100
            shopdata.buyeds.clear()
            ShopData.set(shopdata)
        },
        "God": ()=>{
            let shopdata=ShopData.get(USED_STORAGE,"test")
            shopdata.money=100000
            for(let a in BASE_COLLECTION)shopdata.buyeds.add(a)
            ShopData.set(shopdata)
        }
    }
}

function openEditor(){
    let editor=new Editor()
    editor.storage=USED_STORAGE
    host.removeChild(host.lastChild)
    host.appendChild(editor)
    header.onback= ()=>openMenu()
    header.onhome= ()=>openMenu()

    let disponible={}
    for(let [key,spawnable] of Object.entries(BASE_COLLECTION)){
        if(ShopData.get(USED_STORAGE,"test").isBuyed(key))disponible[key]=spawnable
    }
    editor.collection=BASE_COLLECTION
    editor.spawnables=disponible
}

function openLoader(){
    let loader=new Loader()
    loader.storage=USED_STORAGE
    host.removeChild(host.lastChild)
    host.appendChild(loader)
    header.onback= ()=>openMenu()
    header.onhome= ()=>openMenu()

    loader.spawnables=BASE_COLLECTION
    loader.onplay= field=>play(field)
}

function openShop(){
    let shop=new Shop(id=>{
        let ret=create("div.presentation")
        let field=new Puissance4()
        field.width=1
        field.height=1
        field.set(0,0,BASE_COLLECTION[id].factory())
        ret.appendChild(field)
        return ret
    })
    shop.storage=USED_STORAGE
    shop.title="Shop"
    shop.shop_content=BASE_COLLECTION
    shop.shop_id="test"
    host.removeChild(host.lastChild)
    host.appendChild(shop)
    header.onback= ()=>openMenu()
    header.onhome= ()=>openMenu()

}

function playGame(onback, callback){
    let game=new Puissance4()
    game.className="_scrollable"
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
            game.set(3,7,new SnakeItem(new CoinItem("red"),0,-1))
            game.set(2,5,new GoombaItem(new FruitItem()))
        }
    )
}

openMenu()