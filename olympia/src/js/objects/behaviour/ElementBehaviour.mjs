import { Behaviour } from "./Behaviour.mjs"
import { ON_JUMP } from "./controls/PlayerJumpBehaviour.mjs"
import { ON_DASH } from "./controls/PlayerDashBehaviour.mjs"
import { ON_SHOOT } from "./controls/PlayerShootBehaviour.mjs"
import { giveTag, removeTag } from "../model/SlotModel.mjs"
import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs"
import { GameObject } from "../world/GameObject.mjs"
import { MOVEMENT } from "../model/MovementModel.mjs"

/**
 * Inflige régulièrement des dégats avant de disparaitre.
 * Un second ObjectQuery peut être passé pour définir les objets immunisés.
 */

export class ElementBehaviour extends Behaviour{

    /**
     * @param {number} scale
     * @param {number} strength
     * @param {number} speed
     * @param {import('../world/TaggedDict.mjs').Tag[]} on_action
     * @param {import("../world/TaggedDict.mjs").Tag[]} constant
     * @param {import("../world/World.mjs").ObjectDefinition=} summoned 
     */
    constructor(scale, strength, speed, on_action, constant, summoned){
        super()
        this.scale=scale
        this.strength=strength
        this.speed=speed
        this.on_action=on_action
        this.constant=constant
        this.summoned=summoned
    }

    /** @override @type {Behaviour['init']} */
    init(_,objects){
        for(const obj of objects){
            giveTag(obj, ...this.constant)
            obj.observers(ON_JUMP).add(this.uid, (obj,{model})=>{
                obj.get(MOVEMENT)?.inertia.scaleInPlace(this.strength)
                model.cooldown*=this.speed
                giveTag(obj, ...this.on_action)
                this.summon(obj)
            })

            obj.observers(ON_DASH).add(this.uid, (obj,{model})=>{
                obj.get(MOVEMENT)?.inertia.scaleInPlace(this.strength)
                model.cooldown*=this.speed
                model.load_cooldown*=this.speed
                giveTag(obj, ...this.on_action)
                this.summon(obj)
            })

            obj.observers(ON_SHOOT).add(this.uid, (obj,{shooted,model})=>{
                shooted.get(TRANSFORM)?.scale?.scaleInPlace(this.scale)
                shooted.get(MOVEMENT)?.inertia.scaleInPlace(this.strength)
                model.cooldown*=this.speed
                model.reloading*=this.speed
                giveTag(shooted, ...this.on_action)
            })
        }
    }

    /**
     * @param {GameObject} obj 
     */
    summon(obj){
        if(this.summoned){
            const created= obj.world.addDef(this.summoned)
            const tf= created.getOrSet(TRANSFORM, ()=>new TransformModel({}))
            obj.apply(TRANSFORM, t=>tf.copyFrom(t))
        }
    }

    /** @override @type {Behaviour['tick']} */
    tick(){ }
    doTick=false

    /** @override @type {Behaviour['finish']} */
    finish(_,objects){
        for(const obj of objects){
            removeTag(obj, ...this.constant)
            obj.observers(ON_JUMP).remove(this.uid)
            obj.observers(ON_DASH).remove(this.uid)
            obj.observers(ON_SHOOT).remove(this.uid)
        }
    }
}