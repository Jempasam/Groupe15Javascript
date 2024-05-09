import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { MESH } from "../model/MeshModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";


export class MeshBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            const mesh=obj.get(MESH)
            mesh?.createMesh(world["scene"])
            if(mesh && mesh.mesh){
                const transform=obj.get(TRANSFORM); if(!transform)continue
                mesh.mesh.position.copyFrom(transform.position)
                mesh.mesh.rotation.copyFrom(transform.rotation)
                mesh.mesh.scaling.copyFrom(transform.scale)
            }
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            let mesh=obj.get(MESH)?.mesh
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
        for(let obj of objects) obj.get(MESH)?.disposeMesh()
    }
}