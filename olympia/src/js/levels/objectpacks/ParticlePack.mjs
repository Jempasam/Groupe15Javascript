import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { SimpleParticleBehaviour } from "../../objects/behaviour/particle/SimpleParticleBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { PhysicPack } from "./PhysicPack.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { DisappearBehaviour } from "../../objects/behaviour/DisappearBehaviour.mjs";
import { behaviourTimeout } from "../../objects/behaviour/generic/TimeoutBehaviour.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_COLLISION } from "../../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";

/**
 * Un pack de behaviours de base avec des comportements de particules
 */
export class ParticlePack extends ObjectPack{

    /**
     * @param {World} world
     * @param {PhysicPack} physic
     * @param {ModelPack} models
     */
    constructor(world,physic,models){
        super(world)
        this._physic=physic
        this._models=models
    }

    // Particle Movements
    up_grow= this.behav(new SimpleParticleBehaviour(new Vector3(0,0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40))
    up_vanish= this.behav(new SimpleParticleBehaviour(new Vector3(0,0.05,0), new Vector3(0,0.05,0), new Vector3(0.97,0.97,0.97), 40))
    stay= this.behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))
    spread= this.behav(new SimpleParticleBehaviour(Vector3.Zero(), Vector3.Zero(), new Vector3(1.1,1.05,1.1), 20))
    down_grow= this.behav(new SimpleParticleBehaviour(new Vector3(0,-0.01,0), new Vector3(0,0.1,0), new Vector3(1.03,1.03,1.03), 40))
    down_vanish= this.behav(new SimpleParticleBehaviour(new Vector3(0,-0.05,0), new Vector3(0,0.05,0), new Vector3(0.97,0.97,0.97), 40))

    // Dispearrance
    vanish= this.behav(new DisappearBehaviour({disappearing_time:5}))
    vanish_while_half= this.behav(new DisappearBehaviour({disappearing_time:10}))
    vanish_while_one= this.behav(new DisappearBehaviour({disappearing_time:20}))
    vanish_while_two= this.behav(new DisappearBehaviour({disappearing_time:40}))
    vanish_while_four= this.behav(new DisappearBehaviour({disappearing_time:80}))

    vanish_after_half= this.behav(behaviourTimeout(10, o=>o.addTag(this.vanish.id) ))
    vanish_after_one= this.behav(behaviourTimeout(20, o=>o.addTag(this.vanish.id) ))
    vanish_after_two= this.behav(behaviourTimeout(40, o=>o.addTag(this.vanish.id) ))
    vanish_after_four= this.behav(behaviourTimeout(80, o=>o.addTag(this.vanish.id) ))
    vanish_on_collision= this.behav(behaviourObserve(ON_COLLISION, o=>o.addTag(this.vanish.id) ))

    // Animation
    spread_animation=this.behav(behaviourEach(o=>o.apply(TRANSFORM, t=>t.scale.multiplyInPlace(new Vector3(1.01,0.98,1.01)) )))

    // Bases
    UP_GROW= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.up_grow.id])
    UP_VANISH= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.up_vanish.id])
    STAY= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.stay.id])
    SPREAD= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.spread.id])
    DOWN_GROW= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.down_grow.id])
    DOWN_VANISH= this.lazy(()=>[...this._physic.MOVING_NOCOLLISION(), this.down_vanish.id])

    // Particles
    FIRE= this.lazy(()=>[...this.UP_VANISH(), this._models.flame.id])
    SMOKE= this.lazy(()=>[...this.UP_GROW(), this._models.smoke.id])
    CLOUD= this.lazy(()=>[...this.STAY(), this._models.smoke.id])
    WIND= this.lazy(()=>[...this.SPREAD(), this._models.wind.id])
    PROPULSION= this.lazy(()=>[...this.DOWN_GROW(), this._models.smoke.id])
    WATER= this.lazy(()=>[...this.DOWN_VANISH(), this._models.water.id])
    BLOOD= this.lazy(()=>[...this.DOWN_VANISH(), this._models.blood.id])
    SLASH= this.lazy(()=>[...this.STAY(), this._models.slash.id])

    // Emitters
    smoke_emitter= this.behav(()=>new EmitterBehaviour(this.CLOUD(), new Vector3(0.5, 0.5, 0.5), 5))
    cloud_emitter= this.behav(()=>new EmitterBehaviour(this.CLOUD(), new Vector3(0.5, 0.5, 0.5), 5))
    fire_emitter= this.behav(()=>new EmitterBehaviour(this.FIRE(), new Vector3(0.5, 0.5, 0.5), 5))
    slash_emitter= this.behav(()=>new EmitterBehaviour(this.SLASH(), new Vector3(0.5, 0.5, 0.5), 5))
    wind_emitter= this.behav(()=>new EmitterBehaviour(this.WIND(), new Vector3(0.5, 0.5, 0.5), 5))

}