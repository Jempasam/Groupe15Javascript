// @ts-nocheck
import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { Item } from "./Item.mjs"
import { Player } from "./Player.mjs"
import { TickManager } from "./TickManager.mjs"


export class Puissance4 extends HTMLElement{

    /** @type {Array<Array<null|Item>>} */
    #content

    /** @type {TickManager} */
    ticks

    static attributeMap={
        "width": { def:0, parser:parseInt },
        "height": { def:0, parser:parseInt }
    }

    /** @type {function(Element,number,number):void} */
    oncellclick

    /**
     * Create a field in a html element 
     */
    constructor(){
        super()
        this.#content = []
        this.ticks=new TickManager()
        this.#rebuilt()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(["height","width"].includes(name)){
            this.#rebuilt()
        }
    }

    #rebuilt(){
        this.#content = []
            this.innerHTML=""
            let width=this.width
            let height=this.height
            for(let x=0; x<width; x++){
                let content_column=[]
                let column = document.createElement("div")
                column.classList.add("puissance4_column")
                this.appendChild(column)
                for(let y=0; y<height; y++){
                    content_column.push(null)
                    let cell = document.createElement("div")
                    cell.addEventListener("click",event=>{
                        if(this.oncellclick){
                            this.oncellclick(cell,x,y)
                        }
                        event.preventDefault()
                    })
                    cell.classList.add("puissance4_cell")
                    column.appendChild(cell)
                }
                this.#content.push(content_column)
            }
    }

    /* Item access */
    /**
     * Get an item from the field.
     * @param {number} x 
     * @param {number} y 
     * @returns {Item|null|undefined}
     */
    get(x,y){
        if(x<0 || x>=this.width || y<0 || y>=this.height)return undefined
        return this.#content[x][y]
    }

    /**
     * Set an item in the field.
     * Do nothing if the coordinates are out of the field.
     * @param {number} x 
     * @param {number} y 
     * @param {Item} item 
     */
    set(x,y,item){
        if(x<0 || x>=this.width || y<0 || y>=this.height)return
        let old=this.get(x,y)
        this.#content[x][y]=item
        this.updateElement(x,y)
        
        if(old){
            old.onRemove(this,old,x,y)
        }
        if(item){
            item.onAdd(this,item,x,y)
        }
    }

    /* Element access */
    /**
     * Get an element from the field.
     * @param {number} x 
     * @param {number} y 
     * @returns {Element}
     */
    getElement(x,y){
        return this.children[x].children[y]
    }

    /**
     * Update the elemnt at the given coordinates for the corresponding item.
     * @param {number} x 
     * @param {number} y 
     */
    updateElement(x,y){
        let item=this.get(x,y)
        let element=this.getElement(x,y)
        if(item){
            let item_div=element.children[0]
            if(!item_div){
                item_div=document.createElement("div")
                element.appendChild(item_div)
            }
            item_div.className="puissance4_item"
            item.getClasses(this,item,x,y).forEach(c=>item_div.classList.add(c))
        }
        else element.innerHTML=""
    }
    

}
mapAttribute(Puissance4)

customElements.define("puissance-4",Puissance4)