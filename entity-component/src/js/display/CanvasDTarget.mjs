import { Transform } from "../transform/Transform.mjs";
import { BaseDTarget } from "./BaseDTarget.mjs";
import { DShape, DShapeDef } from "./Display.mjs";


/**
 * Represents a canvas display target for rendering objects.
 * @extends BaseDTarget
 */
export default class CanvasDTarget extends BaseDTarget {
    #ctx;

    constructor(ctx, transform) {
        if(!transform){
            transform=new Transform(
                0, 0, 0,
                0, 0, 0,
                ctx.width, ctx.height, 1
            )
        }
        super(transform);

        if(ctx instanceof HTMLCanvasElement){
            this.#ctx=ctx.getContext("2d")
            this.#ctx.transform(1, 0, 0, -1, 0, ctx.height)
        }
        else{
            this.#ctx=ctx
        }
    }

    /**
     * 
     * @param {DShape} object 
     */
    draw(object) {
        this.#ctx.save();
        this.#ctx.translate(this.transform.x, this.transform.y);

        this.#ctx.scale(this.transform.sx, this.transform.sy);

        //this.#ctx.translate(0.5, 0.5);
        this.#ctx.rotate(this.transform.rz);
        //this.#ctx.translate(-0.5, -0.5);

        if(object["drawOnCanvas"]){
            object["drawOnCanvas"](this.#ctx);
        }
        else{
            let color=object.defaultColor()
            let shape=object.defaultShape()
            this.#ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
            switch(shape){
                case DShapeDef.SPHERE:
                    this.#ctx.beginPath();
                    this.#ctx.arc(0.5, 0.5, 0.5, 0, Math.PI * 2, true);
                    this.#ctx.fill();
                    break;
                case DShapeDef.BOX:
                    this.#ctx.fillRect(0, 0, 1, 1);
                    break;
            }
        }
        this.#ctx.restore();
    }

    start(){
        this.#ctx.clearRect(0,0,this.#ctx.canvas.width,this.#ctx.canvas.height)
    }

    end(){
    }
    
    clone(){
        return new CanvasDTarget(this.#ctx, this.transform.clone());
    }
}