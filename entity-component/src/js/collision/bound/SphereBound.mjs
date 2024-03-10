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
        const dx=direction[0]-0.5;
        const dy=direction[1]-0.5;
        const dz=direction[2]-0.5;
        let distance=Math.sqrt(dx**2 + dy**2 + dz**2)*2;
        return [dx/distance+.5, dy/distance+.5, dz/distance+.5];
    }

    /**
     * @inheritdoc
     * @param {[number,number,number]} direction
     * @returns {[number,number,number]}
     */
    getNormal(direction){
        const dx=direction[0]-0.5;
        const dy=direction[1]-0.5;
        const dz=direction[2]-0.5;
        let distance=Math.sqrt(dx**2 + dy**2 + dz**2)*2;
        return [dx/distance, dy/distance, dz/distance];
    }
    
}

export const SPHERE_BOUND=new SphereBound();