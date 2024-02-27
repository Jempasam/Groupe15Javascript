import CanvasDTarget from "./display/CanvasDTarget.mjs";
import { Transform } from "./transform/Transform.mjs";

// Get Display
const canvas = document.getElementById("target")
if(!(canvas instanceof HTMLCanvasElement))throw new Error("Canvas not found")
let context=canvas.getContext("2d")
let x=canvas.width
let y=canvas.height
if(context==null)throw new Error("2D context not found")
context.fillStyle="red"

context.translate(0.25*x, 0*y)
context.scale(1, 1)
context.rotate(Math.PI/8)
context.fillRect(0, 0, 0.25*x, 0.25*x)
