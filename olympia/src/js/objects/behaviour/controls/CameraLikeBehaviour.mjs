import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { Vector3 } from "../../../../../../babylonjs/core/Maths/math.vector.js";

export class CameraLikeBehaviour extends Behaviour{
    
    /** @type {Behaviour['init']} */
    tick(world,objects, targets){

        for(const obj of objects){
            let camera_info=obj.get([CAMERA_LIKE,this.uid])
            let camera_position=obj.get(TRANSFORM)?.position

            // Get camera offset or calculate it
            if(!camera_info){
                let followed=targets[Symbol.iterator]().next().value; if (!followed) continue
                let followed_transform=followed.get(TRANSFORM); if (!followed_transform) continue
                let camera_pos=camera_position ?? followed_transform.position.add(new Vector3(0,10,10))
                camera_info={offset:camera_pos.subtract(followed_transform.position), target:followed}
                obj.set([CAMERA_LIKE,this.uid], camera_info)
            }

            // Change target when die
            if(!camera_info.target.alive){
                obj.remove([CAMERA_LIKE,this.uid])
                continue
            }
            
            // Move the camera
            const followedpos=camera_info.target.get(TRANSFORM)?.position; if(!followedpos) continue
            if(!camera_position)continue

            const distance_player_camera=followedpos.subtract(camera_position).length()
            const normal_camera_distance=camera_info.offset.length()

            // Select the camera target.
            // If the camera is too far, the camera will follow the player
            let final_target_pos
            if(distance_player_camera>normal_camera_distance*1.2) final_target_pos= followedpos.add(new Vector3(0,camera_info.offset.y,0))
            else final_target_pos= camera_info.offset.add(followedpos)

            // Teleport the camera if it is too far
            if(distance_player_camera>normal_camera_distance*2) camera_position.copyFrom(final_target_pos)

            const movement=obj.get(MOVEMENT); if(!movement) continue
            const offset=final_target_pos.subtract(camera_position)
            
            // Stay if near enough
            if(offset.length()<1) continue

            offset.scaleInPlace(0.02)
            accelerate(movement.inertia, offset.x, offset.y, offset.z, Math.abs(offset.x)*5, Math.abs(offset.y)*5, Math.abs(offset.z)*5)
        }
    }

    /** @type {Behaviour['finish']} */
    finish(world,objects){
        for(const obj of objects) obj.remove([CAMERA_LIKE,this.uid])
    }

}

/** @type {ModelKey<{offset:Vector3;target:GameObject}>} */
const CAMERA_LIKE=new ModelKey("camera_like")