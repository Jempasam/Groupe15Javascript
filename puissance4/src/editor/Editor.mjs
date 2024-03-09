// @ts-nocheck

import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { create, dom, html } from "../../../samlib/DOM.mjs"
import { Puissance4 } from "../field/Puissance4.mjs"
import { SamSelector } from "../../../samlib/gui/Selector.mjs"
import { Item } from "../field/Item.mjs"
import { LOCAL_STORAGE, OBJECT_DATA } from "../../../samlib/Storage.mjs"
import { FileMenu } from "./FileMenu.mjs"


export class EditorSpawnable{
    /**
     * 
     * @param {string} name 
     * @param {string} desc 
     * @param {function():Item} factory 
     */
    constructor(name,desc,factory){
        this.name=name
        this.desc=desc
        this.factory=factory
    }
}

/** @typedef {Object<string,EditorSpawnable>} EditorSpawnableDict */


/** @typedef {{height:number, width:number, grid:Array<Array<string|undefined>>}} Puissance4FieldContent */

export class Puissance4Field{
    /**
     * Create a field loadable into a puissance-4 element
     * @param {EditorSpawnableDict} dictionnary 
     * @param {Puissance4FieldContent} content
     */
    constructor(dictionnary, content){
        this.dictionnary=dictionnary
        this.content=content
    }

    /**
     * Load a field into a target with an offset
     * @param {Puissance4} target
     * @param {number=} x
     * @param {number=} y
     * @param {boolean=} doWriteNames
     * @throws If the field is too big for the target or if a spawnable is unknown
     */
    load(target,x=0,y=0, doWriteNames=false){
        let width=this.content.width
        let height=this.content.height
        let grid=this.content.grid
        if(x+width>target.width)throw new Error("Width overflow")
        if(y+height>target.height)throw new Error("Height overflow")
        for(let ix=0; ix<width; ix++){
            for(let iy=0; iy<height; iy++){
                let name=grid[ix][iy]
                if(name!==null){
                    let spawnable=this.dictionnary[name]
                    if(spawnable===undefined)throw new Error(`Unknown spawnable: "${name}" `)
                    let item=spawnable.factory()
                    target.set(x+ix,y+iy,item)
                    if(doWriteNames){
                        let cell=target.getElement(x+ix,y+iy)
                        cell.setAttribute("name",name)
                    }
                }
            }
        }
    }

}

export class Editor extends HTMLElement{

    /** @type {EditorSpawnableDict} */
    #spawnables

    /** @type {function():Item|undefined} */
    #factory= ()=>undefined

    /** @type {string|undefined} */
    #factory_name=undefined

    constructor(){
        super()

        // Menu
        this.dom_menu=create("div.menu")
        this.appendChild(this.dom_menu)

        // Field
        this.field=create("puissance-4")
        this.field.oncellclick=(obj,x,y)=>{
            this.field.set(x,y,this.#factory())
            if(this.#factory_name!==undefined)obj.setAttribute("name",this.#factory_name)
            else a.removeAttribute("name")
        }
        this.appendChild(this.field)
        

        // File Menu
        this.dom_file_menu=new FileMenu(
            input => this.load(new Puissance4Field(this.#spawnables,input)),
            () => this.field_definition.content,
        )
        this.dom_file_menu.classList.add("menu")
        console.log(this.dom_file_menu)
        this.appendChild(this.dom_file_menu)

        // Dimensions
        this.dom_width=create("input[type=number]")
        this.dom_width.setAttribute("min",4)
        this.dom_width.setAttribute("max",40)
        this.dom_width.value=10
        this.dom_menu.appendChild(this.dom_width)
        this.dom_menu.onchange=()=>{
            this.createField()
        }

        this.dom_height=create("input[type=number]")
        this.dom_height.setAttribute("min",4)
        this.dom_height.setAttribute("max",40)
        this.dom_height.value=10
        this.dom_menu.appendChild(this.dom_height)
        this.dom_menu.onchange=()=>{
            this.createField()
        }

        // Selector
        this.dom_selector=create("sam-selector")
        this.dom_menu.appendChild(this.dom_selector)

        this.createField()
    }

    createField(){
        this.field.width=this.dom_width.value
        this.field.height=this.dom_height.value
    }

    /**
     * @param {EditorSpawnableDict} spawnables
     */
    set spawnables(spawnables){
        this.#spawnables=spawnables
        this.dom_selector.innerHTML=""
        let option=dom`<sam-option><img src="assets/remove.png"/></sam-option>`
        option.addEventListener("select",event=>{
            this.#factory=()=>undefined
        })
        this.dom_selector.appendChild(option)
        for(let [name,spawnable] of Object.entries(this.#spawnables)){
            let option=create("sam-option")
            option.addEventListener("select",event=>{
                this.#factory=spawnable.factory
                this.#factory_name=name
            })
            let cell=dom`<puissance-4 width=1 height=1 />`
            cell.set(0,0,spawnable.factory())
            option.appendChild(cell)
            this.dom_selector.appendChild(option)
        }
    }

    /**
     * Load a field into the editor
     * @param {Puissance4Field} field_definition 
     */
    load(field_definition){
        this.field.width=field_definition.content.width
        this.field.height=field_definition.content.height
        this.#spawnables=field_definition.dictionnary
        field_definition.load(this.field,0,0,true)
    }

    get field_definition(){
        let grid=[]
        let height=this.field.height
        let width=this.field.width
        for(let x=0; x<this.field.width; x++){
            let column=[]
            for(let y=0; y<this.field.height; y++){
                let item=this.field.getElement(x,y)
                if(!item)column.push(undefined)
                else{
                    let name=item.getAttribute("name")
                    column.push(name)
                }
            }
            grid.push(column)
        }
        return new Puissance4Field(this.#spawnables,{height,width,grid})
    }
        

}

mapAttribute(Editor)

customElements.define("puissance-4-editor", Editor)