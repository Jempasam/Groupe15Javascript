import { Camera } from "../../../../babylonjs/Cameras/camera.js";
import { World } from "../objects/world/World.mjs";
import { Level } from "./Level.mjs";
import { MeshBehaviour } from "../objects/behaviour/MeshBehaviour.mjs";
import { MESH, MeshModel } from "../objects/model/MeshModel.mjs";
import { MovementBehaviour } from "../objects/behaviour/MovementBehaviour.mjs";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/index.js";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { HitboxBehaviour } from "../objects/behaviour/HitboxBehaviour.mjs";
import { PlayerBehaviour } from "../objects/behaviour/PlayerBehaviour.mjs";
import { ConstantForceBehaviour } from "../objects/behaviour/ConstantForceBehaviour.mjs";
import { SimpleCollisionBehaviour } from "../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { PushCollisionBehaviour } from "../objects/behaviour/PushCollisionBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { forMap } from "../objects/world/WorldUtils.mjs";
import { ModelKey } from "../objects/world/GameObject.mjs";


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

        world.addBehaviours("physic",
            new ConstantForceBehaviour(new Vector3(0,-0.01,0)),
            new PushCollisionBehaviour()
        )
    
        world.addBehaviours("player", 
            new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1)
        )

        world.addBehaviour("elevator",
            new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02)
        )

        world.addBehaviour("moving",
            new PathBehaviour([new Vector3(-6,0,0),new Vector3(6,0,0),new Vector3(6,5,0)], 0.1, 0.02, 0.04)
        )

        /*for(let i=0; i<20; i++){
            world.add("object",
                [MESH, new MeshModel(models.BLOCK)],
                [TRANSFORM, new TransformModel({position:new Vector3(0, -1+i*0.5, -1-i), scale:new Vector3(4,1,1)})]
            )
        }*/

        function codeToNum(code){
            if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
            else return code-'a'.charCodeAt(0)+11
        }

        forMap(
`
d03b06-..-..-..-..   d09                     b08-..-..-..-..
   |             |b51a06b51a06b51a06b51a07b71|             |
d09|_____________|      d05                  |             |
   d06b41-..-..d03                           |             |
      b31-..-..         d0f-..-..            |             |
d07   b21-..-..d05      |       |            |_____________|
      b11-..-..   d06   |_______|
   b01-..-..-..-..
   a09   c10   a09
      e10c10               f10
   a09   c10   a09
   b01-..-..-..-..
`,
            [-4,-8], [26,22],
            (letter, pos, size)=>{
                if(letter[0]==" ")return
                /**
                 * @type {Array< ()=>{tags: Array<string>, data: Array<[ModelKey<any>,any]>}>}
                 */
                const objects=[
                    ()=>{return {tags:["object"], data:[[MESH, new MeshModel(models.PILLAR)]]} },
                    ()=>{return {tags:["object"], data:[[MESH, new MeshModel(models.BLOCK)]]} },
                    ()=>{return {tags:["object"], data:[[MESH, new MeshModel(models.BRIDGE)]]} },
                    ()=>{return {tags:["object"], data:[[MESH, new MeshModel(models.STONE)]]} },
                    ()=>{return {tags:["object","elevator"], data:[[MESH, new MeshModel(models.BLOCK)]]} },
                    ()=>{return {tags:["object","moving"], data:[[MESH, new MeshModel(models.BLOCK)]]} },
                ]
                console.log(letter)
                const bottom=codeToNum(letter.charCodeAt(1))
                const height=codeToNum(letter.charCodeAt(2))
                const type=objects[letter.charCodeAt(0)-"a".charCodeAt(0)]()
                world.add(type.tags,
                    ...type.data,
                    [TRANSFORM, new TransformModel({position:new Vector3(pos[0]+size[0]/2, bottom/2+height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})]
                )
            },
            3
        )

        this.player=world.add(["object","player","physic"],
            [MESH, new MeshModel(models.PANDA)],
            [TRANSFORM, new TransformModel({position:new Vector3(0, 2, 4)})]
        )

        world.add(["object","physic"],
            [MESH, new MeshModel(models.BLOCK)],
            [TRANSFORM, new TransformModel({position:new Vector3(0, 4, 4)})]
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