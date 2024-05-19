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
import { SamLevel } from "./SamLevel.mjs";
import { create, dom } from "../../../../samlib/DOM.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";

export class LiveEditor extends Level{

   static viewPos=new Vector3(0, 0, 0)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context,world,options){

      const pack=new BasicPack(world)

      const container=document.querySelector("#olympia")
      if(container){
         const areas=[]
         const area_container=container.appendChild(create("div.areacontainer.toremove"))
         for(let a=0;a<3;a++)areas.push(area_container.appendChild(create("textarea")))
         const button=container.appendChild(create("input[type=button][value=Refresh].toremove"))
         const auto=container.appendChild(create("input[type=checkbox].toremove"))
         const copy=container.appendChild(create("input[type=button][value=Copy].toremove"))
         const paste=container.appendChild(create("input[type=button][value=Paste].toremove"))
         const dimension=container.appendChild(create("input.toremove"))
         dimension.value="[1.5,0.5,1.5]"
         const error=container.appendChild(create("p.toremove"))
         const select=container.appendChild(create("select.toremove"))
         for(const [name,val] of Object.entries(pack.objects)){
            select.appendChild(dom/*html*/`<option value="${name}">${name}</option>`)
         }
         for(let a of areas)a.addEventListener("input",e=>{
            if(auto.checked)button.click()
         })
         copy.addEventListener("click",e=>{
            navigator.clipboard.writeText("`"+areas.map(it=>it.value).join("`,`\n")+"`")
         })
         paste.addEventListener("click",e=>{
            error.innerHTML=""
            navigator.clipboard.readText().then(text=>{
               if(!text.startsWith("`") || !text.endsWith("`")){
                  error.innerHTML="Invalid format"
                  return
               }
               text=text.substring(1,text.length-1)
               const parts=text.split("`,`\n")
               for(let i=0;i<parts.length&&i<areas.length;i++)areas[i].value=parts[i]
               button.click()
            })
         })
         dimension.addEventListener("input",e=>{
            if(auto.checked)button.click()
         })
         button.addEventListener("click",e=>{
            // Get dimension
            
            let array
            try{ array=eval(dimension.value) }
            catch(e){
               error.innerHTML="Invalid dimension value"
               return
            }
            if(!Array.isArray(array) || array.length!=3){
               error.innerHTML="Invalid dimension value"
               return
            }
            // Clear 
            world.clearObjects()
            error.innerHTML=""
            try{
               createLevel({
                  tile_size: Vector3.FromArray(array),
                  position: new Vector3(0,0,0),
                  name_length: 2,
                  world, objects: pack.objects,
                  maps:areas.map(it=>it.value)
               })
            }catch(e){
               error.innerHTML=e
            }
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