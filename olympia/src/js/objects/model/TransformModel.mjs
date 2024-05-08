import { Color3, MeshBuilder, Vector3 } from "../../../../../babylonjs/index.js";
import { ModelKey } from "../world/GameObject.mjs";
import { World } from "../world/World.mjs";

export class TransformModel{
    
    constructor({position=new Vector3(0,0,0), rotation=new Vector3(0,0,0), scale=new Vector3(1,1,1)}){
        this._position=position
        this._rotation=rotation
        this._scale=scale
    }

    get position(){return this._position}
    get rotation(){return this._rotation}
    get scale(){return this._scale}

    static ZERO=new TransformModel({position:new Vector3(0,0,0), rotation:new Vector3(0,0,0), scale:new Vector3(1,1,1)})
}

/** @type {ModelKey<TransformModel>} */
export const TRANSFORM=new ModelKey("transform")