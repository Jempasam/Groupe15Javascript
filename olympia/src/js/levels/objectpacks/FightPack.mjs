import { behaviourTimeout } from "../../objects/behaviour/generic/TimeoutBehaviour.mjs";
import { ProjectileBehaviour } from "../../objects/behaviour/life/ProjectileBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { ContactTarget, behaviourOnContact } from "../../objects/behaviour/generic/OnContactBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { behaviour } from "../../objects/behaviour/Behaviour.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT, accelerate } from "../../objects/model/MovementModel.mjs";
import { GameObject } from "../../objects/world/GameObject.mjs";
import { DisappearBehaviour } from "../../objects/behaviour/DisappearBehaviour.mjs";
import { Team } from "../../objects/model/TeamModel.mjs";
import { EffectPack } from "./EffectPack.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { Vector2 } from "../../../../../babylonjs/core/index.js";



/**
 * Un pack de behaviours de base pour la gestion des combats et des équipes
 */
export class FightPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {LivingPack} living
     * @param {EffectPack} effect
     */
    constructor(world,living,effect){
        super(world)
        this._living=living
        this._physic=living._particle._physic
        this._models=living._particle._models
        this._particle=living._particle
        this._effect=effect
    }

    // Teams
    good=new Team("good")
    bad=new Team("bad")

    // Contact Damage
    small_damage= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(1) })
    )
    medium_damage= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(2) })
    )
    big_damage= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(3) })
    )
    

    // Contact Knockback
    /** @param {GameObject} o @param {GameObject} t @param {number} force*/
    _knockback(o,t,force){
        const from=o.get(TRANSFORM) ; if(!from)return
        const to=t.get(TRANSFORM) ; if(!to)return
        const mv=t.get(MOVEMENT) ; if(!mv)return
        const offset=to.position.subtract(from.position).multiplyByFloats(1,0,1).normalize().scaleInPlace(force)
        console.log(offset.asArray())
        accelerate(mv.inertia, offset.x, offset.y, offset.z, force, force, force)
    }
    small_knockback= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.1))
    )
    medium_knockback= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.2))
    )
    large_knockback= this.behav(tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.4))
    )
    
    // Contact effect
    flaming=this.behav(behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>t.addTag(this._effect.in_fire.id)))
    slowing=this.behav(behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>t.addTag(this._effect.slowness.id)))

    // Compilations
    SMALL_SLASH= this.lazy(()=>[...this._physic.MOVING_GHOST(), this.small_damage.id, this.small_knockback.id, this._particle.vanish_after_half.id, this._models.slash.id])
    LARGE_SLASH= this.lazy(()=>[...this._physic.MOVING_GHOST(), this.medium_damage.id, this.large_knockback.id, this._particle.vanish_after_one.id, this._models.slash.id])
    FIREBALL= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), this.medium_damage.id, this.small_knockback.id, this._particle.vanish_after_one.id, this.flaming.id, this._models.fire.id])

}