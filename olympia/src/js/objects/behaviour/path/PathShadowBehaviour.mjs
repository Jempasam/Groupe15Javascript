import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, accelerate, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { PATH, PathModel } from "../../model/PathModel.mjs"
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs"
import { ScaleBlock, Vector3 } from "../../../../../../babylonjs/core/index.js";
import { MeshBehaviour } from "../MeshBehaviour.mjs";
import { AbstractMesh } from "../../../../../../babylonjs/core/Meshes/abstractMesh.js";
import { Scene } from "../../../../../../babylonjs/core/scene.js";
import { MESH } from "../../model/MeshModel.mjs";


/**
 * Affiche une ombre sous un objet. Nécessite un path behaviour pour pouvoir projeter l'ombre.
 */
export class PathShadowBehaviour extends MeshBehaviour{

    /**
     * @param {(scene:Scene)=>AbstractMesh} factory
     */
    constructor(factory){
        super(factory)
    }

    /** @override @type {MeshBehaviour['tick']} */
    tick(world, objects){
        const path=world.model.get(PATH); if(!path)return
        objloop:for(const obj of objects){
            const mesh=obj.get([MESH,this.uid]); if(!mesh) continue
            const transform=obj.get(TRANSFORM); if(!transform) continue
            if(!transform.position._isDirty)return
            const feet_pos=transform.position.subtractFromFloats(0,transform.scale.y/2,0)
            const shadow_pos=path.getTilePos(feet_pos)
            shadow_pos[1]--
            const base_tile=path.getTile(shadow_pos)
            if(base_tile===PathModel.EMPTY)for(let i=0; i<5; i++){
                shadow_pos[1]--
                if(!path.containsTile(shadow_pos))break
                const tile=path.getTile(shadow_pos)
                if(tile!==PathModel.EMPTY){
                    if(!mesh.mesh.isEnabled())mesh.mesh.setEnabled(true)
                    shadow_pos[1]++
                    const shadow_pos_vec=path.getPosInTile(shadow_pos, new Vector3(.5,0,.5))
                    shadow_pos_vec.x=feet_pos.x
                    shadow_pos_vec.z=feet_pos.z
                    mesh.mesh.position.copyFrom(shadow_pos_vec)
                    mesh.mesh.scaling.set(transform.scale.x, 0.2, transform.scale.z)
                    break objloop
                }
            }
            mesh.mesh.setEnabled(false)
        }
    }


}