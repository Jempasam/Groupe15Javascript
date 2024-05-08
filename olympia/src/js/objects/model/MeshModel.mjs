import { Mesh } from "../../../../../babylonjs/index.js";
import { Scene } from "../../../../../babylonjs/scene.js";
import { ModelKey } from "../world/GameObject.mjs";

export class MeshModel{

    /** @type {Mesh?} */
    #mesh=null
    
    /**
     * @param {(scene:Scene)=>any} factory 
     */
    constructor(factory){
        this.factory=factory
    }

    get mesh(){ return this.#mesh }

    createMesh(scene){
        this.#mesh = this.factory(scene)
        if(this.#mesh)this.#mesh.rotationQuaternion=null
    }

    disposeMesh(){
        this.#mesh?.dispose()
        this.#mesh=null
    }
}

/** @type {ModelKey<MeshModel>} */
export const MESH=new ModelKey("mesh")