import { Mesh } from "../../../../../babylonjs/core/index.js";
import { Scene } from "../../../../../babylonjs/core/scene.js";
import { ModelKey } from "../world/GameObject.mjs";

export class MeshModel{

    /**
     * @param {Mesh} mesh 
     */
    constructor(mesh){
        this.mesh=mesh
    }
}

/** @type {ModelKey<MeshModel>} */
export const MESH=new ModelKey("mesh")