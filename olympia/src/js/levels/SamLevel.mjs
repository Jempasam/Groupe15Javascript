import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { killZone } from "../entities/killZones.js";
import { MessageManager } from "../messages/MessageManager.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";
import { SummonerBehaviour } from "../objects/behaviour/SummonerBehaviour.mjs";
import { MeleeAttackBehaviour } from "../objects/behaviour/controls/MeleeAttackBehaviour.mjs";
import { PlayerShootBehaviour } from "../objects/behaviour/controls/PlayerShootBehaviour.mjs";
import { behaviourCollectable } from "../objects/behaviour/generic/CollectableBehaviour.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { ProjectileBehaviour } from "../objects/behaviour/life/ProjectileBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { EmitterBehaviour } from "../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour, ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel, forMap } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level } from "./Level.mjs";
import { EffectPack } from "./objectpacks/EffectPack.mjs";
import { FightPack } from "./objectpacks/FightPack.mjs";
import { LivingPack } from "./objectpacks/LivingPack.mjs";
import { ModelPack } from "./objectpacks/ModelPack.mjs";
import { ParticlePack } from "./objectpacks/ParticlePack.mjs";
import { PhysicPack } from "./objectpacks/PhysicPack.mjs";
import { PlayerPack } from "./objectpacks/PlayerPack.mjs";

export class SamLevel extends Level{

   static playerPos=new Vector3(1.5, 2, 9.5)

   /**
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(world,options){

      message.send("Bienvenue dans le niveau de Sam",6000,"info")
      message.send("PV: 3", MessageManager.FOREVER, "pv")

      // Setup
      /** @type {import("../ressources/Models.mjs").ModelLibrary} */
      const models=world["models"]

      let id_counter=0
      function id(){ return id_counter++ }

      /**
       * @param {import("../objects/world/TaggedDict.mjs").Tag[]} tags
       * @param {...(Behaviour|[Behaviour,number])} behaviours
       */
      function behav_multi(tags, ...behaviours){
         const ret=id()
         world.addBehaviours([ret,...tags], ...behaviours)
         return ret
      }

      /**
       * @param {...(Behaviour|[Behaviour,number])} behaviours
       */
      function behav(...behaviours){
         const ret=id()
         world.addBehaviours(ret, ...behaviours)
         return ret
      }
      
      const physic=new PhysicPack(world)
      const model=new ModelPack(world)
      const particle=new ParticlePack(world,physic,model)
      const living=new LivingPack(world,particle)
      const effect=new EffectPack(world,particle)
      const fight=new FightPack(world,living)
      const player=new PlayerPack(world,fight)

      // Attack
      const MELEE_PROJECTILE=behav_multi([fight.ennemy.id], new ProjectileBehaviour(1,0.2,10))
      const RANGED_PROJECTILE=behav_multi([fight.ennemy.id], new ProjectileBehaviour(2,0.3,30, [effect.in_fire.id]))
      
      const OBJ_SLASH_ATTACK=[...physic.MOVING_GHOST(), MELEE_PROJECTILE, model.slash.id]
      const OBJ_SHOOT_ATTACK=[...physic.MOVING_GHOST(), physic.solid.id, RANGED_PROJECTILE, model.fire.id, particle.smoke_emitter.id]

      // Player
      const PLAYER_ATTACK=behav(new PlayerShootBehaviour("KeyE", 0.1, 40, OBJ_SLASH_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.1))
      const PLAYER_SHOOT=behav(
         new PlayerShootBehaviour("KeyE", 0.2, 40, OBJ_SHOOT_ATTACK, new Vector3(1.5,0.8,1.5), 1, 20, 0.3),
         new EmitterBehaviour(particle.FIRE(), new Vector3(1.2,1.2,1.2), 10),
      )

      // Equipper
      const JUMP_EQUIPPER=id()
      world.addBehaviours([JUMP_EQUIPPER, player.player.id], new EquipperBehaviour([player.jump.id],{slot:"jump"}),)
      world.addBehaviours([JUMP_EQUIPPER], new EmitterBehaviour(particle.WIND(), new Vector3(0.5, 0.5, 0.5), 10),)

      const DASH_EQUIPPER=id()
      world.addBehaviours([DASH_EQUIPPER, player.player.id], new EquipperBehaviour([player.dash.id],{slot:"dash"}),)
      world.addBehaviours([DASH_EQUIPPER], new EmitterBehaviour(particle.WIND(), new Vector3(0.5, 0.5, 0.5), 10))

      const ATTACK_EQUIPPER=id()
      world.addBehaviours([ATTACK_EQUIPPER, player.player.id], new EquipperBehaviour([PLAYER_ATTACK],{slot:"attack"}),)
      world.addBehaviours([ATTACK_EQUIPPER], new EmitterBehaviour(OBJ_SLASH_ATTACK, new Vector3(0.5, 0.5, 0.5), 10))

      const SHOOT_EQUIPPER=id()
      world.addBehaviours([SHOOT_EQUIPPER, player.player.id], new EquipperBehaviour([PLAYER_SHOOT],{slot:"attack"}),)
      world.addBehaviours([SHOOT_EQUIPPER], new EmitterBehaviour(particle.FIRE(), new Vector3(0.8, 0.8, 0.8), 10))

      // Ennemy
      const ENNEMY_CLOSE=behav_multi([player.player.id], new MeleeAttackBehaviour(0.02,0.04,8, {damage:2}))
      const ENNEMY_CLOSE_FAST=behav_multi([player.player.id], new MeleeAttackBehaviour(0.005,0.15,20, {damage:1}))
      const ENNEMY_CLOSE_FLYING=behav_multi([player.player.id], new MeleeAttackBehaviour(0.02,0.2,20, {damage:1, targeting_time:60, targets:[new Vector3(-3,10,-3),new Vector3(3,10,3),new Vector3(0,5,0),Vector3.Zero()]}))

      // Platform
      const ELEVATOR=behav(new PathBehaviour([new Vector3(0,0,0),new Vector3(0,4,0)], 0.1, 0.01, 0.02))
      const MOVING=behav(new PathBehaviour([new Vector3(-7,0,0),new Vector3(7,0,0),new Vector3(7,5,0)], 0.1, 0.02, 0.04))

      // Objects
      const OBJ_PLAYER=[...physic.PHYSIC_FALLING(), ...player.LIVING_PLAYER(), player.move.id]

      // Invocateur
      const OBJ_PANDA=[...physic.PHYSIC_FALLING_SLIDE(), ...fight.LIVING_ENNEMY(), model.panda.id, ENNEMY_CLOSE_FAST]
      const OBJ_SPHINX=[...physic.PHYSIC_FALLING(), ...fight.LIVING_ENNEMY(), model.sphinx.id, ENNEMY_CLOSE]
      const OBJ_BIRD=[...physic.PHYSIC_SLIDE(), ...fight.LIVING_ENNEMY(), model.bird.id, ENNEMY_CLOSE_FLYING]
      const INVOCATION_PANDA=behav_multi([player.player.id], new SummonerBehaviour(OBJ_PANDA, new Vector3(.5,.5,.5), 3, 100, 15, 20))
      const INVOCATION_BIRD=behav_multi([player.player.id], new SummonerBehaviour(OBJ_BIRD, new Vector3(.5,.5,.5), 3, 100, 15, 20))

      // Hint
      const UNLOCK_HINT=behav_multi([player.player.id], behaviourCollectable({},(_,collecter)=>{
         message.send("Vous pouvez débloquer des améliorations grâce aux artefactes dorés!",6000,"hint")
         return true
      }))

      const PUSH_HINT=behav_multi([player.player.id], behaviourCollectable({},(_,collecter)=>{
         message.send("Ces caisses peuvent être déplacées, peut être qu'elles peuvent vous être utile.",6000,"hint")
         return true
      }))

      const DAMAGE_HINT=behav_multi([player.player.id], behaviourCollectable({},(_,collecter)=>{
         message.send("Attention aux dégats! Si vous fumez, il ne faut plus vous faire toucher. ",6000,"hint")
         return true
      }))

      function codeToNum(code){
         if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
         else return code-'A'.charCodeAt(0)+11
      }
      
      const objectSpawner=(letter, pos, size)=>{
         if(letter[0]==" ")return
         /**
          * @typedef {import("../objects/world/ModelHolder.mjs").ModelAndKey} ModelAndKey
          * @type {Object.<string, ()=>{tags: import("../objects/world/TaggedDict.mjs").Tag[], data: Array<ModelAndKey>}>}
          */
         const objects={
            a: ()=>{return {tags:[...physic.STATIC(), model.pillar.id], data:[]} },
            b: ()=>{return {tags:[...physic.STATIC(), model.block.id], data:[]} },
            c: ()=>{return {tags:[...physic.STATIC(), model.bridge.id], data:[]} },
            d: ()=>{return {tags:[...physic.STATIC(), model.stone.id], data:[]} },
            e: ()=>{return {tags:[...physic.STATIC(), physic.move.id, ELEVATOR, model.block.id], data:[]} },
            f: ()=>{return {tags:[...physic.STATIC(), physic.move.id, MOVING, model.block.id], data:[]} },
            g: ()=>{return {tags:[...physic.STATIC(), model.artifact.id, JUMP_EQUIPPER], data:[]} },
            h: ()=>{return {tags:[...physic.PHYSIC_FALLING(), model.block.id], data:[]} },
            i: ()=>{return {tags:[...OBJ_SPHINX], data:[new LivingModel(10)]} },
            j: ()=>{return {tags:[...physic.STATIC_GHOST(), model.artifact.id, ATTACK_EQUIPPER], data:[]} },
            k: ()=>{return {tags:[...physic.STATIC_GHOST(), model.artifact.id, SHOOT_EQUIPPER], data:[]} },
            l: ()=>{return {tags:[...physic.STATIC_GHOST(), model.artifact.id, DASH_EQUIPPER], data:[]} },

            m: ()=>{return {tags:[...physic.STATIC(), model.hole.id,INVOCATION_PANDA], data:[]} },
            r: ()=>{return {tags:[...physic.STATIC(), model.hole.id,INVOCATION_BIRD], data:[]} },

            n: ()=>{return {tags:[...physic.PHYSIC(), model.block.id], data:[]} },
            o: ()=>{return {tags:[...physic.STATIC_GHOST(), model.question_mark.id, UNLOCK_HINT], data:[]} },
            p: ()=>{return {tags:[...physic.STATIC_GHOST(), model.question_mark.id, DAMAGE_HINT], data:[]} },
            q: ()=>{return {tags:[...physic.STATIC_GHOST(), model.question_mark.id, PUSH_HINT], data:[]} },
         }
         const bottom=codeToNum(letter.charCodeAt(1))
         const height=codeToNum(letter.charCodeAt(2))
         const type=objects[letter[0]]()
         world.add(type.tags,
            ...type.data,
            new TransformModel({position:new Vector3(pos[0]+size[0]/2, bottom/2+height/4-1, pos[1]+size[1]/2), scale:new Vector3(size[0],height/2,size[1])})
         )
      }
      /*forMap(`
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
      2  ]         l72                                       h91-..   qA3
      3  ]                                                   |____|
      4  ]                                                         
      5  ]                                                         
      6  ]                                                         
      7  ]                                                      
      8  ]         o23                                       pA3
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
      23 ]                                                            m90-..
      24 ]                                                            |____|
      25 ]                                                            `,
         [-4,-8], [1.5,1.5], objectSpawner, 3, true
      )*/

      createLevel({
         tile_size: new Vector3(1.5,0.5,1.5),
         position: new Vector3(-4,0,-8),
         world,
         objects: {
            a: { tags:[...physic.STATIC(), model.pillar.id] },
            b: { tags:[...physic.STATIC(), model.block.id] },
            c: { tags:[...physic.STATIC(), model.bridge.id] },
            d: { tags:[...physic.STATIC(), model.stone.id] },
            e: { tags:[...physic.STATIC(), physic.move.id, ELEVATOR, model.block.id] },
            f: { tags:[...physic.STATIC(), physic.move.id, MOVING, model.block.id] },
            g: { tags:[...physic.STATIC_GHOST(), model.artifact.id, JUMP_EQUIPPER] },
            h: { tags:[...physic.PHYSIC_FALLING(), model.block.id] },
            i: { tags:[...OBJ_SPHINX], models:()=>[new LivingModel(10)] },
            j: { tags:[...physic.STATIC_GHOST(), model.artifact.id, ATTACK_EQUIPPER] },
            k: { tags:[...physic.STATIC_GHOST(), model.artifact.id, SHOOT_EQUIPPER] },
            l: { tags:[...physic.STATIC_GHOST(), model.artifact.id, DASH_EQUIPPER] },
            m: { tags:[...physic.STATIC(), model.hole.id,INVOCATION_PANDA] },
            r: { tags:[...physic.STATIC(), model.hole.id,INVOCATION_BIRD] },
            n: { tags:[...physic.PHYSIC(), model.block.id] },
            o: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, UNLOCK_HINT] },
            p: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, DAMAGE_HINT] },
            q: { tags:[...physic.STATIC_GHOST(), model.question_mark.id, PUSH_HINT] },
         },
         maps:[
            `
            1  ]d03b06-..-..-..-..   d09                     b08-..-..-..-..-..-..      b0FbF0
            2  ]   |             |b51a06b51a06b51a06b51a07b71|                   |      b0EbE0
            3  ]d09|_____________|      d05                  |                   |      b0DbD0
            4  ]   d06b41-..-..d03                           |                   |      b0CbC0
            5  ]      b31-..-..         d0K-..-..            |                   |      b0BbB0
            6  ]d07   b21-..-..d05      |       |            |___________________|      b0AbA0
            7  ]      b11-..-..   d06   |_______|                  b06                  b09b90
            8  ]   b01-..-..-..-..                                 |..                  b08b80
            9  ]   a09   c10   a09                                 |..                  b07b70
            10 ]      e01c10               f01               b08-..-..-..-..            b06b60
            11 ]   a09   c10   a09                           |             |            b05b50
            12 ]   b01-..-..-..-..                           |             |            b04b40
            13 ]                     bP2-..                  |             |            b03b30
            14 ]                     |____|   bM1            |             |            b02b20
            15 ]                                             |_____________|            b01b10
            16 ]                                                   c71                  b00b00
            17 ]                     bJ1-..                        c71
            18 ]                                                   c71
            19 ]                     eC1-..                        c71
            20 ]                  b0D-..-..-..               b08-..-..-..-..-..-..
            21 ]                  |          |               |                   |
            22 ]                  |          |bB1a0Bb91a09b71|                   |
            23 ]                  |          |bB1a0Bb91a09b71|                   |
            24 ]                  |__________|               |                   |
            25 ]                                             |___________________|`,
            `
            1  ]                                                h91   h91
            2  ]         l72                                       h91-..   qA3
            3  ]                                                   |____|
            4  ]                                                         
            5  ]                                                         
            6  ]                                                         
            7  ]                                                      
            8  ]         o23                                       pA3
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
            23 ]                                                            m90-..
            24 ]                                                            |____|
            25 ]                                                            `
         ]
      })

      this.player=world.add([...OBJ_PLAYER, model.bonnet.id],
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

      this.player.observers(ON_LIVE_CHANGE).add("SamLevel",(obj,{})=>{
         message.send("PV: "+(obj.get(LIVING)?.life ?? 0), MessageManager.FOREVER, "pv")
      })

      this.player.observers(ON_EQUIPPED).add("SamLevel",(obj,{equipper})=>{
         if(equipper.given.includes(player.jump.id))message.send("Saut avec Espace",6000,"unlock")
         if(equipper.given.includes(player.dash.id))message.send("Dash avec Shift",6000,"unlock")
         if(equipper.given.includes(PLAYER_ATTACK))message.send("Attaquez avec E",6000,"unlock")
         if(equipper.given.includes(PLAYER_SHOOT))message.send("Tirez avec E",6000,"unlock")
      })

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