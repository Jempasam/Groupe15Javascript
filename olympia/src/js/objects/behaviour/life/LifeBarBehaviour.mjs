import { adom, html } from "../../../../../../samlib/DOM.mjs";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { DOCUMENT } from "../InventoryBehaviour.mjs";
import { ON_LIVE_CHANGE } from "./LivingBehaviour.mjs";


export class LifeBarBehaviour extends Behaviour{


    /** @override @type {Behaviour['open']} */
    open(world){
        world.model.apply(DOCUMENT, document=>{
            this.element=document.appendChild(adom/*html*/`
            <div class="lifebars">
            </div>
            `)
        })
    }

    /**
     * @override
     * @type {Behaviour['init']}
     */
    init(world,objects){
        if(!this.element)return
        for(let obj of objects){
            const life=obj.get(LIVING)?.life ?? 1
            const lifebar=adom/*html*/`
                <div>
                    <div class="count">${life}/${life}</div>
                    <div class="name">${obj.get(NAME)??"Monstre"}</div>
                    <div class="bar"><div class="barfill" style="width:100%"></div></div>
                </div>
            `
            this.element.appendChild(lifebar)
            obj.set(LIFEBAR,{element:lifebar,maxlife:life})

            obj.observers(ON_LIVE_CHANGE).add(this.uid,(obj,change)=>{
                const life=obj.get(LIVING)?.life ?? 1
                const lifebar=obj.get(LIFEBAR); if(!lifebar) return
                const count=lifebar.element.querySelector(".count"); if(count) count.textContent=`${life}/${lifebar.maxlife}`
                const name=lifebar.element.querySelector(".name"); if(name) name.textContent=obj.get(NAME)??"Monstre"
                const bar=lifebar.element.querySelector(".barfill"); if(bar) bar.style.width=`${Math.floor(life/lifebar.maxlife*100)}%`
            })
        }
    }

    doTick=false

    /**
     * @override
     * @type {Behaviour['finish']}
     */
    finish(world,objects){
        for(let obj of objects){
            obj.apply(LIFEBAR, lifebar=>lifebar.element.remove())
            obj.observers(ON_LIVE_CHANGE).remove(this.uid)
        }
    }

    /** @override @type {Behaviour['close']} */
    close(world){
        this.element?.remove()
    }

    get order(){ return 2 }
}

/** @type {ModelKey<string>} */
export const NAME=new ModelKey("name")

/** @type {ModelKey<{element:Element,maxlife:number}>} */
export const LIFEBAR=new ModelKey("lifebar")