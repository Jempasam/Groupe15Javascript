import { Camera } from "../../../../babylonjs/Cameras/camera.js";
import { World } from "../objects/world/World.mjs";
import { Level } from "./Level.mjs";
import { MeshBehaviour } from "../objects/behaviour/MeshBehaviour.mjs";
import { MESH, MeshModel } from "../objects/model/MeshModel.mjs";
import { MovementBehaviour } from "../objects/behaviour/MovementBehaviour.mjs";
import { MOVEMENT, MovementModel } from "../objects/model/MovementModel.mjs";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/index.js";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { HitboxBehaviour } from "../objects/behaviour/HitboxBehaviour.mjs";
import { PlayerBehaviour } from "../objects/behaviour/PlayerBehaviour.mjs";
import { ConstantForceBehaviour } from "../objects/behaviour/ConstantForceBehaviour.mjs";
import { SimpleCollisionBehaviour } from "../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { PushCollisionBehaviour } from "../objects/behaviour/PushCollisionBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { forMap } from "../objects/world/WorldUtils.mjs";


export class SamLevel extends Level{

    /**
     * @param {World} world 
     * @param {{camera:UniversalCamera}} options 
     */
    start(world,options){
        const models=world["models"]

        world.addBehaviours("object", 
            [new HitboxBehaviour(), 2], 
            [new MeshBehaviour(), 2], 
            [new MovementBehaviour(0.95), 1],
            new SimpleCollisionBehaviour()
        )
    
        world.addBehaviours("player", 
            new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1),
            new ConstantForceBehaviour(new Vector3(0,-0.01,0)),
            new PushCollisionBehaviour()
        )

        for(let i=0; i<20; i++){
            world.add("object",
                [MESH, new MeshModel(models.BLOCK)],
                [TRANSFORM, new TransformModel({position:new Vector3(0, -1+i*0.5, -1-i), scale:new Vector3(4,1,1)})]
            )
        }

        forMap(
`
H----
|....
|....
 G--
dF--d
 E--
bD--b
 C--
9BBB9
B----
|....
|....
9BBB9`,
            [-4,-8], [8,22],
            (letter, pos, size)=>{
                if(letter.match(/[0-9a-z]/)){
                    let height
                    if(letter.match(/[0-9]/)) height=letter.charCodeAt(0)-'0'.charCodeAt(0)+1
                    else height=letter.charCodeAt(0)-'a'.charCodeAt(0)+11
                    world.add("object",
                        [MESH, new MeshModel(models.PILLAR)],
                        [TRANSFORM, new TransformModel({position:new Vector3(pos[0]+size[0]/2, height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})]
                    )
                }
                else if(letter.match(/[A-Z]/)){
                    let height=letter.charCodeAt(0)-'A'.charCodeAt(0)+1
                    world.add("object",
                        [MESH, new MeshModel(models.BLOCK)],
                        [TRANSFORM, new TransformModel({position:new Vector3(pos[0]+size[0]/2, height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})]
                    )
                }
            }
        )

        this.player=world.add(["object","player"],
            [MESH, new MeshModel(models.PANDA)],
            [MOVEMENT, new MovementModel(new Vector3(0.1,0,0))],
            [TRANSFORM, new TransformModel({position:new Vector3(0, 2, 4)})]
        )

        options.camera.lockedTarget=this.player.get(HITBOX)?.hitbox
    }

    /**
     * @param {World} world 
     * @param {{camera:UniversalCamera}} options 
     */
    tick(world,options){
        const pos=this?.player?.get(TRANSFORM)?.position
        if(pos){
            options.camera.position.copyFrom(pos)
            options.camera.position.addInPlaceFromFloats(0,6,8)
        }
    }

    /**
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    stop(world,options){
    }

}