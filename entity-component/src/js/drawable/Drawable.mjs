export class Drawable{
    /**
     * Draw an image on the well drawable
     * @param {CanvasImageSource} image
     */
    draw(image){
        throw new Error("Undefined method")
    }

    /**
     * Fill the drawable with a color
     * @param {[number,number,number,number]} color 
     */
    paint(color){
        throw new Error("Undefined method")
    }

    /**
     * Fill the drawable with a circle of a color
     * @param {[number,number,number,number]} color
     */
    paintCircle(color){
        throw new Error("Undefined method")
    }

    /**
     * Reset the drawable.
     * Have to be called after each frames for optimization reason.
     */
    clear(){
        throw new Error("Undefined method")
    }

    /**
     * Create a sub drawable on a portion of the drawable
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @returns {Drawable}
     */
    sub(x,y,z,width,height,depth){
        throw new Error("Undefined method")
    }

    /**
     * @returns {number}
     */
    get width(){
        throw new Error("Undefined method")
    }

    /**
     * @returns {number}
     */
    get height(){
        throw new Error("Undefined method")
    }

    /**
     * @returns {number}
     */
    get depth(){
        throw new Error("Undefined method")
    }
}