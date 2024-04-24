
import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { create } from "../../../samlib/DOM.mjs"
import { Item } from "../field/Item.mjs"
import { Puissance4 } from "../field/Puissance4.mjs"
import { ItemField } from "../field/field/ItemField.mjs"
import { FileMenu } from "./FileMenu.mjs"
/** @typedef {import("../field/field/ItemField.mjs").ItemCollection} ItemCollection*/
/** @typedef {import("./Editor.mjs").ItemFieldContent} ItemFieldContent */


export class Loader extends HTMLElement{

    /** @type {ItemCollection} */
    #collection

    #selected_field

    /** @type {function():Item|undefined} */
    #factory= ()=>undefined

    /** @type {string|undefined} */
    #factory_name=undefined

    /** @type {undefined|function(ItemFieldContent):void} */
    onstart

    constructor(){
        super()

        // Field
        this.field=create(new Puissance4(), "&._scrollable")
        this.appendChild(this.field)

        // Menu
        this.dom_menu=create("div.menu")
        this.appendChild(this.dom_menu)
        
        // File Menu
        this.dom_file_menu=new FileMenu()
        this.dom_file_menu.onselect= input=>{
            this.#selected_field=new ItemField(this.#collection,input)
            this.load(this.#selected_field)
        }
        this.dom_file_menu.classList.add("menu")
        this.dom_menu.appendChild(this.dom_file_menu)

        // Play Button
        
        this.dom_play=/**@type {HTMLInputElement}*/(create("input[type=button][value=Play]"))
        this.dom_play.onclick=()=>{
            if(this.onstart)this.onstart(this.#selected_field)
        }
        this.dom_menu.appendChild(this.dom_play)

        this.field.width=1
        this.field.height=1
    }
    
    /**
     * @param {ItemCollection} collection
     */
    set collection(collection){
        this.#collection=collection
    }

    /**
     * Load a field into the editor
     * @param {ItemField} field_definition 
     */
    load(field_definition){
        this.field.width=field_definition.content.width
        this.field.height=field_definition.content.height
        this.#collection=field_definition.collection
        field_definition.write_field(this.field,0,0,true)
    }

    set storage(value){
        this.dom_file_menu.storage=value
    }

}

mapAttribute(Loader)

customElements.define("puissance-4-loader", Loader)