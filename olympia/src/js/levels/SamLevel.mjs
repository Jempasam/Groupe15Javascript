import { Camera } from "../../../../babylonjs/Cameras/camera.js";
import { World } from "../objects/world/World.mjs";
import { Level } from "./Level.mjs";
import { MeshBehaviour } from "../objects/behaviour/MeshBehaviour.mjs";
import { MESH, MeshModel } from "../objects/model/MeshModel.mjs";
import { MovementBehaviour } from "../objects/behaviour/MovementBehaviour.mjs";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/index.js";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { HitboxBehaviour } from "../objects/behaviour/HitboxBehaviour.mjs";
import { PlayerBehaviour } from "../objects/behaviour/controls/PlayerBehaviour.mjs";
import { ConstantForceBehaviour } from "../objects/behaviour/ConstantForceBehaviour.mjs";
import { SimpleCollisionBehaviour } from "../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { PushCollisionBehaviour } from "../objects/behaviour/PushCollisionBehaviour.mjs";
import { MeleeAttackBehaviour } from "../objects/behaviour/controls/MeleeAttackBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { forMap } from "../objects/world/WorldUtils.mjs";
import { ModelKey } from "../objects/world/GameObject.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { PlayerJumpBehaviour } from "../objects/behaviour/controls/PlayerJumpBehavior.mjs";
import { SimpleParticleBehaviour } from "../objects/behaviour/particle/SimpleParticleBehaviour.mjs";



export class SamLevel extends Level{

    static playerPos=new Vector3(2, 3, 11)

    /**
     * @param {World} world 
     * @param {{camera:UniversalCamera}} options 
     */
    start(world,options){

        /** @type {import("../ressources/Models.mjs").ModelLibrary} */
        const models=world["models"]

        world.addBehaviours("object", 
            [new HitboxBehaviour(), 2], 
            [new MovementBehaviour(0.98), 1],
            new SimpleCollisionBehaviour()
        )

        world.addBehaviour("block",[new MeshBehaviour(models.BLOCK),2])
        world.addBehaviour("pillar",[new MeshBehaviour(models.PILLAR),2])
        world.addBehaviour("bridge",[new MeshBehaviour(models.BRIDGE),2])
        world.addBehaviour("stone",[new MeshBehaviour(models.STONE),2])
        world.addBehaviour("artifact",[new MeshBehaviour(models.ARTIFACT),2])
        world.addBehaviour("sphinx",[new MeshBehaviour(models.SPHINX),2])
        world.addBehaviour("panda",[new MeshBehaviour(models.PANDA),2])


        world.addBehaviours("physic",
            new ConstantForceBehaviour(new Vector3(0,-0.015,0)),
            new PushCollisionBehaviour()
        )
    
        world.addBehaviours("player", 
            new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1),
            new PlayerJumpBehaviour("Space", 0.3, 2, ["cloud"]),
        )

        world.addBehaviour("elevator",
            new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02)
        )

        world.addBehaviour("moving",
            new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04)
        )

        world.addBehaviour(["ennemy","player"],
            new MeleeAttackBehaviour(0.02,0.04,8,3)
        )

        world.addBehaviours("cloud",
            new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.05,0.95,1.05), 20),
            new MovementBehaviour(0.98),
            new MeshBehaviour(models.PARTICLE_WIND),
        )

        function codeToNum(code){
            if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
            else return code-'a'.charCodeAt(0)+11
        }
        
        const objectSpawner=(letter, pos, size)=>{
            if(letter[0]==" ")return
            /**
             * @type {Array< ()=>{tags: Array<string>, data: Array<[ModelKey<any>,any]>}>}
             */
            const objects=[
                ()=>{return {tags:["object","pillar"], data:[]} },//A
                ()=>{return {tags:["object","block"], data:[]} },//B
                ()=>{return {tags:["object","bridge"], data:[]} },//C
                ()=>{return {tags:["object","stone"], data:[]} },//D
                ()=>{return {tags:["object","elevator","block"], data:[]} },//E
                ()=>{return {tags:["object","moving","block"], data:[]} },//F
                ()=>{return {tags:["object","elevator","artifact"], data:[]} },//G
                ()=>{return {tags:["object","physic","block"], data:[]} },//H
                ()=>{return {tags:["object","physic","ennemy","sphinx"], data:[]} },//I
            ]
            const bottom=codeToNum(letter.charCodeAt(1))
            const height=codeToNum(letter.charCodeAt(2))
            const type=objects[letter.charCodeAt(0)-"a".charCodeAt(0)]()
            world.add(type.tags,
                ...type.data,
                [TRANSFORM, new TransformModel({position:new Vector3(pos[0]+size[0]/2, bottom/2+height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})]
            )
        }
        forMap(
`
d03b06-..-..-..-..   d09                     b08-..-..-..-..-..
   |             |b51a06b51a06b51a06b51a07b71|                |
d09|_____________|      d05                  |                |
   d06b41-..-..d03                           |                |
      b31-..-..g31      d0f-..-..            |                |
d07   b21-..-..d05      |       |            |________________|
      b11-..-..   d06   |_______|                  b06
   b01-..-..-..-..                                 |..
   a09   c10   a09                                 |..
      e01c10               f01               b08-..-..-..-..
   a09   c10   a09                           |             |
   b01-..-..-..-..                           |             |
                                             |             |
                                             |             |
                                             |_____________|
                                                   c71     
                                                   c71
                                                   c71
                                                   c71
                                             b08-..-..-..-..
                                             |             |
                                             |             |
                                             |             |
                                             |_____________|
`,
            [-4,-8], [1.5,1.5], objectSpawner, 3, true
        )
        
        forMap(
`
                                                h91   h91
                                                   h91-..
                                                   |____|
                                                         
                                                         
                                                         
                                                         
                                                   
   
                                                   h91
   
   
   
   
                                                   i74-..
                                                   |____|
`,
            [-4,-8], [1.5,1.5], objectSpawner, 3, true
        )

        this.player=world.add(["object","player","physic","panda"],
            [TRANSFORM, new TransformModel({ position: SamLevel.playerPos.clone() })]
        )

        world.add(["object","physic","block"],
            [TRANSFORM, new TransformModel({ position: SamLevel.playerPos.add(new Vector3(0, -2, 8)) })]
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
            options.camera.position
            .addInPlaceFromFloats(0,6,8)

            if(pos.y<-10){
                pos.copyFrom(SamLevel.playerPos)
                this?.player?.apply(MOVEMENT, (movement)=>{
                    movement.inertia.set(0,0,0)
                })
            }
        }
    }

    /**
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    stop(world,options){
    }

}