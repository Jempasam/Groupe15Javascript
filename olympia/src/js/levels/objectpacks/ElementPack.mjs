import { JUMP } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { PoisonBehaviour } from "../../objects/behaviour/effect/PoisonBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { TimedBehaviour } from "../../objects/behaviour/generic/TimedBehaviour.mjs";
import { MOVEMENT } from "../../objects/model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { SoilPack } from "./SoilPack.mjs";
import { ElementBehaviour } from "../../objects/behaviour/ElementBehaviour.mjs";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";


/**
 * Un pack de behaviours de base d'éléments
 */
export class ElementPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {SoilPack} soil
     * @param {FightPack} fight
     */
    constructor(world,soil,fight){
        super(world)
        this._soil=soil
        this._effect=soil._effect
        this._particle=soil._particle
        this._models=soil._models
        this._fight=fight
        this._physic=fight._physic
        this._registerNames()
    }

    // Flame summoning
    fire_summoner=this.behav(behaviourInterval(10,behaviourEach( (o,w) =>{
        w.add([...this._physic.STATIC_GHOST(), ...this._soil.FIRE(), this._particle.vanish_after_four.id], new TransformModel({copied:o.get(TRANSFORM)}))
    })))

    // Elemental Affliction
    FLAME_EFFECT= this.lazy(()=>[this._effect.give_burning.id, this._particle.fire_emitter.id, this._models.flame.id, this.fire_summoner.id])
    WATER_EFFECT= this.lazy(()=>[this._effect.give_slowed.id, this._particle.water_emitter.id, this._models.droplet.id])
    AIR_EFFECT= this.lazy(()=>[this._fight.large_knockback.id, this._particle.smoke_emitter.id, this._models.wind.id])
    
    // Elemental Affliction Timed
    timed_flame=this.behav(()=>new TimedBehaviour(40, this.FLAME_EFFECT()))
    timed_water=this.behav(()=>new TimedBehaviour(60, this.WATER_EFFECT()))
    timed_air=this.behav(()=>new TimedBehaviour(60, this.AIR_EFFECT()))

    // Elements
    element_flame=this.behav( ()=>new ElementBehaviour(1.5, 0.8, 0.8, [this.timed_flame.id], [this._effect.fire_immune.id]) )
    element_water=this.behav( ()=>new ElementBehaviour(1, 1, 0.5, [this.timed_water.id], []) )
    element_air=this.behav( ()=>new ElementBehaviour(0.6, 1.5, 1, [this.timed_air.id], [] ) )
}