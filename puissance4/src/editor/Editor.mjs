// @ts-nocheck

import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { create, dom, html } from "../../../samlib/DOM.mjs"
import { Puissance4 } from "../field/Puissance4.mjs"
import { SamSelector } from "../../../samlib/gui/Selector.mjs"
import { Item } from "../field/Item.mjs"
import { LOCAL_STORAGE, OBJECT_DATA } from "../../../samlib/Storage.mjs"
import { FileMenu } from "./FileMenu.mjs"
import { NumberInput } from "../../../samlib/gui/NumberInput.mjs"


export class EditorSpawnable{
    /**
     * 
     * @param {string} name 
     * @param {string} desc 
     * @param {function(number):Item} factory 
     */
    constructor(name,desc,price,factory){
        this.name=name
        this.description=desc
        this.price=price
        this.factory=factory
    }
}

/** @typedef {Object<string,EditorSpawnable>} EditorSpawnableDict */


/** @typedef {{height:number, width:number, grid:Array<Array<[string,number]|undefined>>}} Puissance4FieldContent */

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
                let entry=grid[ix][iy]
                if(entry!==null){
                    let [name,variant]=entry
                    let spawnable=this.dictionnary[name]
                    if(spawnable===undefined)throw new Error(`Unknown spawnable: "${name}" `)
                    let item=spawnable.factory(variant)
                    target.set(x+ix,y+iy,item)
                    if(doWriteNames){
                        item.factory=name
                        item.variant=variant
                    }
                }
                else{
                    target.set(x+ix,y+iy,null)
                    if(doWriteNames){
                        let cell=target.getElement(x+ix,y+iy)
                        cell.removeAttribute("name")
                    }
                }
            }
        }
    }

}

export class Editor extends HTMLElement{

    /** @type {EditorSpawnableDict} */
    #spawnables

    /** @type {EditorSpawnableDict} */
    #collection

    /** @type {function():Item|undefined} */
    #factory= ()=>undefined

    /** @type {string|undefined} */
    #factory_name=undefined

    /** @type {number} */
    #variant=0

    constructor(){
        super()

        // Menu
        this.dom_menu=create("div.menu")
        this.appendChild(this.dom_menu)

        // Field
        this.field=create("puissance-4._scrollable")
        this.field.oncelldraw=(obj,x,y,button)=>{
            if(button%2==1){
                let item=this.#factory(this.#variant)
                if(item){
                    item.factory=this.#factory_name
                    item.variant=this.#variant
                }
                this.field.set(x,y,item)
            }
            else if(button%4/2==1){
                this.field.set(x,y,null)
            }
            else if(button%8/4==1){
                let cell=this.field.get(x,y)
                if(cell){
                    let spawnable=this.#spawnables[cell.factory]
                    let variant=cell.variant
                    this.dom_variant.value=variant
                    this.select(cell.factory,spawnable.factory)
                }
            }
        }
        this.appendChild(this.field)
        

        // File Menu
        this.dom_file_menu=new FileMenu(
            input => this.load(new Puissance4Field(this.#collection,input)),
            () => this.field_definition.content,
        )
        this.dom_file_menu.classList.add("menu")
        this.appendChild(this.dom_file_menu)

        // Dimensions
        this.dom_width=new NumberInput()
        this.dom_width.min=4
        this.dom_width.max=40
        this.dom_width.value=10
        this.dom_menu.appendChild(this.dom_width)
        this.dom_width.addEventListener("change",()=>{
            this.createField()
        })

        this.dom_height=new NumberInput()
        this.dom_height.min=4
        this.dom_height.max=40
        this.dom_height.value=10
        this.dom_menu.appendChild(this.dom_height)
        this.dom_height.addEventListener("change",()=>{
            this.createField()
        })

        // Selector
        this.dom_selector=create("sam-selector")
        this.dom_menu.appendChild(this.dom_selector)

        // Variant Number
        this.dom_variant=new NumberInput()
        this.dom_variant.min=0
        this.dom_variant.max=100
        this.dom_variant.value=0
        this.dom_variant.addEventListener("change",e=>{this.updateExemple()})
        this.dom_menu.appendChild(this.dom_variant)

        // Example
        this.dom_exampel=new Puissance4()
        this.dom_exampel.width=1
        this.dom_exampel.height=1
        this.dom_menu.appendChild(this.dom_exampel)

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
        this.#createSelector()
    }

    set collection(collection){
        this.#collection=collection
    }

    set storage(value){
        this.dom_file_menu.storage=value
    }

    select(name,factory){
        this.#factory_name=name
        this.#factory=factory
        this.updateExemple()
    }

    selectVariant(index){
        this.#variant=index
        this.updateExemple()
    }

    updateExemple(index){
        this.#variant=this.dom_variant.value
        if(this.#factory)this.dom_exampel.set(0,0,this.#factory(this.#variant))
        else this.dom_exampel.set(0,0,null)
    }

    #createSelector(){
        this.dom_selector.innerHTML=""

        // Remover
        let option=dom`<sam-option><div class="remover"/></div></sam-option>`
        option.addEventListener("select",event=>this.select(name,undefined))
        this.dom_selector.appendChild(option)
        for(let [name,spawnable] of Object.entries(this.#spawnables)){
            let option=create("sam-option")
            option.addEventListener("select",event=>this.select(name,spawnable.factory))
            let cell=dom`<puissance-4 width=1 height=1 />`
            cell.set(0,0,spawnable.factory(0))
            option.appendChild(cell)
            this.dom_selector.appendChild(option)
        }
    }

    /**
     * Load a field into the editor
     * @param {Puissance4Field} field_definition 
     */
    load(field_definition){
        this.dom_height.value=field_definition.content.height
        this.dom_width.value=field_definition.content.width
        this.field.width=field_definition.content.width
        this.field.height=field_definition.content.height
        this.#collection=field_definition.dictionnary
        field_definition.load(this.field,0,0,true)
    }

    get field_definition(){
        let grid=[]
        let height=this.field.height
        let width=this.field.width
        for(let x=0; x<this.field.width; x++){
            let column=[]
            for(let y=0; y<this.field.height; y++){
                let item=this.field.get(x,y)
                if(!item)column.push(undefined)
                else{
                    let name=item.factory
                    let variant=item.variant
                    column.push([name,variant])
                }
            }
            grid.push(column)
        }
        return new Puissance4Field(this.#collection,{height,width,grid})
    }
        

}

mapAttribute(Editor)

customElements.define("puissance-4-editor", Editor)