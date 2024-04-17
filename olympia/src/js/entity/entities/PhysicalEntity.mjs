import { Entity } from "../Entity.mjs";
import { EntityListHandler } from "../EntityListHandler.mjs";

class MeshELHClass extends EntityListHandler{

    on_add(world,entity){
        if(!world.scene)return
        if(!entity.createMesh)return
        entity.createMesh(world,world.scene)
    }
    
    on_remove(world,entity){
        if(!world.scene)return
        if(!entity.removeMesh)return
        entity.removeMesh(world,world.scene)
    }

    on_tick(world){
        if(!world.scene)return
        for(let entity of world.of(this)){
            if(!entity.placeMesh)return
            console.log("place mesh")
            entity.placeMesh(world,world.scene)
        }
    }
}

export const MeshDLH = new MeshELHClass()

export class MeshEntity extends Entity{
    
    get_lists(){ return [MeshDLH] }

    position=BABYLON.Vector3.Zero()
    rotation=BABYLON.Vector3.Zero()
    color=BABYLON.Color3.White()
}

export class SimpleMeshEntity extends MeshEntity{
    
    /**
     * @param {any} factory Une usine qui construit une mesh en prenant en paramètre la scène
     */
    constructor(factory){
        super()
        this.factory=factory
    }

    get_lists(){
        return [MeshDLH]
    }

    createMesh(world,scene){
        this.mesh = this.factory(scene)
    }

    placeMesh(world,scene){
        this.mesh.position=this.position ?? BABYLON.Vector3.Zero()
        this.mesh.rotation=this.rotation ?? BABYLON.Vector3.Zero()
        this.mesh.color=this.color ?? BABYLON.Color3.White()
    }

    removeMesh(world,scene){
        this.mesh.dispose()
    }
}