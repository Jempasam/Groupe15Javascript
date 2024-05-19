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
import { adom, create, dom } from "../../../../samlib/DOM.mjs";
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
         const button=container.appendChild(adom/*html*/`<input class=toremove type=button value=Refresh />`)
         const auto=container.appendChild(adom/*html*/`<input class=toremove type=checkbox />`)
         const copy=container.appendChild(adom/*html*/`<input class=toremove type=button value=Copy />`)
         const paste=container.appendChild(adom/*html*/`<input class=toremove type=button value=Paste />`)
         const dimension=container.appendChild(adom/*html*/`<input class=toremove type=text value=[1.5,0.5,1.5] />`)
         const error=container.appendChild(create("p.toremove"))
         
         const select=container.appendChild(create("select.toremove"))
         for(const [name,val] of Object.entries(pack.objects)){
            select.appendChild(adom/*html*/`<option value="${name}">${name}</option>`)
         }

         function catch_error(callback){
            error.innerHTML=""
            try{ callback() }
            catch(e){ error.innerHTML=e }
         }

         function get_and_check(input, errorname, test){
            let value
            try{ value=eval(input.value) }
            catch(e){ throw new Error(errorname+": "+e) }
            if(!test(value)) throw new Error(errorname)
            return value
         }

         function reload(){
            catch_error(()=>{
               // Get dimension
               let array=get_and_check(dimension, "Invalid dimension value", it=>Array.isArray(it) && it.length==3)

               // Clear 
               world.clearObjects()
               createLevel({
                  tile_size: Vector3.FromArray(array),
                  position: new Vector3(0,0,0),
                  name_length: 2,
                  world, objects: pack.objects,
                  maps:areas.map(it=>it.value)
               })
            })
         }
         const auto_reload=()=>{ if(auto.checked)reload() }

         for(let a of areas)a.addEventListener("input",auto_reload)

         // Copy-Paste
         copy.addEventListener("click",e=>{
            navigator.clipboard.writeText("`"+areas.map(it=>it.value).join("`,`\n")+"`")
         })

         paste.addEventListener("click",e=>{
            catch_error(()=>{
               navigator.clipboard.readText().then(text=>{
                  if(!text.startsWith("`") || !text.endsWith("`")) throw new Error("Invalid format in clipboard")
                  text=text.substring(1,text.length-1)
                  const parts=text.split("`,`\n")
                  for(let i=0;i<parts.length&&i<areas.length;i++)areas[i].value=parts[i]
                  auto_reload()
               })
            })
         })

         dimension.addEventListener("input",auto_reload)

         button.addEventListener("click",reload)
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