import { AbstractMesh } from "../../../../../babylonjs/core/index.js";
import { ModelKey } from "../world/ModelHolder.mjs";

export class MeshModel{

    /**
     * @param {AbstractMesh} mesh 
     */
    constructor(mesh){
        this.mesh=mesh
    }
}

/** @type {ModelKey<MeshModel>} */
export const MESH=new ModelKey("mesh")