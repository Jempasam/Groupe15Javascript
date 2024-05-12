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
import { PoisonBehaviour } from "../objects/behaviour/effect/PoisonBehaviour.mjs";
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
import { EquipperBehaviour, ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { Behaviour, behaviour, behaviourEach } from "../objects/behaviour/Behaviour.mjs";
import { SummonerBehaviour } from "../objects/behaviour/SummonerBehaviour.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";


export class SamLevel extends Level{

   static playerPos=new Vector3(1.5, 2, 9.5)

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
      const MOVE= behav([new MovementBehaviour(0.98),1])
      const NO_FRICTION_MOVE= behav([new MovementBehaviour(1),1])
      const HIGH_FRICTION_MOVE=behav([new MovementBehaviour(0.9),1])

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
      const HOLE=behav([new MeshBehaviour(models.HOLE),2])
      const PANDA=behav([new MeshBehaviour(models.PANDA),2])
      const PARTICLE_WIND=behav([new MeshBehaviour(models.PARTICLE_WIND),2])
      const PARTICLE_FIRE=behav([new MeshBehaviour(models.PARTICLE_FIRE),2])
      const PARTICLE_SMOKE=behav([new MeshBehaviour(models.PARTICLE_SMOKE),2])
      const PARTICLE_SLASH=behav([new MeshBehaviour(models.PARTICLE_SLASH),2])
      const PARTICLE_BATS=behav([new MeshBehaviour(models.PARTICLE_BATS),2])
      const PARTICLE_CLOUD=behav([new MeshBehaviour(models.PARTICLE_CLOUD),2])
      const PARTICLE_FLAME=behav([new MeshBehaviour(models.PARTICLE_FLAME),2])

      // Particles
      const PARTICLE_UP=behav(new SimpleParticleBehaviour(new Vector3(0,0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40))
      const PARTICLE_FIRE_UP=behav(new SimpleParticleBehaviour(new Vector3(0,0.05,0), new Vector3(0,0.05,0), new Vector3(0.97,0.97,0.97), 40))
      const PARTICLE_STAY=behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))
      const PARTICLE_SPREAD=behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))

      const OBJ_WIND=[PARTICLE_WIND, PARTICLE_SPREAD, MOVE]
      const OBJ_SMOKE=[PARTICLE_SMOKE, PARTICLE_UP, MOVE]
      const OBJ_CLOUD=[PARTICLE_SMOKE, PARTICLE_STAY, MOVE]
      const OBJ_FIRE=[PARTICLE_FLAME, PARTICLE_FIRE_UP, MOVE]

      const PARTICLE_SMOKE_EMITTER=behav(new EmitterBehaviour(OBJ_CLOUD, new Vector3(0.5, 0.5, 0.5), 5))
      const PARTICLE_FIRE_EMITTER=behav(new EmitterBehaviour(OBJ_FIRE, new Vector3(1, 1, 1), 5))

      // Effect
      const IN_FIRE=behav(
         new PoisonBehaviour(1,20,60),
         new EmitterBehaviour(OBJ_FIRE, new Vector3(1, 1, 1), 5),
      )

      // Living
      const ALIVE=behav(
         new ParticleLivingBehaviour(OBJ_SMOKE, new Vector3(0.4,0.4,0.4)),
         [new LivingBehaviour(),2],
         behaviourEach((w,o)=>{
            o.apply2(TRANSFORM,LIVING, (tf,living) => tf.position.y<-10 ? living.damage(1) : null )
         })
      )

      // Teams
      const ENNEMY=id(), ENNEMY_CLOSE=id(), ENNEMY_CLOSE_FAST=id()
      const PLAYER=id()

      // Attack
      const MELEE_PROJECTILE=id()
      world.addBehaviour([MELEE_PROJECTILE, ENNEMY], new ProjectileBehaviour(1,0.2,10))
      const RANGED_PROJECTILE=id()
      world.addBehaviour([RANGED_PROJECTILE, ENNEMY], new ProjectileBehaviour(2,0.3,30, [IN_FIRE]))
      const OBJ_SLASH_ATTACK=[MOVE, COLLISION, MELEE_PROJECTILE, PARTICLE_SLASH]
      const OBJ_SHOOT_ATTACK=[MOVE, COLLISION, RANGED_PROJECTILE, PARTICLE_FIRE, PARTICLE_SMOKE_EMITTER]

      // Player
      world.addBehaviour(PLAYER, new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1))
      const PLAYER_DASH=behav(new PlayerDashBehaviour("KeyQ", 0.4, 40, 1, OBJ_CLOUD))
      const PLAYER_ATTACK=behav(new PlayerShootBehaviour("KeyE", 0.1, 40, OBJ_SLASH_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.1))
      const PLAYER_SHOOT=behav(
         new PlayerShootBehaviour("KeyE", 0.2, 40, OBJ_SHOOT_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.3),
         new EmitterBehaviour(OBJ_FIRE, new Vector3(1.2,1.2,1.2), 10),
      )
      const PLAYER_JUMP=behav(new PlayerJumpBehaviour("Space", 0.3, 1, OBJ_WIND))

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

      const SHOOT_EQUIPPER=id()
      world.addBehaviours([SHOOT_EQUIPPER,PLAYER], new EquipperBehaviour([PLAYER_SHOOT],"attack"),)
      world.addBehaviours([SHOOT_EQUIPPER], new EmitterBehaviour(OBJ_FIRE, new Vector3(0.8, 0.8, 0.8), 10))

      // Ennemy
      world.addBehaviour([ENNEMY_CLOSE, PLAYER], new MeleeAttackBehaviour(0.02,0.04,8,2))
      world.addBehaviour([ENNEMY_CLOSE_FAST, PLAYER], new MeleeAttackBehaviour(0.005,0.2,20,1))

      // Platform
      const ELEVATOR=behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02))
      const MOVING=behav(new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04))

      // Objects
      const OBJ_PHYSIC=[MOVE, COLLISION, PUSHABLE, FALLING]
      const OBJ_PLAYER=[...OBJ_PHYSIC, ALIVE, PLAYER]
      const OBJ_ENNEMY=[...OBJ_PHYSIC, ALIVE, ENNEMY]

      // Invocateur
      const INVOCATION_PANDA=id()
      world.addBehaviour([INVOCATION_PANDA,PLAYER],new SummonerBehaviour([NO_FRICTION_MOVE, COLLISION, PUSHABLE, FALLING, ALIVE, PANDA, ENNEMY, ENNEMY_CLOSE_FAST], new Vector3(.5,.5,.5), 3, 100, 15, 20))

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
            ()=>{return {tags:[COLLISION,MOVE,ELEVATOR,BLOCK], data:[]} },//E
            ()=>{return {tags:[COLLISION,MOVE,MOVING,BLOCK], data:[]} },//F
            ()=>{return {tags:[COLLISION,ARTIFACT,JUMP_EQUIPPER], data:[]} },//G
            ()=>{return {tags:[...OBJ_PHYSIC,BLOCK], data:[]} },//H
            ()=>{return {tags:[...OBJ_ENNEMY, SPHINX, ENNEMY_CLOSE], data:[new LivingModel(10)]} },//I
            ()=>{return {tags:[COLLISION,ARTIFACT,ATTACK_EQUIPPER], data:[]} },//J
            ()=>{return {tags:[COLLISION,ARTIFACT,SHOOT_EQUIPPER], data:[]} },//K
            ()=>{return {tags:[COLLISION,ARTIFACT,DASH_EQUIPPER], data:[]} },//L
            ()=>{return {tags:[COLLISION,HOLE,INVOCATION_PANDA], data:[]} },//M
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
      1  ]d03b06-..-..-..-..   d09                     b08-..-..-..-..-..-..
      2  ]   |             |b51a06b51a06b51a06b51a07b71|                   |
      3  ]d09|_____________|      d05                  |                   |
      4  ]   d06b41-..-..d03                           |                   |
      5  ]      b31-..-..         d0F-..-..            |                   |
      6  ]d07   b21-..-..d05      |       |            |___________________|
      7  ]      b11-..-..   d06   |_______|                  b06
      8  ]   b01-..-..-..-..                                 |..
      9  ]   a09   c10   a09                                 |..
      10 ]      e01c10               f01               b08-..-..-..-..
      11 ]   a09   c10   a09                           |             |
      12 ]   b01-..-..-..-..                           |             |
      13 ]                     bP2-..                  |             |
      14 ]                     |____|   bM1            |             |
      15 ]                                             |_____________|
      16 ]                                                   c71     
      17 ]                     bJ1-..                        c71
      18 ]                                                   c71
      19 ]                     eC1-..                        c71
      20 ]                  b0D-..-..-..               b08-..-..-..-..-..-..
      21 ]                  |          |               |                   |
      22 ]                  |          |bB1a0Bb91a09b71|                   |
      23 ]                  |          |bB1a0Bb91a09b71|                   |
      24 ]                  |__________|               |                   |
      25 ]                                             |___________________|`,
         [-4,-8], [1.5,1.5], objectSpawner, 3, true
      )
      forMap(`
      1  ]                                                h91   h91
      2  ]         l72                                       h91-..
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
      13 ]                     kS2
      14 ]   
      15 ]                                                   i74-..
      16 ]                                                   |____|
      17 ]                              
      18 ]   
      19 ]                     
      20 ]   
      21 ]   
      22 ]                     gE2                           j92
      23 ]   
      24 ]                                                            m90-..
      25 ]                                                            |____|`,
         [-4,-8], [1.5,1.5], objectSpawner, 3, true
      )

      this.player=world.add([...OBJ_PLAYER, PANDA],
         new TransformModel({ position: SamLevel.playerPos.clone() }),
         new LivingModel(3)
      )

      this.player.observers(ON_DEATH).add("SamLevel",(obj,_)=>{
         this.player?.apply(LIVING, living=>living.life=3)
         this.player?.apply(TRANSFORM, tf=>{
            tf.position.copyFrom(SamLevel.playerPos)
         })
         this.player?.apply(MOVEMENT, (movement)=>{
            movement.inertia.set(0,0,0)
         })
      })

      this.player.observers(ON_EQUIPPED).add("SamLevel",(obj,{equipper})=>{
         const infoJoueur=document.querySelector("#infoJoueur"); if(!infoJoueur)return
         if(equipper.given.includes(PLAYER_JUMP))infoJoueur.innerHTML="Sautez avec ESPACE"
         if(equipper.given.includes(PLAYER_DASH))infoJoueur.innerHTML="Dash avec A"
         if(equipper.given.includes(PLAYER_ATTACK))infoJoueur.innerHTML="Attaquez avec E"
         if(equipper.given.includes(PLAYER_SHOOT))infoJoueur.innerHTML="Tirez avec E"
      })

      world.add([...OBJ_PHYSIC,BLOCK],
         [TRANSFORM, new TransformModel({ position: SamLevel.playerPos.add(new Vector3(0, -2, 8)) })]
      )

      options.camera.lockedTarget=this.player.get(HITBOX)?.hitbox
   }

   camerapos=new Vector3(0,6,8)

   /**
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(world,options){
      const pos=this?.player?.get(TRANSFORM)?.position
      if(pos){
         options.camera.position.copyFrom(pos)
         options.camera.position.addInPlace(this.camerapos)
      }
      if(isKeyPressed("Digit1"))this.camerapos=new Vector3(0,6,8)
      if(isKeyPressed("Digit2"))this.camerapos=new Vector3(0,8,10)
      if(isKeyPressed("Digit3"))this.camerapos=new Vector3(0,30,30)
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
   }

}