import { ModelKey } from "../world/ModelHolder.mjs"
import { Behaviour } from "./Behaviour.mjs"
import { Camera } from "../../../../../babylonjs/core/Cameras/camera.js"
import { TRANSFORM } from "../model/TransformModel.mjs"
import { UniversalCamera } from "../../../../../babylonjs/core/index.js"

/** @type {ModelKey<UniversalCamera>} */
export const CAMERA=new ModelKey("camera")

export class CameraBehaviour extends Behaviour{

    constructor(){
        super()
    }

    /**
     * @override
     * @type {Behaviour['tick']}
     */
    tick(world, objects, players){
        const camera=world.model.get(CAMERA); if(!camera) return
        for(let obj of objects){
            let transform=obj.get(TRANSFORM); if(!transform) continue
            for(let player of players){
                let player_transform=player.get(TRANSFORM); if(!player_transform) continue
                const offset=transform.position.subtract(player_transform.position).normalize().scale(1.5)
                camera.position.copyFrom(transform.position.add(offset))
                camera.setTarget(player_transform.position.clone())
                break
            }
        }
    }

}