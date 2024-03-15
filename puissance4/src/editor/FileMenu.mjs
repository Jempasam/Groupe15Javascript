import { mapAttribute } from "../../../samlib/CustomElement.mjs";
import { create } from "../../../samlib/DOM.mjs";
import { LOCAL_STORAGE, OBJECT_DATA, Storage } from "../../../samlib/Storage.mjs";
import { SamSelector } from "../../../samlib/gui/Selector.mjs";


/** @typedef {import("./Editor.mjs").Puissance4FieldContent} Puissance4FieldContent*/

export class FileMenu extends HTMLElement{

    /** @type {string?} */
    #name=null

    onselect

    #storage=LOCAL_STORAGE

    /**
     * Create a filemenu allowing to select, load and save puissance 4 files
     * @param {function(Puissance4FieldContent):void=} saver 
     * @param {function():Puissance4FieldContent=} loader
     */
    constructor(saver=undefined,loader=undefined){
        super()

        this.saver=saver
        this.loader=loader

        // File Name
        if(loader){
            this.file_name=create("input[type=text]")
            this.appendChild(this.file_name)

            this.bt_save_new=create("input[type=button][value=Save]")
            this.bt_save_new.onclick= ()=>this.save(this.file_name.value)
            this.appendChild(this.bt_save_new)

            this.appendChild(create("hr"))
        }

        if(saver){
            // Load Button
            this.bt_load=create("input[type=button][value=Load]")
            this.bt_load.onclick= ()=>this.load()
            this.appendChild(this.bt_load)
        }

        if(loader){
            // Save Button
            this.bt_save=create("input[type=button][value=Save]")
            this.bt_save.onclick= ()=>this.save(this.#name)
            this.appendChild(this.bt_save)
        }
        
        // Remove Button
        this.bt_remove=create("input[type=button][value=Remove]")
        this.bt_remove.onclick= ()=>this.remove()
        this.appendChild(this.bt_remove)

        // File Selector
        this.selector=create("sam-selector")
        this.appendChild(this.selector)

        this.loadFileList()
    }

    // Régénère la liste des fichiers
    loadFileList(){
        this.selector.innerHTML=""
        let saves=this.#storage.get("puissance-4-saves",OBJECT_DATA)
        for(let [name,obj] of Object.entries(saves)){
            let option=create("sam-option")
            option.textContent=name
            option.addEventListener("select",event=>{
                this.#name=name
                this.#storage.edit("puissance-4-saves", OBJECT_DATA, saves=>{
                    if(this.onselect)this.onselect(saves[name])
                })
            })
            this.selector.appendChild(option)
        }
    }

    save(name){
        if(name){
            this.#storage.edit("puissance-4-saves", OBJECT_DATA, saves=>{
                saves[name]=this.loader()
            })
            this.loadFileList()
        }
    }

    load(){
        let name=this.#name
        if(name){
            this.#storage.edit("puissance-4-saves", OBJECT_DATA, saves=>{
                this.saver(saves[name])
            })
        }
    }

    remove(){
        let name=this.#name
        if(name){
            this.#storage.edit("puissance-4-saves", OBJECT_DATA, saves=>{
                delete saves[name]
            })
            this.loadFileList()
        }
    }

    set storage(value){
        this.#storage=value
        this.loadFileList()
    }
}

customElements.define("puissance-4-filemenu",FileMenu)