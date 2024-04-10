import { Item } from "../Item.mjs"
import { Puissance4 } from "../Puissance4.mjs"
import { ItemModifier } from "./ItemModifier.mjs"
import { ItemSpawnable } from "./ItemSpawnable.mjs"


/**
 * @typedef {import("./ItemSpawnable.mjs").ItemSpawnableDict} ItemSpawnableDict
 * @typedef {import("./ItemModifier.mjs").ItemModifierDict} ItemModifierDict 
 * 
 * A tile of a field save.
 * @typedef {[string,number,string|null,number]|null} ItemFieldContentTile
 * 
 * A list of item and modifiers available for a field save.
 */
export class ItemCollection{
    /**
     * Create a collection of spawnables and modifiers
     * @param {ItemSpawnableDict} spawnables
     * @param {ItemModifierDict} modifiers
     */
    constructor(spawnables, modifiers){
        this.spawnables=spawnables
        this.modifiers=modifiers
    }

    /**
     * Read an Item from tile data
     * @param {ItemFieldContentTile} tile
     * @param {boolean} doWriteNames
     * @returns {Item?}
     */
    from_data(tile, doWriteNames=false){
        if(tile===null)return null

        // Get Spawnable
        let [spawnable_name, spawnable_variant, modifier_name, modifier_variant]=tile
        let spawnable=this.spawnables[spawnable_name]
        if(spawnable===undefined)throw new Error(`Unknown spawnable: "${name}" `)
        let item=spawnable.factory(spawnable_variant)

        // Get Modifier
        if(modifier_name){
            let modifier=this.modifiers[modifier_name]
            if(modifier===undefined)throw new Error(`Unknown modifier: "${modifier_name}" `)
            item=modifier.apply(item,modifier_variant)
        }

        if(doWriteNames){
            item.spawnable=spawnable_name
            item.variant=spawnable_variant
            item.modifier=modifier_name
            item.modifier_variant=modifier_variant
        }

        return item
    }
}


/**
 * 
 * The saveable part of an item field. Without the collection of spawnables and modifiers, just pure tile data.
 * @typedef {{
 *      height:number,
 *      width:number,
 *      grid:Array<Array<ItemFieldContentTile>>
 * }} ItemFieldContent 
 * 
 * A field save that can be loaded into a puissance-4 element.
 */
export class ItemField{

    /**
     * Create a field loadable into a puissance-4 element
     * @param {ItemCollection} collection
     * @param {ItemFieldContent} content
     */
    constructor(collection, content){
        this.collection=collection
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
    write_field(target,x=0,y=0, doWriteNames=false){
        let width=this.content.width
        let height=this.content.height
        let grid=this.content.grid
        if(x+width>target.width)throw new Error("Width overflow")
        if(y+height>target.height)throw new Error("Height overflow")
        for(let ix=0; ix<width; ix++){
            for(let iy=0; iy<height; iy++){
                let entry=grid[ix][iy]
                const item=this.collection.from_data(entry,doWriteNames)
                target.set(x+ix,y+iy,item)
            }
        }
    }

    /**
     * Read field from various target usinf a getter
     * @param {number} width 
     * @param {number} height 
     * @param {function(number,number):ItemFieldContentTile} getter 
     * @returns {ItemFieldContent}
     */
    static read_field(width, height, getter){
        let grid=[]
        for(let x=0; x<width; x++){
            let column=[]
            for(let y=0; y<height; y++){
                let item=getter(x,y)
                column.push(item)
            }
            grid.push(column)
        }
        return /**@type {ItemFieldContent}*/{
            width: width,
            height: height,
            grid: grid
        }
    }
    
    /**
     * Write an Item to tile data
     * @param {Item?} item
     * @returns {ItemFieldContentTile}
     */
    static to_data(item){
        if(item){
            const sname=item.spawnable
            const svariant=item.variant ?? 0
            const mname=item.modifier ?? null
            const mvariant=item.modifier_variant ?? 0
            if(sname)return [sname, svariant, mname, mvariant]
        }
        return null
    }

    /**
     * Read field data from a field that hold factories and modifiers data in his items
     * @param {Puissance4} field 
     * @returns {ItemFieldContent}
     */
    static to_field_data(field){
        return ItemField.read_field(field.width, field.height, (x,y)=>this.to_data(field.get(x,y)??null))
    }

}