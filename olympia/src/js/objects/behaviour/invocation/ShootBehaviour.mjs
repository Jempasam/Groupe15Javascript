import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, MovementModel, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { TEAM } from "../../model/TeamModel.mjs";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { invocate } from "./invocations.mjs";

/**
 * Fait tirer un objet lors de l'appui sur une touche
 */
export class ShootBehaviour extends Behaviour{

    /**
     * @param {string?} key La touche à presser pour tirer
     * @param {import("./invocations.mjs").Invocation} invocation Le projectile invoqué
     * @param {object} param0
     * @param {number=} param0.strength La force du tir
     * @param {number=} param0.reloading_time Le temps de rechargement
     * @param {number=} param0.shoot_count Le nombre de projectiles tirable à chaque rechargement
     * @param {number=} param0.cadency La cadence de tir
     * @param {number=} param0.knockback Le recul infligé au tireur
     */
    constructor(key, invocation, {strength=0.1, reloading_time=40, shoot_count=1, cadency=20, knockback=1}={}){
        super()
        this.key=key
        this.strength=strength
        this.reloading_time=reloading_time
        this.invocation=invocation
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
            if(shooting.cooldown<=0){
                if((this.key==null || isKeyPressed(this.key)) && shooting.munition>0){
                    obj.apply2(MOVEMENT, TRANSFORM, (move,tf)=>{
                        const direction=move.inertia.clone()
                        direction.y=0
                        direction.normalize()
                        const knockback=direction.clone().scale(-this.knockback)
                        const inertia=direction.scale(this.strength)

                        accelerateX(move.inertia, knockback.x*2, Math.abs(knockback.x))
                        accelerateZ(move.inertia, knockback.z*2, Math.abs(knockback.z))
                        
                        const projectile=invocate(world, obj, this.invocation,
                            new MovementModel(inertia),
                        )
                        projectile.apply(TRANSFORM, tfproj=>{
                            tfproj.position.copyFrom(tf.position.clone().addInPlaceFromFloats(
                                (tf.scale.x/2+tfproj.scale.x/2)*direction.x,
                                0,
                                (tf.scale.z/2+tfproj.scale.z/2)*direction.z,
                            ))
                        })
                        
                        obj.observers(ON_SHOOT).notify({shooter:obj, shooted:projectile, model:shooting})
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

/** @typedef {{reloading:number, cooldown:number, munition:number}} ShootModel */
/** @type {ModelKey<ShootModel>} */
export const SHOOTING=new ModelKey("shoot")

/** @type {ObserverKey<{shooter:GameObject,shooted:GameObject,model:ShootModel}>} */
export const ON_SHOOT=new ObserverKey("on_shoot")