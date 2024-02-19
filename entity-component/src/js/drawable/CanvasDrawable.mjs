import { Drawable } from "./Drawable.mjs"
import { defined } from "../lang/Utils.mjs"

export class CanvasDrawable extends Drawable{

    /** @type {CanvasRenderingContext2D} */
    canvas

    /** @override */
    get width(){
        return this._width
    }

    /** @override */
    get height(){
        return this._height
    }

    /** @override */
    get depth(){
        return this._depth
    }

    /**
     * Create a drawable from a canvas
     * @param {CanvasRenderingContext2D|HTMLCanvasElement} canvas
     * @param {number=} [x]
     * @param {number=} [y]
     * @param {number=} [z]
     * @param {number=} [width]
     * @param {number=} [height]
     * @param {number=} [depth]
     */
    constructor(canvas, x, y, z, width, height, depth){
        super()
        defined(canvas)
        if(arguments.length == 1 && canvas instanceof HTMLCanvasElement){
            let context=canvas.getContext("2d")
            if(context==null)throw new Error("CanvasRenderingContext2D is null")
            this.canvas=context
            this.x=0
            this.y=0
            this.z=0
            this._width=canvas.width
            this._height=canvas.height
            this._depth=Math.min(this._width, this._height)
        }
        else if(canvas instanceof CanvasRenderingContext2D){
            this.canvas=defined(canvas)
            this.x=defined(x)
            this.y=defined(y)
            this.z=defined(z)
            this._width=defined(width)
            this._height=defined(height)
            this._depth=defined(depth)
        }
    }

    /**
     * @inheritDoc
     */
    draw(image){
        this.canvas.drawImage(image,this.x,this.y,this.width,this.height)
    }

    /**
     * @inheritDoc
     */
    paint(color){
        this.canvas.fillStyle=`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`
        this.canvas.fillRect(this.x,this.y,this.width,this.height)
    }

    /**
     * @inheritdoc
     */
    paintCircle(color) {
        this.canvas.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radiusX = this.width / 2;
        const radiusY = this.height / 2;
        const scaleX = 1;
        const scaleY = radiusY / radiusX;
        
        this.canvas.beginPath()
        this.canvas.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.canvas.fill()
    }

    /** @inheritdoc */
    clear(){
        this.canvas.clearRect(this.x,this.y,this.width,this.height)
    }


    
    /**
     * @inheritdoc
     */
    sub(x,y,z,width,height,depth){
        if(width>this.width-x)width=this.width-x
        if(height>this.height-y)height=this.height-y
        if(depth>this.depth-z)depth=this.depth-z
        if(x<0){
            width+=x
            x=0
        }
        if(y<0){
            height+=y
            y=0
        }
        if(z<0){
            depth+=z
            z=0
        }
        return new CanvasDrawable(this.canvas, this.x+x, this.y+y, this.z+z, width, height, depth)
    }
}