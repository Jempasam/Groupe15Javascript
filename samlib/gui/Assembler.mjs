import { adom, create, html } from "../DOM.mjs"

export default class Assembler extends HTMLElement{
    
    /**
     * @param {string[]} choices
     */
    constructor(choices){
        super()
        this.innerHTML=""
        
        // Select
        this.select= this.appendChild(document.createElement("select"))
        this.select.appendChild(create("option","--CHOOSE A TAG--"))
        choices.forEach( c => this.select.appendChild(create("option",c)) )
        this.select.onchange= e=>{
            const value=e.target?.["value"]
            if(value==="--CHOOSE A TAG--") return
            this.addChoice(value)
            this.select.selectedIndex=0
            this.dispatchEvent(new Event("change"))
        }
    }

    /**
     * @param {string} value 
     */
    addChoice(value){
        const choice= create("div.choice")
        this.select.before(choice)
        choice.appendChild(create("span",value))
        const button=choice.appendChild(document.createElement("button"))
        button.innerHTML="X"
        button.onclick= e=>{
            choice.remove()
            this.dispatchEvent(new Event("change"))
        }
    }
    
    /**
     * @return {string[]}
     */
    getChoices(){
        return [...this.querySelectorAll(":scope > div.choice > span").values()].map(it=>it.innerHTML)
    }

}

customElements.define("sam-assembler", Assembler)