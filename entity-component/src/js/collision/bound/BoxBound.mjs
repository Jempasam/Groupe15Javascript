import { Bound } from "./Bound.mjs";

/**
 * A sphere shad bound.
 * @inheritdoc
 */
export class BoxBound extends Bound{

    /**
     * @inheritdoc
     * @param {[number,number,number]} point
     * @returns {[number,number,number]}
     */
    getNearestPoint(point){
        let ox=Math.abs(point[0]);
        let oy=Math.abs(point[1]);
        let oz=Math.abs(point[2]);
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
        return [point[0]*multiplier, point[1]*multiplier, point[2]*multiplier];
    }

    /**
     * @inheritdoc
     * @param {[number,number,number]} point
     * @returns {[number,number,number]}
     */
    getNormal(point){
        let ox=Math.abs(point[0]);
        let oy=Math.abs(point[1]);
        let oz=Math.abs(point[2]);
        if(ox>oy){
            if(ox>oz){
                return [Math.sign(point[0]), 0, 0];
            }else{
                return [0, 0, Math.sign(point[2])];
            }
        }
        else{
            if(oy>oz){
                return [0, Math.sign(point[1]), 0];
            }else{
                return [0, 0, Math.sign(point[2])];
            }
        }
    }

}