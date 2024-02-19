import BabylonJSDTarget from "./display/BabylonJSDTarget.mjs";
import CanvasDTarget from "./display/CanvasDTarget.mjs";
import { DShape, DShapeDef } from "./display/Display.mjs";
import { Plugin, tickWorld } from "./object/plugin/Plugin.mjs";
import { PlatformerPlugin } from "./plugins/PlatformerPlugin.mjs";
import { Puissance4Plugin } from "./plugins/Puissance4Plugin.mjs";
import { TestPlugin } from "./plugins/TestPlugin.mjs";



/** @type {Object.<string,{plugin:Plugin,isSelected:boolean}>} */
let plugins={
    test: {plugin: new TestPlugin(), isSelected: false},
    platformer: {plugin: new PlatformerPlugin(), isSelected: false},
    puissance4: {plugin: new Puissance4Plugin(), isSelected: true},
}

// Get Display
const canvas = document.getElementById("target")
if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
//const target=new CanvasDTarget(canvas)
const target=new BabylonJSDTarget(canvas, 0,0,0, 0,0,0, 100,100,100)
target.scale(1,-1,1)
target.move(0,-1,0)

// Selector
const selector = document.getElementById("selector")
if(selector===null)throw new Error("Selector not found")
if(!(selector instanceof HTMLSelectElement))throw new Error("Selector is not a select element")
for(let key in plugins){
    let option = document.createElement("option")
    option.value=key
    option.text=key
    option.selected=plugins[key].isSelected
    selector.appendChild(option)
}

// Add Button
let previous_loop
const start=document.getElementById("start")
if(start===null)throw new Error("Add button not found")
start.onclick=()=>{
    // Get plugins
    let plugin_list=[]
    for(let option of selector.selectedOptions){
        let key=option.value
        let plugin=plugins[key].plugin
        if(plugin===undefined)throw new Error("Plugin not found")
        plugin_list.push(plugin)
    }

    // Stop le monde precedent
    if(previous_loop)previous_loop.stop()

    // Initialisation du monde
    previous_loop=tickWorld(canvas, target, plugin_list, 30)
}

start.click()
