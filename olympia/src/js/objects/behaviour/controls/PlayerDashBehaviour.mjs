import { MOVEMENT, MovementModel, accelerateX, accelerateY, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { isKeyPressed} from "../../../controls/Keyboard.mjs"
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";
import { ModelKey } from "../../world/GameObject.mjs";

export class PlayerDashBehaviour extends Behaviour{

    /**
     * 
     * @param {string} key 
     * @param {number} strength 
     * @param {number} cooldown
     * @param {number} dash_count
     * @param {string[]=} particle
     */
    constructor(key, strength, cooldown, dash_count, particle=undefined){
        super()
        this.key=key
        this.strength=strength
        this.cooldown=cooldown
        this.dash_count=dash_count
        this.particle=particle
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.getOrSet(DASH,()=>new DashModel())
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const dash=obj.get(DASH); if(!dash)continue
            const movement=obj.get(MOVEMENT); if(!movement)continue
            if(dash.load_cooldown<=0){
                if(isKeyPressed(this.key) && dash.remaining_dash>0){
                    obj.apply(MOVEMENT, move=>{
                        const direction=move.inertia.clone()
                        direction.y=0
                        direction.normalize()
                        direction.scaleInPlace(this.strength)
                        console.log(direction)
                        accelerateX(move.inertia, direction.x*2, Math.abs(direction.x))
                        accelerateZ(move.inertia, direction.z*2, Math.abs(direction.z))
                        const particle=this.particle
                        if(particle)obj.apply(TRANSFORM, tf=>{
                            world.add(particle, new TransformModel({copied:tf}))
                        })
                    })
                    dash.load_cooldown=10
                    dash.cooldown=this.cooldown
                    dash.remaining_dash--
                }
            }
            else dash.load_cooldown--
            
            if(dash.cooldown==0)dash.remaining_dash=this.dash_count
            if(dash.cooldown>=0)dash.cooldown--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            obj.remove(DASH)
        }
    }
}

export class DashModel{
    load_cooldown=0
    cooldown=0
    remaining_dash=0
}

/** @type {ModelKey<DashModel>} */
export const DASH=new ModelKey("dash")