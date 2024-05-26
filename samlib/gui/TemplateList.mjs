import { adom, create, html } from "../DOM.mjs"

export default class TemplateList extends HTMLElement{
    
    constructor(){
        super()
        this.buttons= this.appendChild(create("div.buttons"))

        this.clear= this.buttons.appendChild(create("button.clear","Clear"))
        this.clear.onclick= e=>{
            this.querySelectorAll(":scope > div.template_copy").forEach(it=>it.remove())
            this.dispatchEvent(new Event("change"))
        }

        this.button= this.buttons.appendChild(create("button.add","Add"))
        this.button.onclick= e=>{
            this.addTemplate()
        }
    }

    addTemplate(){
        const template=this.querySelector(":scope > .template")
        if(!template)return

        const copy= create("div.template_copy")
        this.buttons.before(copy)

        const clone=template.cloneNode(true)
        copy.appendChild(clone)
        clone.classList.remove("template")


        const button=copy.appendChild(document.createElement("button"))
        button.innerHTML="X"
        button.onclick= e=>{
            copy.remove()
            this.dispatchEvent(new Event("change"))
        }

        this.dispatchEvent(new Event("change"))
    }
    
    getCopies(){
        return this.querySelectorAll(":scope > div.template_copy > :first-child")
    }

}

customElements.define("sam-template-list", TemplateList)