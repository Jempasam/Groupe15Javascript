import { Transform } from "../transform/Transform.mjs";


/**
 * A target for display. You draw on a target.
 */
export class DTarget{

    /**
     * Get the transformation of the display target
     * @returns {Transform}
     */
    get transform(){
        throw new Error("Undefined method")
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