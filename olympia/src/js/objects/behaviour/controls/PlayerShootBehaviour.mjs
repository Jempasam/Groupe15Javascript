import { MOVEMENT, MovementModel, accelerateX, accelerateY, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { isKeyPressed} from "../../../controls/Keyboard.mjs"
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";
import { ModelKey } from "../../world/GameObject.mjs";

export class PlayerShootBehaviour extends Behaviour{

    /**
     * 
     * @param {string} key 
     * @param {number} strength 
     * @param {number} reloading_time
     * @param {string[]} particle_tags
     * @param {Vector3} size
     * @param {number=} shoot_count
     * @param {number=} cadency
     * @param {number=} knockback
     */
    constructor(key, strength, reloading_time, particle_tags, size, shoot_count=1, cadency=20, knockback=1){
        super()
        this.key=key
        this.strength=strength
        this.reloading_time=reloading_time
        this.particle_tags=particle_tags
        this.size=size
        this.shoot_count=shoot_count
        this.cadency=cadency
        this.knockback=knockback
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.getOrSet(SHOOTING,()=>({reloading:0, cooldown:0, munition:this.shoot_count}))
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const shooting=obj.get(SHOOTING); if(!shooting)continue
            const transform=obj.get(TRANSFORM) ?? new TransformModel({})
            if(shooting.cooldown<=0){
                if(isKeyPressed(this.key) && shooting.munition>0){
                    obj.apply2(MOVEMENT, TRANSFORM, (move,tf)=>{
                        const direction=move.inertia.clone()
                        direction.y=0
                        direction.normalize()
                        const knockback=direction.clone().scale(-this.knockback)
                        const inertia=direction.scale(this.strength)

                        accelerateX(move.inertia, knockback.x*2, Math.abs(knockback.x))
                        accelerateZ(move.inertia, knockback.z*2, Math.abs(knockback.z))
                        
                        const bullet_location=transform.position.clone().addInPlaceFromFloats(
                            (tf.scale.x/2+this.size.x/2)*direction.x,
                            0,
                            (tf.scale.z/2+this.size.z/2)*direction.z,
                        )

                        world.add(
                            this.particle_tags,
                            new TransformModel({position:bullet_location, scale:this.size.clone(), rotation:tf.rotation.clone()}),
                            [MOVEMENT,new MovementModel(inertia)],
                        )
                    })
                    shooting.cooldown=this.cadency
                    shooting.reloading=this.reloading_time
                    shooting.munition--
                }
            }
            else shooting.cooldown--
            
            if(shooting.reloading==0)shooting.munition=this.shoot_count
            if(shooting.reloading>=0)shooting.reloading--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            obj.remove(SHOOTING)
        }
    }
}


/** @type {ModelKey<{reloading:number, cooldown:number, munition:number}>} */
export const SHOOTING=new ModelKey("shoot")