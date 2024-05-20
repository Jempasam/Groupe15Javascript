import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { MESH, MeshModel, SCENE } from "../model/MeshModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Scene } from "../../../../../babylonjs/core/scene.js";
import { AbstractMesh, BoundingBox, Mesh, TransformNode } from "../../../../../babylonjs/core/index.js";



export class MeshBehaviour extends Behaviour{

    /**
     * @param {(scene:Scene)=>AbstractMesh} factory 
     */
    constructor(factory){
        super()
        this.factory=factory
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            const mesh=this.create(world.model.get(SCENE))
            mesh.rotationQuaternion=null
            obj.apply(TRANSFORM,transform=>{
                mesh.position.copyFrom(transform.position)
                mesh.rotation.copyFrom(transform.rotation)
                mesh.scaling.copyFrom(transform.scale)
            })
            obj.set([MESH,this.uid],new MeshModel(mesh))
        }
    }

    /** @type {AbstractMesh[]} */
    pool=[]
    last=0

    /** 
     * @param {AbstractMesh} mesh
     */
    free(mesh){
        const index=this.pool.indexOf(mesh)
        this.pool[index]=this.pool[this.last-1]
        this.pool[this.last-1]=mesh
        mesh.setEnabled(false)
        this.last--
    }

    /** 
     * @param {Scene} scene
     * @returns {AbstractMesh}
     * */
    create(scene){
        if(!this.pool[this.last]){
            this.pool[this.last]=this.factory(scene)
        }
        const ret=this.pool[this.last]
        ret.setEnabled(true)
        this.last++
        return ret
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            let mesh=obj.get([MESH,this.uid])?.mesh
            if(!mesh)continue

            let transform=obj.get(TRANSFORM) ?? TransformModel.ZERO
            if(transform.position._isDirty)mesh.position.copyFrom(transform.position)
            if(transform.rotation._isDirty)mesh.rotation.copyFrom(transform.rotation)
            if(transform.scale._isDirty)mesh.scaling.copyFrom(transform.scale)
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.apply([MESH,this.uid],mesh=>this.free(mesh.mesh))
            obj.remove([MESH,this.uid])
        }
    }

    get order() {return 2}
}