import { doCollide } from "./collision/bound/Bound.mjs";
import { BOX_BOUND } from "./collision/bound/BoxBound.mjs";
import { SPHERE_BOUND } from "./collision/bound/SphereBound.mjs";
import BabylonJSDTarget from "./display/BabylonJSDTarget.mjs";
import CanvasDTarget from "./display/CanvasDTarget.mjs";
import { DShape, DShapeDef } from "./display/Display.mjs";
import { Plugin, tickWorld } from "./object/plugin/Plugin.mjs";
import { PlatformerPlugin } from "./plugins/PlatformerPlugin.mjs";
import { Puissance4Plugin } from "./plugins/Puissance4Plugin.mjs";
import { TestPlugin } from "./plugins/TestPlugin.mjs";
import { Transform } from "./transform/Transform.mjs";





/** @type {Object.<string,{plugin:Plugin,isSelected:boolean}>} */
let plugins={
    test: {plugin: new TestPlugin(), isSelected: false},
    platformer: {plugin: new PlatformerPlugin(), isSelected: false},
    puissance4: {plugin: new Puissance4Plugin(), isSelected: true},
}

// Get Display
const canvas = document.getElementById("target")
if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
let transform=new Transform(0,0,0, 0,0,0, 100,100,100)
transform.scale(1,1,1)
const target=new CanvasDTarget(canvas)
//const target=new BabylonJSDTarget(canvas, transform)


/** @type {DShape} */
let red={
    id: 0,
    defaultShape: () => DShapeDef.BOX,
    defaultColor: () => [255,0,0],
}
/** @type {DShape} */
let blue={
    id: 1,
    defaultShape: () => DShapeDef.BOX,
    defaultColor: () => [0,0,255],
}
/** @type {DShape} */
let blue_circle={
    id: 1002,
    defaultShape: () => DShapeDef.SPHERE,
    defaultColor: () => [0,0,255],
}
/** @type {DShape} */
let green={
    id: 2,
    defaultShape: () => DShapeDef.BOX,
    defaultColor: () => [0,255,0],
}

/** @type {DShape} */
let yellow={
    id: 3,
    defaultShape: () => DShapeDef.BOX,
    defaultColor: () => [255,255,0],
}

/** @type {DShape} */
let gray={
    id: 4,
    defaultShape: () => DShapeDef.BOX,
    defaultColor: () => [128,128,128],
}

/** @type {DShape} */
let purple={
    id: 4,
    defaultShape: () => DShapeDef.SPHERE,
    defaultColor: () => [128,0,128]
}


let point=[0.8,0.5,0]
let pt1
let pt2
let view=new Transform(0,0,0, 0,0,0, 1,1,1)
let first=new Transform(0.1,0.1,0.1, 0,0,0, 0.3,0.3,0.3)
let second=new Transform(0.5,0.5,0, 0,0,0, 0.5,0.5,0.5)

document.onkeydown=(e)=>{
    e.preventDefault()
    if(e.code=="KeyW")view.move(0,0.01,0)
    if(e.code=="KeyS")view.move(0,-0.01,0)
    if(e.code=="KeyA")view.move(-0.01,0,0)
    if(e.code=="KeyD")view.move(0.01,0,0)
    if(e.code=="KeyQ")view.rotate(0,0,0.01)
    if(e.code=="KeyE")view.rotate(0,0,-0.01)
    if(e.code=="KeyZ")view.scaleAround(1.01,1.01,1.01, 0.5,0.5,0.5)
    if(e.code=="KeyX")view.scaleAround(0.99,0.99,0.99, 0.5,0.5,0.5)

    if(e.code=="ArrowUp")second.move(0,0.01,0)
    if(e.code=="ArrowDown")second.move(0,-0.01,0)
    if(e.code=="ArrowLeft")second.move(-0.01,0,0)
    if(e.code=="ArrowRight")second.move(0.01,0,0)
    if(e.code=="KeyP")second.rotate(0,0,0.01)
}

setInterval((e)=>{
    target.start()
    target.push()
    target.transform.compose(view)
    target.draw(gray)

    let draw_rect=(transform,style)=>{
        target.push()
        target.transform.compose(transform)
        target.draw(style)
        target.pop()
    }

    let draw_point=(point,style)=>{
        target.push()
        target.transform.compose(new Transform(point[0]-0.01,point[1]-0.01,point[2]-0.01, 0,0,0, 0.02,0.02,0.02))
        target.draw(style)
        target.pop()
    }

    draw_point(point, red)

    draw_rect(first, green)
    draw_rect(second, blue)

    // Test hitbox
    {
        point[2]=0.5
        let border=SPHERE_BOUND.getNearestPoint(point)
        draw_point(border, purple)
    }


    let offset=first.clone()
    offset.inverse()
    offset.compose(second)
    let result=doCollide(BOX_BOUND,offset,BOX_BOUND)

    if(result){
        pt1=result[0]
        pt2=result[1]
        console.log(pt1,pt2)
        first.apply(pt1)
        first.apply(pt2)
        first.apply(result[2])
        console.log(pt1,pt2)
        draw_point(pt1, yellow)
        draw_point(pt2, red)
        draw_point(result[2], red)
    }

    target.pop()
    target.end()
}, 100)

document.onmousemove=(e)=>{
    let rect = canvas.getBoundingClientRect()
    point[0]=(e.clientX-rect.left)/rect.width
    point[1]=1-(e.clientY-rect.top)/rect.height
    let tr=view.clone()
    tr.inverse()
    tr.apply(point)
}
window.stop()

/**

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

*/