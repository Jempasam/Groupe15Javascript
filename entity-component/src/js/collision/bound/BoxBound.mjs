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
        let px=point[0];
        let py=point[1];
        let pz=point[2];
        if(px>1) px=1;
        if(px<0) px=0;
        if(py>1) py=1;
        if(py<0) py=0;
        if(pz>1) pz=1;
        if(pz<0) pz=0;
        px-=.5;
        py-=.5;
        pz-=.5;
        const ox=Math.abs(px);
        const oy=Math.abs(py);
        const oz=Math.abs(pz);
        let multiplier
        if(ox>oy){
            if(ox>oz){
                multiplier=.5/ox;
            }else{
                multiplier=.5/oz;
            }
        }
        else{
            if(oy>oz){
                multiplier=.5/oy;
            }else{
                multiplier=.5/oz;
            }
        }
        const fx=px*multiplier+.5
        const fy=py*multiplier+.5
        const fz=pz*multiplier+.5
        return [fx,fy,fz];
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

export const BOX_BOUND=new BoxBound();