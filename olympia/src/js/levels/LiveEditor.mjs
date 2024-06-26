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
import { TaggedDict } from "../objects/world/TaggedDict.mjs";
import { ObjectPack } from "./objectpacks/ObjectPack.mjs";

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
         
         const select=container.appendChild(create("div.library.toremove"))
         for(const [name,val] of Object.entries(pack.objects)){
            const taglist= (Array.isArray(val.tags) ? val.tags : val.tags?.())
               ?.map(it=> [ ObjectPack.getName(it)??"", ObjectPack.getColor(it)??"#FFFFFF" ])
               ?.filter(it=>it.length>0) ?? []

            const small_name= taglist
               .flatMap(it=>it[0].split("_")) .map(it=>it[0].toUpperCase()+it.slice(1))  .map((it,i)=>(i<taglist.length-2?it.substring(0,2):it)) .join("") 
               .slice(-25).padEnd(25,".") 

            const desc= taglist
               .flatMap(it=>[adom`<span style="color:${it[1]}">${it[0]}</span>"`,adom`<span> </span>`])
               
            desc.pop()
            select.appendChild(adom/*html*/`<div value="${name}">${name} ${small_name} ${desc}</div>`)
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
            navigator.clipboard
            .writeText("`\n"+
               areas.map(it=>/**@type {string}*/(it.value))
               .map(area=>{
                  let counter={value:1}
                  return "1  ]"+area.replace(/\n/g,it=>{
                     counter.value++
                     return "\n"+new String(counter.value).padEnd(3," ")+"]"
                  })
               })
               .join("\n`\n,\n`\n")
            +"\n`")
         })

         paste.addEventListener("click",e=>{
            navigator.clipboard.readText().then(text=>{
                  catch_error(()=>{
                     text=text.trim()
                     if(!text.startsWith("`\n") || !text.endsWith("\n`")) throw new Error("Invalid format in clipboard")
                     text=text.substring(2,text.length-2).replace(/^[^\n]*\]/g,"").replace(/\n[^\n]*\]/g,"\n")
                     const parts=text.split(/\n`[\n \t]*,[\n \t]*`\n/g)
                     for(let i=0;i<parts.length&&i<areas.length;i++)areas[i].value=parts[i]
                     reload()
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
      this.camerapos=options.camera.position
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
      //options.camera.position.copyFrom(this.camerapos)

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