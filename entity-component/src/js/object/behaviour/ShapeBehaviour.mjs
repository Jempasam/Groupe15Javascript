import { AABB, spherePenetrationSphere } from "../../collision/AABB.mjs";
import { CircleShape, Shape } from "../../collision/Shape.mjs";
import { Behaviour } from "./Behaviour.mjs";

export class ShapeBehaviour extends Behaviour{

    /**
     * 
     * @param {Shape} shape 
     */
    constructor(shape){
        super()
        this.shape=shape
    }

    /** @override */
    init(world, objects){
        for(let obj of objects){
            obj.x=0
            obj.y=0
            obj.z=0
            obj.size=1
            obj._shape=this.shape.clone()
            obj.get_shape=()=>{
                obj._shape.place(obj.x,obj.y,obj.z,obj.size)
                return obj._shape
            }
        }
    }

    /** @override */
    tick(world, objects){
    }


    /** @override */
    finish(world, objects){
    }

    
}