import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { friendly } from "../../../utils/FriendlyIterable.js"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { Behaviour } from "../Behaviour.mjs"
import { COLLECTABLE, CollectableBehaviour } from "../generic/CollectableBehaviour.mjs"


export class TeleportationBehaviour extends CollectableBehaviour{

    /**
     * @override
     * @type {CollectableBehaviour['on_collection']}
     */
    on_collection(teleporter, teleported, data, world, teleporters, teleportables){
        const position= teleporter.get(TRANSFORM)?.position ?? Vector3.Zero()
        const target=friendly(teleporters) ?.minBy(t=>{
            if(t===teleporter)return Infinity
            else return t.get(TRANSFORM)?.position?.subtract(position)?.length() ?? Infinity
        })
        const target_pos=target?.get(TRANSFORM)?.position

        if(target && target_pos){
            teleported.apply(TRANSFORM, tf=>tf.position.copyFrom(target_pos) )
            target.forAll(COLLECTABLE, c=>c.equippedTime=10)
            return true
        }
        return false
    }

}