import { Behaviour } from "../Behaviour.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"

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
            obj.getOrSet([APPEAR,this.uid],()=>({lifetime:this.appearing_time}))
            obj.apply(TRANSFORM, t=>t.scale.scaleInPlace(1/20))
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
                    obj.kill()
                }
                else{
                    t.scale.scaleInPlace(20/this.appearing_time)
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


/** @type {ModelKey<{lifetime:number}>} */
export const APPEAR=new ModelKey("appear")