import { Camera } from "../../../../babylonjs/core/Cameras/camera.js";
import { UniversalCamera, Vector3 } from "../../../../babylonjs/core/index.js";
import { adom, create } from "../../../../samlib/DOM.mjs";
import "../../../../samlib/gui/SamTextArea.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { World } from "../objects/world/World.mjs";
import { createLevel } from "../objects/world/WorldUtils.mjs";
import { Level, LevelContext } from "./Level.mjs";
import { SamLevel } from "./SamLevel.mjs";
import { BasicPack } from "./objectpacks/BasicPack.mjs";
import { ObjectPack } from "./objectpacks/ObjectPack.mjs";

export const LIVE_EDITOR_SETTINGS={
   tile_size: [new Vector3(1.5,0.5,1.5), new Vector3(1.5,0.5,1.5), new Vector3(1.5,0.5,1.5), new Vector3(6,2,6)],
   position: [Vector3.Zero(), Vector3.Zero(), Vector3.Zero(), new Vector3(12,-12,-16)],
   name_length: 2,
}

export class LiveEditor extends Level{

   static viewPos=new Vector3(0, 0, 0)

   /**
    * @param {LevelContext} context
    * @param {World} world 
    * @param {{camera:UniversalCamera}} options 
    */
   start(context,world,options){

      const pack=new BasicPack(world,{editor_mode:true})

      const container=document.querySelector("#olympia")
      if(container){


         // Error handling
         const error=container.appendChild(create("p.toremove"))
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


         // Writing area
         /** @type {Element[]} */
         const areas=[]
         const area_container=container.appendChild(create("div.areacontainer.toremove"))
         for(let a=0;a<4;a++)areas.push(area_container.appendChild(document.createElement("textarea",{is:"sam-textarea"})))
         //const dimension=container.appendChild(adom/*html*/`<input class=toremove type=text value=[1.5,0.5,1.5] />`)

         const refresh=container.appendChild(adom/*html*/`<input class=toremove type=button value=Refresh />`)
         refresh.addEventListener("click",reload)

         const clear=container.appendChild(adom/*html*/`<input class=toremove type=button value=Clear />`)
         clear.addEventListener("click",()=>{areas.forEach(it=>it.value="");reload()})

         // Scroll
         /** @param {Element} area */
         function onScroll(area){
            const scrollTop=area.scrollTop
            const scrollLeft=area.scrollLeft
            for(const other of areas){
               other.scrollTop=scrollTop
               other.scrollLeft=scrollLeft
            }
         }
         for(const area of areas)area.addEventListener("scroll",()=>onScroll(area))

         // Save and load
         function save(){
            return "`\n"+
               areas.map(it=>/**@type {string}*/(it.value))
               .map(area=>{
                  let counter={value:1}
                  return "1  ]"+area.replace(/\n/g,it=>{
                     counter.value++
                     return "\n"+new String(counter.value).padEnd(3," ")+"]"
                  })
               })
               .join("\n`\n,\n`\n")
               +"\n`"
         }

         function load(text){
            catch_error(()=>{
               text=text.trim()
               if(!text.startsWith("`\n") || !text.endsWith("\n`")) throw new Error("Invalid format in clipboard")
               text=text.substring(2,text.length-2).replace(/^[^\n]*\]/g,"").replace(/\n[^\n]*\]/g,"\n")
               const parts=text.split(/\n`[\n \t]*,[\n \t]*`\n/g)
               for(let i=0;i<parts.length&&i<areas.length;i++)areas[i].value=parts[i]
               reload()
            })
         }

         // Reload
         function reload(){
            catch_error(()=>{
               // Get dimension
               //let array=get_and_check(dimension, "Invalid dimension value", it=>Array.isArray(it) && it.length==3)

               // Clear 
               world.clearObjects()
               //const size=Vector3.FromArray(array)
               createLevel({
                  ...LIVE_EDITOR_SETTINGS,
                  world, 
                  objects: pack.objects,
                  maps:areas.map(it=>"\n"+it.value)
               })

               localStorage.setItem("editormap",save())
            })
         }

         localStorage.getItem("editormap") && load(localStorage.getItem("editormap"))

         const auto=container.appendChild(adom/*html*/`<input class=toremove type=checkbox />`)
         // @ts-ignore
         const auto_reload=()=>{ if(auto.checked)reload() }
         //dimension.addEventListener("input",auto_reload)
         for(let a of areas)a.addEventListener("input",auto_reload)

         
         // Copy Paste
         const copy=container.appendChild(adom/*html*/`<input class=toremove type=button value=Copy />`)
         const paste=container.appendChild(adom/*html*/`<input class=toremove type=button value=Paste />`)

         copy.addEventListener("click",e=>{
            navigator.clipboard
            .writeText(save())
         })

         paste.addEventListener("click",e=>{
            navigator.clipboard.readText().then(text=>load(text))
         })
         

         // Library
         const libraries=container.appendChild(create("div.library.toremove"))

         function refresh_libraries(){
            libraries.innerHTML=""
            for(const [name,val] of Object.entries(pack.objects)){
               const taglist= (Array.isArray(val.tags) ? val.tags : val.tags?.())
                  ?.map(it=> [ ObjectPack.getName(it)??"", ObjectPack.getColor(it)??"#FFFFFF" ])
                  ?.filter(it=>it.length>0) ?? []
               console.log(taglist)
               
               const small_name= taglist
                  .flatMap(it=>it[0].split("_"))
                  .map(it=>it.toUpperCase()+it.slice(1)) 
                  .map((it,i)=>(i<taglist.length-2?it.substring(0,2):it)) .join("") 
                  .slice(-25).padEnd(25,".") 
   
               const desc= taglist
                  .flatMap(it=>[adom`<span style="color:${it[1]}">${it[0]}</span>"`,adom`<span> </span>`])
                  
               desc.pop()
               libraries.appendChild(adom/*html*/`<div value="${name}">${name} ${small_name} ${desc}</div>`)
            }
         }

         refresh_libraries()


         // Custom items
         /*const editor=container.appendChild(create("div.item_editor"))
         const item_dict={}
         for(const tag of ObjectPack.tags()){
            const name=ObjectPack.getName(tag)
            item_dict[name]=tag
         }

         const editor=container.appendChild(new TemplateList())
         editor.appendChild(adom`
         <div class="template itemgroup">
            <input class=itemname type=text value="##" minlength=2 maxlength=2/>
            <input class=itemdef type=text value="transform, collision, [PANDA]"/>
         </div>
         `)*/
         

         
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