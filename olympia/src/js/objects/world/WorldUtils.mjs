import { Vector3 } from "../../../../../babylonjs/core/index.js"
import { fromVectorLike } from "../../typeutils/VectorLike.mjs"
import { TransformModel } from "../model/TransformModel.mjs"
import { World } from "./World.mjs"


/**
 * 
 * @param {string} map 
 * @param {[number,number]} position 
 * @param {[number,number]} size 
 * @param {(letter:string, pos:[number,number], size:[number,number])=>void} factory
 * @param {number} wordLength The number of characters per tile
 * @param {boolean} isSizeOfTile Is the given size the size for the tile or the size for the whole map 
 */
export function forMap(map, position, size, factory, wordLength=1, isSizeOfTile=false){

    // Separate Lines
    let lines=[]
    let acc=""
    for(let i=0; i<map.length; i++){
        const char=map[i]
        if(char==='\n'){
            lines.push(acc)
            acc=""
        }
        else if(char===']'){
            acc=""
        }
        else{
            acc+=char
        }
    }
    lines.push(acc)

    // Create Matrix
    /** @type {Array<Array<string?>>} */
    let table=[]
    let column=[]
    let width=0
    let height=0
    let widtha=0
    big:for(let y=0; y<lines.length; y++){
        let line=lines[y]
        for(let x=0; x<line.length; x++){
            if(line.length-x<wordLength)line+="   "
            const letter=line.substring(x,x+wordLength)
            x+=wordLength-1
            widtha++
            column.push(letter)
        }
        height++
        width=Math.max(width, widtha)
        widtha=0
        table.push(column)
        column=[]
    }

    const get_size= (x,y)=>{
        let height=1, width=1
        while(table[y]?.[x+width]?.[0]=="-") width++
        while(table[y+height]?.[x]?.[0]=="|") height++
        for(let xx=0; xx<width; xx++){
            for(let yy=0; yy<height; yy++){
                if(table[y+yy]?.[x+xx]!==undefined)table[y+yy][x+xx]=null
            }
        }

        return [width,height]
    }

    // Map
    /** @type {[number,number]} */
    let cellsize
    if(isSizeOfTile) cellsize=size
    else cellsize=[size[0]/width, size[1]/height]
    for(let y=0; y<table.length; y++){
        for(let x=0; x<table[y].length; x++){
            var letter=table[y][x]
            if(letter===null)continue
            let size=get_size(x,y)
            factory(letter, [position[0]+x*cellsize[0], position[1]+y*cellsize[1]], [cellsize[0]*size[0], cellsize[1]*size[1]])
        }
    }
}


function codeToNum(code){
    if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
    else if('A'.charCodeAt(0)<=code && code<='Z'.charCodeAt(0))return code-'A'.charCodeAt(0)+11
    else throw new Error("Invalid number value. Should match [0-9A-Z]")
}

/** @typedef {import("../world/TaggedDict.mjs").Tag} Tag */
/** @typedef {import("./ModelHolder.mjs").ModelAndKey} ModelAndKey */

/**
 * @typedef {import("../../typeutils/VectorLike.mjs").VectorLike} VectorLike
 * @typedef {{
 *  tags?: Array<Tag> | (()=>Array<Tag>),
 *  models?: ()=>Array<ModelAndKey>,
 *  size?: VectorLike | ((it:Vector3)=>VectorLike),
 *  position?: ((it:Vector3, tilesize:Vector3)=>VectorLike),
 *  rotation?: ()=>VectorLike
 * }} ObjectDefinition
 */

/**
 * 
 * @param {object} options
 * @param {Vector3} options.tile_size
 * @param {Vector3=} options.position
 * @param {Object.<string,ObjectDefinition>} options.objects
 * @param {Array<string>|string} options.maps
 * @param {number=} options.name_length
 * @param {World} options.world
 * 
 */
export function createLevel(options){
    const name_length=options.name_length??1
    const position=options.position ?? Vector3.Zero()

    if(!(options.world instanceof World))throw new Error("options.world should be an instance of World")
    if(!(options.tile_size instanceof Vector3))throw new Error("options.tile_size should be an instance of Vector3")
    if(!(position instanceof Vector3))throw new Error("options.position should be an instance of Vector3")
    if(!options.objects)throw new Error("options.objects should be defined")
    if(Object.keys(options.objects).findIndex(it=>it.length!=name_length)!=-1)throw new Error("At least one object have a name with a different length than options.name_length")
    if(!Array.isArray(options.maps)) options.maps=[options.maps]
    for(const map of options.maps){
        forMap(map, [0,0], [1,1], (letter, pos, size)=>{
            if(letter[0]===' ')return

            // Object type
            const object=options.objects[letter.substring(0,name_length)]
            if(!object)throw new Error(`Object ${letter} not found`)
            
            const tags= object.tags ? (Array.isArray(object.tags) ? object.tags : object.tags()) : []

            const dim_transform = object.size ? ( (object.size instanceof Vector3 || Array.isArray(object.size)) ? it=>object.size : object.size) : it=>it

            const pos_transform= object.position ? object.position : it=>it

            const models= object.models?.() ?? []

            const rotation= fromVectorLike(object.rotation?.()) ?? Vector3.Zero()

            // Position and dimension
            let foot_height=codeToNum(letter.charCodeAt(name_length))
            let size_height=codeToNum(letter.charCodeAt(name_length+1))

            let tile_dimension=options.tile_size.multiplyByFloats(size[0], size_height, size[1])
            let dimension=fromVectorLike(dim_transform(tile_dimension))

            let coordinates=position.add(new Vector3(
                -pos[0]*options.tile_size.x-tile_dimension.x/2,
                options.tile_size.y*foot_height+tile_dimension.y/2, 
                pos[1]*options.tile_size.z+tile_dimension.z/2
            ))
            coordinates=fromVectorLike(pos_transform(coordinates,tile_dimension))
            
            options.world.add(tags, new TransformModel({rotation, position:coordinates, scale:dimension}), ...models)
        }, 2+name_length, true)
    }
}