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
import { DisappearBehaviour } from "../../objects/behaviour/size/DisappearBehaviour.mjs";
import { TEAM, Team } from "../../objects/model/TeamModel.mjs";
import { EffectPack } from "./EffectPack.mjs";
import { TRANSFORM, TransformModel } from "../../objects/model/TransformModel.mjs";
import { Vector2, Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";



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
        this._registerNames()
    }

    // Teams
    good=new Team("good")
    bad=new Team("bad")

    // Contact Damage
    small_damage= this.behav( tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(1) })
    )
    medium_damage= this.behav( tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(2) })
    )
    big_damage= this.behav( tags(()=>this._living.living.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>{ t.get(LIVING)?.damage(3) })
    )
    

    // Contact Knockback
    /** @param {GameObject} o @param {GameObject} t @param {number} force*/
    _knockback(o,t,force){
        const from=o.get(TRANSFORM) ; if(!from)return
        const to=t.get(TRANSFORM) ; if(!to)return
        const mv=t.get(MOVEMENT) ; if(!mv)return
        const offset=to.position.subtract(from.position).multiplyByFloats(1,0,1).normalize().scaleInPlace(force)
        accelerate(mv.inertia, offset.x, offset.y, offset.z, force, force, force)
    }
    small_knockback= this.behav( tags(()=>this._living.hitable.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.2))
    )
    medium_knockback= this.behav( tags(()=>this._living.hitable.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.4))
    )
    large_knockback= this.behav( tags(()=>this._living.hitable.id),
        behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>this._knockback(o,t,0.8))
    )
    
    // Contact effect
    flaming=this.behav(behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>t.addTag(this._effect.timed_burning.id)))
    slowing=this.behav(behaviourOnContact({target:ContactTarget.ONLY_ENNEMIES}, (o,t)=>t.addTag(this._effect.timed_slowed.id)))
    explode=this.behav(behaviourTimeout(40,(o,world)=>{
        o.kill()
        const boom=world.add(this.EXPLOSION(),
            o.apply(TRANSFORM, tf=>new TransformModel({copied:tf,scale:tf.scale.scale(3)}))??null,
            o.apply(TEAM, t=>Team.HATEFUL)??null
        )
    }))

    // Compilations
    SMALL_SLASH= this.lazy(()=>[...this._physic.MOVING_GHOST(), this.small_damage.id, this.small_knockback.id, this._particle.vanish_after_half.id, this._models.slash.id])
    PINGPONG= this.lazy(()=>[...this._physic.MOVING_GHOST(), this.large_knockback.id, this._particle.vanish_after_one.id, this._models.pingpong.id])
    LARGE_SLASH= this.lazy(()=>[...this._physic.MOVING_GHOST(), this.medium_damage.id, this.large_knockback.id, this._particle.vanish_after_one.id, this._models.slash.id])
    FIREBALL= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), this.medium_damage.id, this.small_knockback.id, this._particle.vanish_after_one.id, this._particle.smoke_emitter.id, this._particle.fire_emitter.id, this.flaming.id, this._models.fire.id])
    EXPLOSION= this.lazy(()=>[...this._physic.STATIC_GHOST(), this._particle.appear.id, this._models.sphere_explosion.id, this.small_damage.id, this.medium_knockback.id, this._particle.vanish_after_one.id, this._particle.smoke_emitter.id, this._particle.fire_emitter.id])
    BOMB= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), this.explode.id, this._models.bomb.id])
    DROPLET= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), this._models.droplet.id, this.medium_knockback.id, this._particle.vanish_on_collision.id, this._particle.vanish_after_four.id])

    // Invocation
    droplet_summoner=this.behav(behaviourInterval(60,behaviourEach( (o,w) =>{
        const tf= o.get(TRANSFORM); if(!tf)return
        const under= tf.position.add(new Vector3(0,-tf.scale.y-0.2,0))
        w.add(this.DROPLET(), new TransformModel({copied:tf,position:under}), Team.HATEFUL)
    })))
}