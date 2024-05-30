import { Behaviour } from "../Behaviour.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { removeEquip, removeTag } from "../../model/SlotModel.mjs"

export class AppearBehaviour extends Behaviour{

    /**
     * @param {object} options
     * @param {number=} options.appearing_time Le temps de disparition
     */
    constructor({appearing_time=20}={}){
        super()
        this.appearing_time=appearing_time
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects, targets, ...rest){
        for(const obj of objects){
            obj.apply(TRANSFORM, t=>{
                const mindim=Math.min(t.scale.x,t.scale.y,t.scale.z)
                const growth=mindim/(this.appearing_time+1)
                obj.getOrSet([APPEAR,this.uid],()=>({lifetime:this.appearing_time, growth}))
                t.scale.subtractFromFloatsToRef(growth*this.appearing_time, growth*this.appearing_time, growth*this.appearing_time, t.scale)
                console.log(growth)
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply2([APPEAR,this.uid], TRANSFORM, (d,t)=>{
                if(d.lifetime<=0){
                    removeTag(obj, ...obj.tags)
                }
                else{
                    t.scale.addInPlaceFromFloats(d.growth,d.growth,d.growth)
                    d.lifetime--
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects) obj.remove([APPEAR,this.uid])
    }
}


/** @type {ModelKey<{lifetime:number, growth:number}>} */
export const APPEAR=new ModelKey("appear")