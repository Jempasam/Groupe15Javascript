import { Behaviour } from "../Behaviour.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"

export class DisappearBehaviour extends Behaviour{

    /**
     * @param {object} options
     * @param {number=} options.disappearing_time Le temps de disparition
     */
    constructor({disappearing_time=20}={}){
        super()
        this.disappearing_time=disappearing_time
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects, targets, ...rest){
        for(const obj of objects)
            obj.getOrSet([DISAPPEAR,this.uid],()=>({lifetime:this.disappearing_time}))
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply2([DISAPPEAR,this.uid], TRANSFORM, (d,t)=>{
                if(d.lifetime<=0){
                    obj.kill()
                }
                else{
                    t.scale.scaleInPlace(1-1/d.lifetime)
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
        for(const obj of objects) obj.remove([DISAPPEAR,this.uid])
    }
}


/** @type {ModelKey<{lifetime:number}>} */
export const DISAPPEAR=new ModelKey("disappear")