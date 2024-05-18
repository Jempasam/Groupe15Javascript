import { Vector3 } from "../../../../../babylonjs/core/index";
import { ModelKey } from "../world/ModelHolder.mjs";


export class PathModel{
    
    /**
     * @param {Vector3} minimum
     * @param {Vector3} maximum
     * @param {boolean[][][]} content
     */
    constructor(minimum,maximum,content){
        this.minimum=minimum
        this.maximum=maximum
        this.content=content
    }


}

/** @type {ModelKey<PathModel>} */
export const PATH=new ModelKey("path")