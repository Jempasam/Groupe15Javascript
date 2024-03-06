import { Item } from "./Item.mjs"
import { Player } from "./Player.mjs"
import { TickManager } from "./TickManager.mjs"


export class Field{

    /** @type {Array<Array<null|Item>>} */
    #content

    /** @type {TickManager} */
    ticks

    /**
     * Create a field in a html element 
     * @param {HTMLElement} target 
     */
    constructor(target, width, height){
        this.width = width
        this.height = height
        this.#content = []
        this.target=target
        this.ticks=new TickManager()
        target.classList.add("puissance4")
        for(let x=0; x<width; x++){
            let content_column=[]
            let column = document.createElement("div")
            column.classList.add("puissance4_column")
            target.appendChild(column)
            for(let y=0; y<height; y++){
                content_column.push(null)
                let cell = document.createElement("div")
                cell.classList.add("puissance4_cell")
                column.appendChild(cell)
            }
            this.#content.push(content_column)
        }
        console.log(this.#content)
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
            old.onRemove(this,x,y)
        }
        if(item){
            item.onAdd(this,x,y)
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
        return this.target.children[x].children[y]
    }

    /**
     * Update the elemnt at the given coordinates for the corresponding item.
     * @param {number} x 
     * @param {number} y 
     */
    updateElement(x,y){
        let item=this.get(x,y)
        let element=this.getElement(x,y)
        element.className=""
        element.classList.add("puissance4_cell")
        if(item){
            item.getClasses(this,x,y).forEach(c=>element.classList.add(c))
        }
    }
    

}

