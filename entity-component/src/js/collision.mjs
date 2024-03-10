import { collide, doCollide } from "./collision/bound/Bound.mjs";
import { BOX_BOUND } from "./collision/bound/BoxBound.mjs";
import { SPHERE_BOUND } from "./collision/bound/SphereBound.mjs";
import BabylonJSDTarget from "./display/BabylonJSDTarget.mjs";
import CanvasDTarget from "./display/CanvasDTarget.mjs";
import { DShape, DShapeDef } from "./display/Display.mjs";
import { Transform } from "./transform/Transform.mjs";

// Get Display
const canvas = document.getElementById("target")
if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
let transform=new Transform(0,0,0, 0,0,0, 100,100,100)
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


let point=[0.8,0.5,-0.1]
let pt1
let pt2
let view=new Transform(0,0,0, 0,0,0, 1,1,1)
let first=new Transform(0.1,0.1,0.1, 0,0,0, 0.3,0.3,0.3)
let second=new Transform(0.5,0.5,0, 0,0,0, 0.5,0.5,0.5)
let third=new Transform(0.5,0,0, 0,0,0, 0.5,0.5,0.5)

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

    let target
    if(e.shiftKey)target=third
    else target=second
    if(e.code=="ArrowUp")target.move(0,0.01,0)
    if(e.code=="ArrowDown")target.move(0,-0.01,0)
    if(e.code=="ArrowLeft")target.move(-0.01,0,0)
    if(e.code=="ArrowRight")target.move(0.01,0,0)
    if(e.code=="KeyP")target.rotate(0,0,0.01)
    if(e.code=="KeyO")target.rotate(0,0,-0.01)
    if(e.code=="KeyL")target.scaleAround(1.01,1,1, 0.5,0.5,0.5)
    if(e.code=="KeyK")target.scaleAround(0.99,1,1, 0.5,0.5,0.5)
    if(e.code=="KeyM")target.scaleAround(1,1.01,1, 0.5,0.5,0.5)
    if(e.code=="KeyN")target.scaleAround(1,0.99,1, 0.5,0.5,0.5)
}

setInterval((e)=>{
    target.start()

    target.push()
    target.transform.compose(view)

    {
        target.push()
        target.transform.scale(1,1,0.01)
        target.transform.move(0,0,100)
        target.draw(gray)
        target.pop()
    }

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
    draw_rect(second, blue_circle)
    draw_rect(third, blue)

    // Test hitbox
    {
        point[2]=0.5
        let border=SPHERE_BOUND.getNearestPoint(point)
        let normal=SPHERE_BOUND.getNormal(border)
        draw_point(border, purple)
        draw_point([border[0]-normal[0]/10, border[1]-normal[1]/10, border[2]-normal[2]/10], purple)
    }


    let drawCollision=(a,b,bounda,boundb)=>{
        let offset=a.clone()
        offset.inverse()
        offset.compose(b)
        let result=collide(bounda,offset,boundb)

        if(result){
            pt1=result[0]
            let n1=result[2]
            let pt1n=[pt1[0]+n1[0], pt1[1]+n1[1], pt1[2]+n1[2]]

            pt2=result[1]
            let n2=result[3]
            let pt2n=[pt2[0]+n2[0], pt2[1]+n2[1], pt2[2]+n2[2]]

            first.apply(pt1)
            first.apply(pt2)
            first.apply(pt1n)
            first.apply(pt2n)
            draw_point(pt1, yellow)
            draw_point(pt2, red)

            draw_point(pt1n, yellow)
            draw_point(pt2n, red)
        }
    }
    drawCollision(first, second, BOX_BOUND, SPHERE_BOUND)
    drawCollision(first, third, BOX_BOUND, BOX_BOUND)
    
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