import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { World } from "../objects/world/World.mjs";
import { Level } from "./Level.mjs";
import { MeshBehaviour } from "../objects/behaviour/MeshBehaviour.mjs";
import { MESH, MeshModel } from "../objects/model/MeshModel.mjs";
import { MovementBehaviour } from "../objects/behaviour/MovementBehaviour.mjs";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
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
import { ModelKey } from "../objects/world/ModelHolder.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { PlayerJumpBehaviour } from "../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { PlayerDashBehaviour } from "../objects/behaviour/controls/PlayerDashBehaviour.mjs";
import { SimpleParticleBehaviour } from "../objects/behaviour/particle/SimpleParticleBehaviour.mjs";
import { LivingBehaviour, ON_DEATH } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { ParticleLivingBehaviour } from "../objects/behaviour/life/ParticleLivingBehaviour.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { PlayerShootBehaviour } from "../objects/behaviour/controls/PlayerShootBehaviour.mjs";
import { ProjectileBehaviour } from "../objects/behaviour/life/ProjectileBehaviour.mjs";
import { EmitterBehaviour } from "../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";


export class SamLevel extends Level{

   static playerPos=new Vector3(2, 3, 11)

   /**
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(world,options){

      // Setup
      /** @type {import("../ressources/Models.mjs").ModelLibrary} */
      const models=world["models"]

      let id_counter=0
      function id(){ return id_counter++ }

      /**
       * @param {...(Behaviour|[Behaviour,number])} behaviours
       */
      function behav(...behaviours){
         const ret=id()
         world.addBehaviours(ret, ...behaviours)
         return ret
      }


      // Movement
      const MOVEMENT= behav([new MovementBehaviour(0.98),1])
      const NO_FRICTION_MOVEMENT= behav([new MovementBehaviour(1),1])
      const HIGH_FRICTION_MOVEMENT=behav([new MovementBehaviour(0.9),1])

      // Physical
      const COLLISION=behav([new HitboxBehaviour(),2], new SimpleCollisionBehaviour())
      const FALLING=behav(new ConstantForceBehaviour(new Vector3(0,-0.015,0)))
      const PUSHABLE=behav(new PushCollisionBehaviour())

      // Models
      const BLOCK=behav([new MeshBehaviour(models.BLOCK),2])
      const PILLAR=behav([new MeshBehaviour(models.PILLAR),2])
      const BRIDGE=behav([new MeshBehaviour(models.BRIDGE),2])
      const STONE=behav([new MeshBehaviour(models.STONE),2])
      const ARTIFACT=behav([new MeshBehaviour(models.ARTIFACT),2])
      const SPHINX=behav([new MeshBehaviour(models.SPHINX),2])
      const PANDA=behav([new MeshBehaviour(models.PANDA),2])
      const PARTICLE_WIND=behav([new MeshBehaviour(models.PARTICLE_WIND),2])
      const PARTICLE_FIRE=behav([new MeshBehaviour(models.PARTICLE_FIRE),2])
      const PARTICLE_SMOKE=behav([new MeshBehaviour(models.PARTICLE_SMOKE),2])
      const PARTICLE_SLASH=behav([new MeshBehaviour(models.PARTICLE_SLASH),2])
      const PARTICLE_BATS=behav([new MeshBehaviour(models.PARTICLE_BATS),2])
      const PARTICLE_CLOUD=behav([new MeshBehaviour(models.PARTICLE_CLOUD),2])

      // Particles
      const PARTICLE_UP=behav(new SimpleParticleBehaviour(new Vector3(0,0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40))
      const PARTICLE_STAY=behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))
      const PARTICLE_SPREAD=behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))

      const OBJ_WIND=[PARTICLE_WIND, PARTICLE_SPREAD, MOVEMENT]
      const OBJ_SMOKE=[PARTICLE_SMOKE, PARTICLE_UP, MOVEMENT]
      const OBJ_CLOUD=[PARTICLE_SMOKE, PARTICLE_STAY, MOVEMENT]

      // Living
      const ALIVE=behav(
         new ParticleLivingBehaviour(OBJ_SMOKE, new Vector3(0.4,0.4,0.4)),
         [new LivingBehaviour(),2]
      )

      // Teams
      const ENNEMY=id()
      const PLAYER=id()

      // Attack
      const MELEE_PROJECTILE=id()
      world.addBehaviour([MELEE_PROJECTILE, ENNEMY], new ProjectileBehaviour(1,0.2,10))
      const RANGED_PROJECTILE=id()
      world.addBehaviour([RANGED_PROJECTILE, ENNEMY], new ProjectileBehaviour(1,0.3,30))
      const OBJ_SLASH_ATTACK=[MOVEMENT, COLLISION, MELEE_PROJECTILE, PARTICLE_SLASH]
      const OBJ_SHOOT_ATTACK=[MOVEMENT, COLLISION, RANGED_PROJECTILE, PARTICLE_FIRE]

      // Player
      world.addBehaviour(PLAYER, new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1))
      const PLAYER_DASH=behav(new PlayerDashBehaviour("KeyQ", 0.4, 40, 1, OBJ_CLOUD))
      const PLAYER_ATTACK=behav(new PlayerShootBehaviour("KeyE", 0.1, 40, OBJ_SLASH_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.1))
      const PLAYER_SHOOT=behav(new PlayerShootBehaviour("KeyE", 0.1, 40, OBJ_SHOOT_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.1))
      const PLAYER_JUMP=behav(new PlayerJumpBehaviour("Space", 0.3, 2, OBJ_WIND))

      // Equipper
      const JUMP_EQUIPPER=id()
      world.addBehaviours([JUMP_EQUIPPER,PLAYER], new EquipperBehaviour([PLAYER_JUMP],"jump"),)
      world.addBehaviours([JUMP_EQUIPPER], new EmitterBehaviour(OBJ_WIND, new Vector3(0.5, 0.5, 0.5), 10),)

      const DASH_EQUIPPER=id()
      world.addBehaviours([DASH_EQUIPPER,PLAYER], new EquipperBehaviour([PLAYER_DASH],"dash"),)
      world.addBehaviours([DASH_EQUIPPER], new EmitterBehaviour(OBJ_CLOUD, new Vector3(0.5, 0.5, 0.5), 10))

      const ATTACK_EQUIPPER=id()
      world.addBehaviours([ATTACK_EQUIPPER,PLAYER], new EquipperBehaviour([PLAYER_ATTACK],"attack"),)
      world.addBehaviours([ATTACK_EQUIPPER], new EmitterBehaviour(OBJ_SLASH_ATTACK, new Vector3(0.5, 0.5, 0.5), 10))

      // Ennemy
      world.addBehaviour([ENNEMY, PLAYER], new MeleeAttackBehaviour(0.02,0.04,8,3))

      // Platform
      const ELEVATOR=behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02))
      const MOVING=behav(new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04))

      // Objects
      const OBJ_PHYSIC=[MOVEMENT, COLLISION, PUSHABLE, FALLING]
      const OBJ_PLAYER=[...OBJ_PHYSIC, ALIVE, PLAYER]
      const OBJ_ENNEMY=[...OBJ_PHYSIC, ALIVE, ENNEMY]

      // Particles
      /*world.addBehaviours("cloud",
         new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20),
         new MovementBehaviour(0.98),
         new MeshBehaviour(models.PARTICLE_WIND),
      )

      world.addBehaviours("fire",
         new SimpleParticleBehaviour(new Vector3(0,0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40),
         new MovementBehaviour(0.98),
         new MeshBehaviour(models.PARTICLE_FIRE),
      )

      world.addBehaviours("smoke",
         new SimpleParticleBehaviour(new Vector3(0,0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40),
         new MovementBehaviour(0.98),
         new MeshBehaviour(models.PARTICLE_SMOKE),
      )

      world.addBehaviours("small_cloud",
         new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.1,1.1), 15),
         new MovementBehaviour(0.98),
         new MeshBehaviour(models.PARTICLE_SMOKE),
      )

      world.addBehaviours("object", 
         [new HitboxBehaviour(), 2], 
         [new MovementBehaviour(0.98), 1],
         new SimpleCollisionBehaviour()
      )*/

      /*world.addBehaviour("block",[new MeshBehaviour(models.BLOCK),2])
      world.addBehaviour("pillar",[new MeshBehaviour(models.PILLAR),2])
      world.addBehaviour("bridge",[new MeshBehaviour(models.BRIDGE),2])
      world.addBehaviour("stone",[new MeshBehaviour(models.STONE),2])
      world.addBehaviour("artifact",[new MeshBehaviour(models.ARTIFACT),2])
      world.addBehaviour("sphinx",[new MeshBehaviour(models.SPHINX),2])
      world.addBehaviour("panda",[new MeshBehaviour(models.PANDA),2])*/

      /*world.addBehaviours("physic",
         new ConstantForceBehaviour(new Vector3(0,-0.015,0)),
         new PushCollisionBehaviour()
      )
   
      world.addBehaviours("player", 
         new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1),
         new PlayerDashBehaviour("KeyQ", 0.4, 40, 1, ["small_cloud"]),
         new PlayerShootBehaviour("KeyE", 0.1, 40, ["object","slashing"], new Vector3(1.5,0.8,1.5), 1, 20, 0.1),
         new EmitterBehaviour(["fire"], new Vector3(0.5, 0.5, 0.5), 10),
      )*/

      /*world.addBehaviours("jumper",
         new PlayerJumpBehaviour("Space", 0.3, 2, ["cloud"]),
      )*/

      /*world.addBehaviours(["jump_giver","player"],
         new EquipperBehaviour(["jumper"],"jump")
      )
      world.addBehaviours("jump_giver",
         [new MeshBehaviour(models.ARTIFACT),2],
         new EmitterBehaviour(["small_cloud"], new Vector3(0.5, 0.5, 0.5), 10),
      )

      world.addBehaviours("living",
         new ParticleLivingBehaviour(["smoke"], new Vector3(0.4,0.4,0.4)),
         [new LivingBehaviour(),2],
      )

      world.addBehaviour("elevator",
         new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02)
      )

      world.addBehaviour("moving",
         new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04)
      )

      world.addBehaviour(["ennemy","player"],
         new MeleeAttackBehaviour(0.02,0.04,8,3)
      )*/
      /*
      world.addBehaviours("fireball", [new MeshBehaviour(models.PARTICLE_FIRE),2])
      world.addBehaviour(["fireball","living"], new ProjectileBehaviour(1,0.3,30))

      world.addBehaviours("slashing", [new MeshBehaviour(models.PARTICLE_SLASH),2])
      world.addBehaviour(["slashing","ennemy"], new ProjectileBehaviour(1,0.2,10))*/

      function codeToNum(code){
         if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
         else return code-'A'.charCodeAt(0)+11
      }
      
      const objectSpawner=(letter, pos, size)=>{
         if(letter[0]==" ")return
         /**
          * @typedef {import("../objects/world/ModelHolder.mjs").ModelAndKey} ModelAndKey
          * @type {Array< ()=>{tags: import("../objects/world/TaggedDict.mjs").Tag[], data: Array<ModelAndKey>}>}
          */
         const objects=[
            ()=>{return {tags:[COLLISION,PILLAR], data:[]} },//A
            ()=>{return {tags:[COLLISION,BLOCK], data:[]} },//B
            ()=>{return {tags:[COLLISION,BRIDGE], data:[]} },//C
            ()=>{return {tags:[COLLISION,STONE], data:[]} },//D
            ()=>{return {tags:[COLLISION,MOVEMENT,ELEVATOR,BLOCK], data:[]} },//E
            ()=>{return {tags:[COLLISION,MOVEMENT,MOVING,BLOCK], data:[]} },//F
            ()=>{return {tags:[COLLISION,ARTIFACT,JUMP_EQUIPPER], data:[]} },//G
            ()=>{return {tags:[...OBJ_PHYSIC,BLOCK], data:[]} },//H
            ()=>{return {tags:[...OBJ_ENNEMY, SPHINX], data:[new LivingModel(10)]} },//I
            ()=>{return {tags:[COLLISION,ARTIFACT,ATTACK_EQUIPPER], data:[]} },//J
         ]
         const bottom=codeToNum(letter.charCodeAt(1))
         const height=codeToNum(letter.charCodeAt(2))
         const type=objects[letter.charCodeAt(0)-"a".charCodeAt(0)]()
         world.add(type.tags,
            ...type.data,
            new TransformModel({position:new Vector3(pos[0]+size[0]/2, bottom/2+height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})
         )
      }
      forMap(`
      1  ]d03b06-..-..-..-..   d09                     b08-..-..-..-..-..
      2  ]   |             |b51a06b51a06b51a06b51a07b71|                |
      3  ]d09|_____________|      d05                  |                |
      4  ]   d06b41-..-..d03                           |                |
      5  ]      b31-..-..         d0F-..-..            |                |
      6  ]d07   b21-..-..d05      |       |            |________________|
      7  ]      b11-..-..   d06   |_______|                  b06
      8  ]   b01-..-..-..-..                                 |..
      9  ]   a09   c10   a09                                 |..
      10 ]      e01c10               f01               b08-..-..-..-..
      11    ]   a09   c10   a09                           |             |12       ]   b01-..-..-..-..                           |             |
      12 ]                     bP2-..                  |             |
      13 ]                     |____|                  |             |
      14 ]                                             |_____________|
      15 ]                     eJ1-..                        c71     
      16 ]                     bJ1-..                        c71
      17 ]                                                   c71
      18 ]                     eC1-..                        c71
      19 ]                  b0D-..-..-..               b08-..-..-..-..
      20 ]                  |          |               |             |
      21 ]                  |          |bB1a0Bb91a09b71|             |
      22 ]                  |          |bB1a0Bb91a09b71|             |
      23 ]                  |__________|               |_____________|`,
         [-4,-8], [1.5,1.5], objectSpawner, 3, true
      )
      forMap(`
      1  ]                                                h91   h91
      2  ]                                                   h91-..
      3  ]                                                   |____|
      4  ]                                                         
      5  ]                                                         
      6  ]                                                         
      7  ]                                                         
      8  ]                                                   
      9  ]   
      10 ]                                                   h91
      11 ]   
      12 ]   
      13 ]                     
      14 ]   
      15 ]                                                   i74-..
      16 ]                                                   |____|
      17 ]                              
      18 ]   
      19 ]                     
      20 ]   
      21 ]                     gE2                           j92`,
         [-4,-8], [1.5,1.5], objectSpawner, 3, true
      )

      this.player=world.add([...OBJ_PLAYER, PANDA, PLAYER_DASH],
         new TransformModel({ position: SamLevel.playerPos.clone() }),
         new LivingModel(3)
      )

      this.player.observers(ON_DEATH).add("SamLevel",(obj,_)=>{
         this.player?.apply(LIVING, living=>living.life=3)
         this.player?.apply(TRANSFORM, tf=>tf.position.y=-100)
      })

      world.add([...OBJ_PHYSIC,BLOCK],
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