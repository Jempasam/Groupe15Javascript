// @ts-nocheck

import { mapAttribute } from "../../../samlib/CustomElement.mjs"
import { adom, create, dom, html } from "../../../samlib/DOM.mjs"
import { Puissance4 } from "../field/Puissance4.mjs"
import { FileMenu } from "./FileMenu.mjs"
import { NumberInput } from "../../../samlib/gui/NumberInput.mjs"
import { Onglets } from "../../../samlib/gui/Onglets.mjs"
import { ItemModifier } from "../field/field/ItemModifier.mjs"
import { ItemCollection, ItemField } from "../field/field/ItemField.mjs"
import { ItemSpawnable } from "../field/field/ItemSpawnable.mjs"
import { FruitItem } from "../items/FruitItem.mjs"


/**
 * @typedef {import("../field/field/ItemSpawnable.mjs").ItemSpawnableDict} ItemSpawnableDict
 * @typedef {import("../field/field/ItemModifier.mjs").ItemModifierDict} ItemModifierDict
 * @typedef {import("../field/field/ItemField.mjs").ItemFieldContent} ItemFieldContent
 */


const EMPTY=new ItemSpawnable("Empty","Empty cell",0,()=>null)
const IDENTITY=new ItemModifier("Identity", "Identity modifier", 0, it=>it)

export class Editor extends HTMLElement{

    /** @type {ItemCollection} */
    #collection

    /** @type {EditorSpawnable} */
    #spawnable=EMPTY
    /** @type {string?} */
    #spawnable_name=null
    /** @type {number} */
    #spawnable_variant=0

    /** @type {ItemModifier} */
    #modifier=IDENTITY
    /** @type {string?} */
    #modifier_name=null
    /** @type {number} */
    #modifier_variant=0

    constructor(){
        super()

        // Onglets
        this.dom_onglets=new Onglets()
        this.dom_onglets.className="menu"
        this.appendChild(this.dom_onglets)
        let nav=this.dom_onglets.appendChild(create("nav"))
        let pages=this.dom_onglets.appendChild(create("div"))

        // Spawnable Menu
        {
            nav.append(adom/*html*/`<a page=spawnable selected>✏️</a>`)
            const menu=create("div[page=spawnable][selected]")
            
            menu.appendChild(adom`<label>Spawnables</label>`)

            // Selector
            const selector=create("sam-selector")
            menu.appendChild(selector)

            // Variant Number
            const variant=new NumberInput()
            variant.min=0
            variant.max=100
            variant.value=0
            variant.addEventListener("change",e=>{this.updateExemple()})
            menu.appendChild(variant)

            // Example
            const example=new Puissance4()
            example.width=1
            example.height=1
            menu.appendChild(example)

            // Variant Name
            const name=create("input[type=text][disabled]")
            menu.appendChild(name)
            
            this.dom_spwn={selector, variant, example, name}
            pages.append(menu)
        }

        // Modifier Menu
        {
            nav.append(adom/*html*/`<a page=decorator>🎨</a>`)
            const menu=create("div[page=decorator]")

            menu.appendChild(adom`<label>Modifiers</label>`)
            
            // Selector
            const selector=create("sam-selector")
            menu.appendChild(selector)

            // Variant Number
            const variant=new NumberInput()
            variant.min=0
            variant.max=100
            variant.value=0
            variant.addEventListener("change",e=>{this.updateExemple()})
            menu.appendChild(variant)

            // Example
            const example=new Puissance4()
            example.width=1
            example.height=1
            menu.appendChild(example)

            // Variant Name
            const name=create("input[type=text][disabled]")
            menu.appendChild(name)
            
            this.dom_deco={selector, variant, example, name}
            pages.append(menu)
        }

        // Settings Menu
        {
            nav.append(adom/*html*/`<a page=settings>🛠️</a>`)
            const settings=create("div[page=settings]")
            pages.append(settings)
            
            settings.appendChild(adom/*html*/`<label>Dimensions</label>`)

            // Dimensions
            this.dom_width=new NumberInput()
            this.dom_width.min=4
            this.dom_width.max=40
            this.dom_width.value=10
            this.dom_width.addEventListener("change",()=>{
                this.createField()
            })
            settings.appendChild(this.dom_width)

            this.dom_height=new NumberInput()
            this.dom_height.min=4
            this.dom_height.max=40
            this.dom_height.value=10
            this.dom_height.addEventListener("change",()=>{
                this.createField()
            })
            settings.appendChild(this.dom_height)

        }

        // Field
        /** @type {Puissance4} */
        this.field=create("puissance-4._scrollable")
        this.field.oncelldraw=(obj,x,y,button)=>{
            if(button%2==1){ // Left click
                this.field.set(x,y,this.createSelected())
            }
            else if(button%4/2==1){ // Right click
                this.field.set(x,y,null)
            }
            else if(button%8/4==1){ // Middle click
                let cell=this.field.get(x,y)
                this.select(cell?.spawnable)
                this.selectVariant(cell?.variant??0)
                this.selectModifier(cell?.modifier)
                this.selectModifierVariant(cell?.modifier_variant??0)
            }
        }
        this.appendChild(this.field)
        

        // File Menu
        this.dom_file_menu=new FileMenu(
            input => this.load(new ItemField(this.#collection,input)),
            () => this.field_definition.content,
        )
        this.dom_file_menu.classList.add("menu")
        this.appendChild(this.dom_file_menu)

        this.createField()
    }

    createField(){
        this.field.width=this.dom_width.value
        this.field.height=this.dom_height.value
    }

    /**
     * @param {ItemCollection} spawnables
     */
    set collection(collection){
        this.#collection=collection
        this.#createSelector()
        this.#createModifSelector()
    }

    /** @param {Storage} */
    set storage(value){
        this.dom_file_menu.storage=value
    }

    select(name){
        this.#spawnable_name=name
        this.#spawnable=this.#collection.spawnables[name] ?? EMPTY
        this.updateExemple()
    }

    selectVariant(index){
        this.dom_spwn.variant.value=index
        this.updateExemple()
    }

    selectModifier(name){
        this.#modifier_name=name
        this.#modifier=this.#collection.modifiers[name] ?? IDENTITY
        this.updateExemple()
    }

    selectModifierVariant(index){
        this.dom_deco.variant.value=index
        this.updateExemple()
    }

    createSelected(){
        let item=this.#spawnable.factory(this.#spawnable_variant)
        if(item){
            item=this.#modifier.apply(item,this.#modifier_variant)
            item.spawnable=this.#spawnable_name
            item.variant=this.#spawnable_variant
            item.modifier=this.#modifier_name
            item.modifier_variant=this.#modifier_variant
        }
        return item
    }

    updateExemple(){
        this.#spawnable_variant=this.dom_spwn.variant.value
        this.#modifier_variant=this.dom_deco.variant.value
        this.dom_spwn.name.value=this.#spawnable.variantNames(this.#spawnable_variant)
        this.dom_deco.name.value=this.#modifier.variantNames(this.#modifier_variant)
        for(let dom of [this.dom_spwn,this.dom_deco]){
            dom.example.set(0,0,this.createSelected())
        }
    }

    #createSelector(){
        this.dom_spwn.selector.innerHTML=""

        // Remover
        let option=dom`<sam-option><div class="remover"/></div></sam-option>`
        option.addEventListener("select",event=>this.select(null))
        this.dom_spwn.selector.appendChild(option)
        for(let [name,spawnable] of Object.entries(this.#collection.spawnables)){
            let option=create("sam-option")
            option.addEventListener("select",event=>this.select(name))
            let cell=dom`<puissance-4 width=1 height=1 />`
            cell.set(0,0,spawnable.factory(0))
            option.appendChild(cell)
            this.dom_spwn.selector.appendChild(option)
        }
    }

    #createModifSelector(){
        this.dom_deco.selector.innerHTML=""

        // Remover
        let option=dom`<sam-option><div class="remover"/></div></sam-option>`
        option.addEventListener("select",event=>this.selectModifier(null))
        this.dom_deco.selector.appendChild(option)
        for(let [name,modifier] of Object.entries(this.#collection.modifiers)){
            let option=create("sam-option")
            option.addEventListener("select",event=>this.selectModifier(name))
            let cell=dom`<puissance-4 width=1 height=1 />`
            cell.set(0,0,modifier.apply(new FruitItem(),0))
            option.appendChild(cell)
            this.dom_deco.selector.appendChild(option)
        }
    }

    /**
     * Load a field into the editor
     * @param {ItemField} field_definition 
     */
    load(field_definition){
        this.dom_height.value=field_definition.content.height
        this.dom_width.value=field_definition.content.width
        this.field.width=field_definition.content.width
        this.field.height=field_definition.content.height
        this.#collection=field_definition.collection
        field_definition.write_field(this.field,0,0,true)
    }

    get field_definition(){
        return new ItemField(
            this.#collection,
            ItemField.to_field_data(this.field)
        )
    }
}

mapAttribute(Editor)
customElements.define("puissance-4-editor", Editor)