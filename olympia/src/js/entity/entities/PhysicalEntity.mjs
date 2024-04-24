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
            entity.placeMesh(world,world.scene)
        }
    }
}

export const MeshDLH = new MeshELHClass()

export class PhysicalEntity extends Entity{
    
    get_lists(){ return [MeshDLH] }

    get_hitbox(){}

    position=BABYLON.Vector3.Zero()
    rotation=BABYLON.Vector3.Zero()
    scale=BABYLON.Vector3.One()
    color=BABYLON.Color3.White()
}

export class SimpleMeshEntity extends PhysicalEntity{
    
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
        this.hitbox = BABYLON.MeshBuilder.CreateBox("hitbox", {width: 1, height: 1, depth: 1}, scene);
        this.hitbox.isVisible = false
    }

    setMesh(factory){
        this.factory=factory
        const scene=this.mesh.getScene()
        this.mesh.dispose()
        this.mesh = this.factory(scene)
    }

    placeMesh(world,scene){
        this.mesh.position=this.position
        this.mesh.rotation=this.rotation
        this.mesh.scaling=this.scale
        this.mesh.color=this.color

        this.hitbox.position=this.position
        this.hitbox.rotation=this.rotation
        this.hitbox.scaling=this.scale
        this.hitbox.color=this.color
    }

    removeMesh(world,scene){
        this.mesh.dispose()
        this.hitbox.dispose()
    }

    get_hitbox(){ return this.hitbox }

    get isHitboxVisible(){return this.hitbox.isVisible }
    set isHitboxVisible(v){this.hitbox.isVisible=v}
}