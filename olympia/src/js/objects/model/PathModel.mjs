import { MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from "../../../../../babylonjs/core/index.js";
import { ModelKey } from "../world/ModelHolder.mjs";


export class PathModel{

    /** @type {1|2|3} */ static SOLID=1
    /** @type {1|2|3} */ static EMPTY=2
    /** @type {1|2|3} */ static MIXED=3

    out_access=0
    min_access=new Vector3(Infinity,Infinity,Infinity)
    max_access=new Vector3(-Infinity,-Infinity,-Infinity)
    
    /**
     * @param {Vector3} minimum
     * @param {Vector3} maximum
     * @param {(1|2|3)[][][]} content
     */
    constructor(minimum,maximum,content){
        this.minimum=minimum
        this.maximum=maximum
        this.size=maximum.subtract(minimum)
        this.content=content
    }

    /**
     * @param {Vector3} position
     * @param {number[]} target
     * @return {boolean}
     */
    _getPos(position,target){
        let inside=true
        if(position.x<this.minimum.x || position.y<this.minimum.y || position.z<this.minimum.z){
            position=position.clone().maximizeInPlace(this.minimum)
            inside=false
            this.out_access++
        }
        if(position.x>this.maximum.x || position.y>this.maximum.y || position.z>this.maximum.z){
            position=position.clone().minimizeInPlace(this.maximum)
            inside=false
            this.out_access++
        }
        this.min_access.minimizeInPlace(position)
        this.max_access.maximizeInPlace(position)
        target[0]=Math.floor((position.x-this.minimum.x)/this.size.x*(this.content.length-0.0001))
        target[1]=Math.floor((position.y-this.minimum.y)/this.size.y*(this.content[0].length-0.0001))
        target[2]=Math.floor((position.z-this.minimum.z)/this.size.z*(this.content[0][0].length-0.0001))
        return inside
    }

    /**
     * Get the content at the position.
     * @param {Vector3} position 
     * @returns {1|2|3}
     */
    get(position){
        let target=[0,0,0]
        this._getPos(position,target)
        return this.content[target[0]][target[1]][target[2]]
    }

    /**
     * Fill the content at this position
     */
    set(position,value){
        let target=[0,0,0]
        this._getPos(position,target)
        this.content[target[0]][target[1]][target[2]]=value
    }

    /**
     * Get the content of the zone.
     * @param {Vector3} from
     * @param {Vector3} to
     * @returns {1|2|3}
     */
    getBetween(from,to){
        let f=[0,0,0]
        this._getPos(from,f)
        let t=[0,0,0]
        this._getPos(to,t)

        let result=this.content[f[0]][f[1]][f[2]]
        for(let x=f[0]; x<=t[0]; x++){
            for(let y=f[1]; y<=t[1]; y++){
                for(let z=f[2]; z<=t[2]; z++){
                    let content=this.content[x][y][z]
                    if(result!=content) result=PathModel.MIXED
                }
            }
        }
        return result
    }

    /**
     * Set the content of the zone
     */
    setBetween(from,to,value){
        let f=[0,0,0]
        this._getPos(from,f)
        let t=[0,0,0]
        this._getPos(to,t)

        for(let x=f[0]; x<=t[0]; x++){
            for(let y=f[1]; y<=t[1]; y++){
                for(let z=f[2]; z<=t[2]; z++){
                    this.content[x][y][z]=value
                }
            }
        }
    }

    /**
     * @param {Scene} scene
     */
    show(scene){
        // Create the model grid
        if(!this.pathmodel){
            const scale=this.size.divide(new Vector3(
                this.content.length,
                this.content[0].length,
                this.content[0][0].length
            ))
            this.pathmodel=new TransformNode("aa",scene)
            const matierla=new StandardMaterial("path", scene)
            matierla.alpha=0.5
            this.modelarray=this.content.map(e=>e.map(e=>e.map(e=>undefined)))
            for(let x=0; x<this.content.length; x++)
            for(let y=0; y<this.content[x].length; y++)
            for(let z=0; z<this.content[x][y].length; z++){
                let value=this.content[x][y][z]
                let box=MeshBuilder.CreateBox("path", {size:1}, scene)
                box.material=matierla
                box.scaling.copyFrom(scale)
                box.position.set(
                    this.minimum.x+scale.x*x+scale.x/2,
                    this.minimum.y+scale.y*y+scale.y/2,
                    this.minimum.z+scale.z*z+scale.z/2
                )
                box.parent=this.pathmodel
                this.modelarray[x][y][z]=box
            }
        }

        for(let x=0; x<this.content.length; x++)
        for(let y=0; y<this.content[x].length; y++)
        for(let z=0; z<this.content[x][y].length; z++){
            let value=this.content[x][y][z]
            let model=this.modelarray[x][y][z]
            if(value==PathModel.SOLID){
                model.setEnabled(true)
            }
            else model.setEnabled(false)
        }
    }


}

/** @type {ModelKey<PathModel>} */
export const PATH=new ModelKey("path")