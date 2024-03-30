// @ts-nocheck

import { mapAttribute } from "../CustomElement.mjs"
import { create } from "../DOM.mjs"


/**
 * @event change
 */
export class Onglets extends HTMLElement{

    static #select=new CustomEvent("select",{bubbles:true})


    constructor(){
        super()
        this.addEventListener("click",e=>{
            const onglet=e.target
            if(onglet instanceof Onglet && onglet.parentElement===this){
                this.select(onglet.page)
            }
        })
    }

    select(pageid){
        for(const child of this.children){
            if(child instanceof Onglet){
                let nvalue=child.page===pageid
                if(child.selected!==nvalue){
                    child.selected=nvalue
                    child.dispatchEvent(Onglets.#select)
                }
            }
            else if(child instanceof Page){
                child.selected= child.page===pageid
            }
        }
    }

}
customElements.define("sam-onglets", Onglets)

export class Onglet extends HTMLElement{

    static attributeMap={
        "selected": { def:false, parser:s=>s==="true", serializer:n=>new String(n) },
        "page": { def:"def", parser:s=>s, serializer:n=>n }
    }

}
mapAttribute(Onglet)
customElements.define("sam-onglet", Onglet)

export class Page extends HTMLElement{

    static attributeMap={
        "selected": { def:false, parser:s=>s==="true", serializer:n=>new String(n) },
        "page": { def:"def", parser:s=>s, serializer:n=>n }
    }

}
mapAttribute(Page)
customElements.define("sam-page", Page)