import { Bound } from "./Bound.mjs";

/**
 * A sphere shad bound.
 * @inheritdoc
 */
export class SphereBound extends Bound{

    /**
     * @inheritdoc
     * @param {[number,number,number]} direction
     * @returns {[number,number,number]}
     */
    getNearestPoint(direction){
        let distance=Math.sqrt(direction[0]**2 + direction[1]**2 + direction[2]**2);
        return [direction[0]/distance, direction[1]/distance, direction[2]/distance];
    }

    /**
     * @inheritdoc
     * @param {[number,number,number]} direction
     * @returns {[number,number,number]}
     */
    getNormal(direction){
        return this.getNearestPoint(direction);
    }
    
}