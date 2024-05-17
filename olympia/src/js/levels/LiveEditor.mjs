import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MessageManager } from "../messages/MessageManager.mjs";
import { Behaviour } from "../objects/behaviour/Behaviour.mjs";
import { SummonerBehaviour } from "../objects/behaviour/SummonerBehaviour.mjs";
import { MeleeAttackBehaviour } from "../objects/behaviour/controls/MeleeAttackBehaviour.mjs";
import { PlayerShootBehaviour } from "../objects/behaviour/controls/PlayerShootBehaviour.mjs";
import { behaviourCollectable } from "../objects/behaviour/generic/CollectableBehaviour.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs";
import { PathBehaviour } from "../objects/behaviour/movement/PathBehaviour.mjs";
import { EmitterBehaviour } from "../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour, ON_EQUIPPED } from "../objects/behaviour/slot/EquipperBehaviour.mjs";
import { HITBOX } from "../objects/model/HitboxModel.mjs";
import { LIVING, LivingModel } from "../objects/model/LivingModel.mjs";
import { MOVEMENT } from "../objects/model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { message } from "../script.js";
import { Level, LevelContext } from "./Level.mjs";
import { EffectPack } from "./objectpacks/EffectPack.mjs";
import { FightPack } from "./objectpacks/FightPack.mjs";
import { LivingPack } from "./objectpacks/LivingPack.mjs";
import { ModelPack } from "./objectpacks/ModelPack.mjs";
import { ParticlePack } from "./objectpacks/ParticlePack.mjs";
import { PhysicPack } from "./objectpacks/PhysicPack.mjs";
import { PlayerPack } from "./objectpacks/PlayerPack.mjs";
import { SoilPack } from "./objectpacks/SoilPack.mjs";
import { IAPack } from "./objectpacks/IAPack.mjs";
import { MonsterPack } from "./objectpacks/MonsterPack.mjs";
import { Lvl1_2 } from "./Lvl1_2.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { create, dom } from "../../../../samlib/DOM.mjs";

export class LiveEditor extends Level{

   static viewPos=new Vector3(0, 0, 0)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context,world,options){

      const physic=new PhysicPack(world)
      const model=new ModelPack(world)
      const particle=new ParticlePack(world,physic,model)
      const living=new LivingPack(world,particle)
      const effect=new EffectPack(world,particle)
      const fight=new FightPack(world,living,effect)
      const player=new PlayerPack(world,fight)
      const soil=new SoilPack(world,effect)
      const ia=new IAPack(world,living)
      const monster=new MonsterPack(world,fight,ia,player)

      const objects={
         aa: { tags:[...physic.STATIC(), model.pillar.id] },
         bb: { tags:[...physic.STATIC(), model.block.id] },
         BB: { tags:[...physic.STATIC(), model.building.id]},
         cc: { tags:[...physic.STATIC(), model.bridge.id] },
         dd: { tags:[...physic.STATIC(), model.stone.id] },
         ee: { tags:[...physic.STATIC(), physic.move.id, soil.elevator4.id, model.block.id] },
         EE: { tags:[...physic.STATIC(), physic.move.id, soil.rotate_side4.id, model.block.id] },
         hh: { tags:[...physic.PHYSIC_FALLING(), model.block.id] },

         gg: { tags:[...player.JUMP_EQUIPPER(), model.artifact.id] },
         jj: { tags:[...player.ATTACK_EQUIPPER(), model.artifact.id] },
         kk: { tags:[...player.SHOOT_EQUIPPER(), model.artifact.id] },
         ll: { tags:[...player.DASH_EQUIPPER(), model.artifact.id] },

         ii: { tags:[...monster.SPHINX()], models:()=>[new LivingModel(10),fight.bad] },
         mm: { tags:[...physic.STATIC(), model.hole.id, monster.panda_summoner.id] },
         rr: { tags:[...physic.STATIC(), model.hole.id, monster.kangaroo_summoner.id] },

         nn: { tags:[...physic.PHYSIC(), model.block.id] },
         zz: { tags:soil.ICE() },
         yy: { tags:soil.LAVA() },
         xx: { tags:soil.MUD() },
         
         PP: {
            tags:[...player.CLASSIC_PLAYER(), model.bonnet.id],
            models:()=>[new LivingModel(3), fight.good],
            size: it=>it.scale(0.8)
         },
      }

      const container=document.querySelector("#olympia")
      if(container){
         const areas=[]
         const area_container=container.appendChild(create("div.areacontainer.toremove"))
         for(let a=0;a<3;a++)areas.push(area_container.appendChild(create("textarea")))
         const button=container.appendChild(create("input[type=button][value=Refresh].toremove"))
         const auto=container.appendChild(create("input[type=checkbox].toremove"))
         const error=container.appendChild(create("p.toremove"))
         for(let a of areas)a.addEventListener("input",e=>{
            if(auto.checked)button.click()
         })
         button.addEventListener("click",e=>{
            world.clearObjects()
            error.innerHTML=""
            try{
               createLevel({
                  tile_size: new Vector3(1.5,0.5,1.5),
                  position: new Vector3(0,0,0),
                  name_length: 2,
                  world, objects,
                  maps:areas.map(it=>it.value)
               })
            }catch(e){
               error.innerHTML=e
            }
            console.log("refresh\n",area.value)
         })
      }
      

      options.camera.lockedTarget=null
      options.camera.detachControl()
   }

   camerapos=new Vector3(0,6,8)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   tick(context,world,options){
      if(isKeyPressed("ArrowUp")){
         if(isKeyPressed("ShiftRight"))this.camerapos.y+=0.2
         else this.camerapos.z-=0.2
      }
      if(isKeyPressed("ArrowDown")){
         if(isKeyPressed("ShiftRight"))this.camerapos.y-=0.2
         else this.camerapos.z+=0.2
      }
      if(isKeyPressed("ArrowLeft"))this.camerapos.x+=0.2
      if(isKeyPressed("ArrowRight"))this.camerapos.x-=0.2
      options.camera.position.copyFrom(this.camerapos)

      if(isKeyPressed("Escape"))context.switchTo(new SamLevel())
   }

   /**
    * @param {World} world 
    * @param {{camera:Camera}} options 
    */
   stop(world,options){
      const container=document.querySelector("#olympia")
      if(container){
         container.querySelectorAll(".toremove").forEach(it=>it.remove())
      }
   }

}