import { Bound } from "./Bound.mjs";

/**
 * A sphere shad bound.
 * @inheritdoc
 */
export class BoxBound extends Bound{

    /**
     * @inheritdoc
     * @param {[number,number,number]} direction
     * @returns {[number,number,number]}
     */
    getNearestPoint(direction){
        let ox=Math.abs(direction[0]);
        let oy=Math.abs(direction[1]);
        let oz=Math.abs(direction[2]);
        let multiplier
        if(ox>oy){
            if(ox>oz){
                multiplier=1/ox;
            }else{
                multiplier=1/oz;
            }
        }
        else{
            if(oy>oz){
                multiplier=1/oy;
            }else{
                multiplier=1/oz;
            }
        }
        return [direction[0]*multiplier, direction[1]*multiplier, direction[2]*multiplier];
    }

    /**
     * @inheritdoc
     * @param {[number,number,number]} direction
     * @returns {[number,number,number]}
     */
    getNormal(direction){
        let ox=Math.abs(direction[0]);
        let oy=Math.abs(direction[1]);
        let oz=Math.abs(direction[2]);
        if(ox>oy){
            if(ox>oz){
                return [Math.sign(direction[0]), 0, 0];
            }else{
                return [0, 0, Math.sign(direction[2])];
            }
        }
        else{
            if(oy>oz){
                return [0, Math.sign(direction[1]), 0];
            }else{
                return [0, 0, Math.sign(direction[2])];
            }
        }
    }

}