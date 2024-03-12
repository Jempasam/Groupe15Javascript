// @ts-nocheck

import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { create, dom, html } from "../../../samlib/DOM.mjs"
import { Puissance4 } from "../field/Puissance4.mjs"
import { SamSelector } from "../../../samlib/gui/Selector.mjs"
import { Item } from "../field/Item.mjs"
import { LOCAL_STORAGE, OBJECT_DATA } from "../../../samlib/Storage.mjs"
import { FileMenu } from "./FileMenu.mjs"
import { Puissance4Field } from "./Editor.mjs"
/** @typedef {import("./Editor.mjs").EditorSpawnableDict} EditorSpawnableDict*/


export class Loader extends HTMLElement{

    /** @type {EditorSpawnableDict} */
    #spawnables

    #selected_field

    /** @type {function():Item|undefined} */
    #factory= ()=>undefined

    /** @type {string|undefined} */
    #factory_name=undefined

    /** @type {undefined|function(Puissance4Field):void} */
    onplay

    constructor(){
        super()

        // Field
        this.field=create("puissance-4._scrollable")
        this.appendChild(this.field)

        // Menu
        this.dom_menu=create("div.menu")
        this.appendChild(this.dom_menu)
        
        // File Menu
        this.dom_file_menu=new FileMenu()
        this.dom_file_menu.onselect= input=>{
            this.#selected_field=new Puissance4Field(this.#spawnables,input)
            this.load(this.#selected_field)
        }
        this.dom_file_menu.classList.add("menu")
        this.dom_menu.appendChild(this.dom_file_menu)

        // Play Button
        this.dom_play=create("input[type=button][value=Play]")
        this.dom_play.onclick=()=>{
            if(this.onplay)this.onplay(this.#selected_field)
        }
        this.dom_menu.appendChild(this.dom_play)

        this.field.width=1
        this.field.height=1
    }
    /**
     * @param {EditorSpawnableDict} spawnables
     */
    set spawnables(spawnables){
        this.#spawnables=spawnables
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

}

mapAttribute(Loader)

customElements.define("puissance-4-loader", Loader)