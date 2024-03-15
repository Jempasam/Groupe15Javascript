// @ts-nocheck
import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { create, dom } from "../../../samlib/DOM.mjs"
import { Class } from "../items/ItemUtils.mjs"
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

    /** @type {function(Element,number,number,number):void} */
    oncelldraw

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
            const old_content=this.#content
            this.#rebuilt()
            const copy_width=Math.min(old_content.length,this.#content.length)
            for(let x=0; x<copy_width; x++){
                const copy_height=Math.min(old_content[x].length,this.#content[x].length)
                for(let y=0; y<copy_height; y++){
                    this.set(x,y,old_content[x][y])
                }
            }
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
                    let cell = dom/*html*/`
                        <div class="puissance4_cell">
                            <div class="puissance4_item">
                            </div>
                        </div>
                    `
                    cell.addEventListener("click",event=>{
                        if(this.oncellclick){
                            this.oncellclick(cell,x,y)
                            event.preventDefault()
                        }
                    })
                    cell.addEventListener("mouseenter",event=>{
                        if(event.buttons%2==1 || event.buttons%4/2==1 || event.buttons%8/4==1){
                            if(this.oncelldraw){
                                this.oncelldraw(cell,x,y,event.buttons)
                                event.preventDefault()
                            }
                        }
                    })
                    cell.addEventListener("mousedown",event=>{
                        if(this.oncelldraw){
                            this.oncelldraw(cell,x,y,event.buttons)
                            event.preventDefault()
                        }
                    })
                    cell.addEventListener("contextmenu",event=>{
                        if(this.oncelldraw)event.preventDefault()
                    })
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
     * @param {boolean=} animate
     */
    set(x,y,item,animate=true){
        if(x<0 || x>=this.width || y<0 || y>=this.height)return
        if(item===undefined)throw new Error("Tried to set a case as undefined")
        let old=this.get(x,y)
        this.#content[x][y]=item
        this.updateElement(x,y)
        
        if(old){
            old.onRemove(this,old,x,y)
        }
        if(item){
            item.onAdd(this,item,x,y)
        }

        if(animate){
            this.getElement(x,y).clientHeight
            if(old){
                if(item)this.getElement(x,y).classList.add("transforming")
                else this.getElement(x,y).classList.add("destroying")
            }
            else{
                if(item)this.getElement(x,y).classList.add("appearing")
            }
        }
    }

    /**
     * Swap two item with an animation.
     * @param {number} x1 
     * @param {number} y1 
     * @param {number} x2 
     * @param {number} y2 
     */
    swap(x1,y1,x2,y2){
        // Swap
        let item1=this.get(x1,y1)
        let item2=this.get(x2,y2)

        let anim1="moving_"+Class.direction(x1-x2,y1-y2)
        let anim2="moving_"+Class.direction(x2-x1,y2-y1)
        this.set(x1,y1,item2,false)
        if(item2){
            const element=this.getElement(x1,y1)
            element.clientHeight
            element.classList.add(anim1)
        }
        this.set(x2,y2,item1,false)
        if(item1){
            const element=this.getElement(x2,y2)
            element.clientHeight
            element.classList.add(anim2)
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
        return this.children[x].children[y].children[0]
    }

    schedule(x,y,item){
        if(this.get(x,y)==item)this.ticks.schedule(x,y,item)
    }

    /**
     * Update the elemnt at the given coordinates for the corresponding item.
     * @param {number} x 
     * @param {number} y 
     */
    updateElement(x,y){
        let item=this.get(x,y)
        let element=this.getElement(x,y)
        element.className="puissance4_item"
        element.innerHTML=""
        if(item){
            element.appendChild(item.getDisplay(this,item,x,y))
        }
    }
    

}
mapAttribute(Puissance4)

customElements.define("puissance-4",Puissance4)