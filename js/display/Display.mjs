

/**
 * A target for display. You draw on a target.
 */
export class DTarget{

    /**
     * Move the display target in part of the width, height and depth of the display.
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    move(x,y,z){
        throw new Error("Undefined method")
    }

    /**
     * Rotate the display target in radian
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    rotate(x,y,z){
        throw new Error("Undefined method")
    }

    /**
     * Rotate the display target around a specified point in radian
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} centerZ 
     */
    rotateAround(x, y, z, centerX, centerY, centerZ) {
        throw new Error("Undefined method");
    }

    /**
     * Scale the display target, in part of the current scale
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    scale(x,y,z){
        throw new Error("Undefined method")
    }

    /**
     * Scale the display target around a specified point, in part of the current scale
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} centerZ 
     */
    scaleAround(x, y, z, centerX, centerY, centerZ) {
        throw new Error("Undefined method");
    }

    /**
     * Draw an object on the display target
     * @param {DShape} object 
     */
    draw(object){
        throw new Error("Undefined method")
    }

    /**
     * Should be called before each frame
     */
    start(){
        throw new Error("Undefined method")
    }
    
    /**
     * Should be called after each frame
     */
    end(){
        throw new Error("Undefined method")
    }

    /**
     * Create a clone of the display target with same position, scale and rotation, without the stack
     * @returns {DTarget}
     */
    clone(){
        throw new Error("Undefined method")
    }

    /**
     * Save the current state of the display target
     */
    push(){
        throw new Error("Undefined method")
    }

    /**
     * Restore the last saved state of the display target
     */
    pop(){
        throw new Error("Undefined method")
    }
}

/* A display  */
/**
 * @typedef {[number,number,number]} DColor
 */

/**
 * @enum {number}
 */
export const DShapeDef={
    SPHERE: 0,
    BOX: 1
}

export class DShape{

    /**
     * Get a default display color, if the display object have no
     * specific display.
     * @returns {DColor}
     */
    defaultColor(){
        throw new Error("Undefined method")
    }
    
    /**
     * Get a default display shape, if the display object have no
     * specific display.
     * @returns {DShapeDef}
     */
    defaultShape(){
        throw new Error("Undefined method")
    }

    /**
     * A unique id for each DShape
     * @returns {number}
     */
    get id(){
        throw new Error("Undefined method")
    }
}