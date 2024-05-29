import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourInit } from "../../objects/behaviour/Behaviour.mjs";
import { SummonerBehaviour } from "../../objects/behaviour/invocation/SummonerBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";
import { PhaseBehaviour } from "../../objects/behaviour/generic/PhaseBehaviour.mjs";
import { LivingModel } from "../../objects/model/LivingModel.mjs";
import { MESH } from "../../objects/model/MeshModel.mjs";
import { MovementModel } from "../../objects/model/MovementModel.mjs";
import { TEAM, Team } from "../../objects/model/TeamModel.mjs";
import { TRANSFORM, TransformModel } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { IAPack } from "./IAPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PlayerPack } from "./PlayerPack.mjs";
import { SoilPack } from "./SoilPack.mjs";
import { NAME } from "../../objects/behaviour/life/LifeBarBehaviour.mjs";

/**
 * Un pack de behaviours de modèles de base
 */
export class MonsterPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {FightPack} fight
     * @param {IAPack} ia
     * @param {PlayerPack} player
     * @param {SoilPack} soil
     */
    constructor(world, fight, ia, player, soil){
        super(world)
        this._fight=fight
        this._ia=ia
        this._models=fight._models
        this._physic=fight._physic
        this._living=fight._living
        this._effect=fight._effect
        this._particle=fight._living._particle
        this._player=player
        this._soil=soil
        this._registerNames()
    }

    // Effects
    fire_summoner=this.behav(behaviourInterval(10,behaviourEach( (o,w) =>{
        w.add([...this._physic.STATIC_GHOST(), ...this._soil.FIRE(), this._particle.vanish_after_four.id], new TransformModel({copied:o.get(TRANSFORM)}))
    })))

    barril_summoner=this.behav(behaviourInterval(15,behaviourEach( (o,w) =>{
        const tf= o.get(TRANSFORM); if(!tf)return
        const under= tf.position.add(new Vector3(0,-tf.scale.y-0.2,0))
        w.add([...this._physic.PHYSIC_FALLING(), ...this._living.WOOD_DESTRUCTIBLE(), this._models.barril.id], new TransformModel({copied:tf,position:under}), Team.HATEFUL)
    })))

    lava_summoner=this.behav(behaviourInterval(40,behaviourEach( (o,w) =>{
        const tf= o.get(TRANSFORM); if(!tf)return
        const under= tf.position.add(new Vector3(0,-tf.scale.y-0.2,0))
        w.add([...this._physic.PHYSIC_FALLING(), ...this._soil.LAVA(), this._particle.spread_animation_slow.id, this._particle.vanish_after_eight.id], new TransformModel({copied:tf,position:under}))
    })))

    bomb_summoner=this.behav(behaviourInterval(20,behaviourEach( (o,w) =>{
        const tf= o.get(TRANSFORM); if(!tf)return
        const under= tf.position.add(new Vector3(0,-tf.scale.y,0))
        w.add([...this._fight.BOMB()], new TransformModel({copied:tf, position:under}), o.get(TEAM))
    })))

    bomb_rain_summoner=this.behav(behaviourInterval(30,behaviourEach( (o,w) =>{
        const tf= o.get(TRANSFORM); if(!tf)return
        const under= tf.position.add(new Vector3(0,tf.scale.y,0))
        w.add([...this._fight.BOMB()], new TransformModel({copied:tf, position:under}), new MovementModel(new Vector3(Math.random()-0.5, 0, Math.random()-0.5)), o.get(TEAM))
    })))

    // MOVEMENT
    RUNNING= this.lazy(()=>[...this._physic.PHYSIC_FALLING_SLIDE(), ...this._living.LIVING(), this._ia.follow_fast.id])
    WALKING= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this._living.LIVING(), this._ia.follow_slow.id, this._ia.dodge_void.id])
    WALKING_FAST= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this._living.LIVING(), this._ia.follow.id, this._ia.dodge_void.id])
    MISSILLING= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), this._living.hitable.id, this._ia.follow_fast.id])
    WOLF_LIKE= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this._living.LIVING(), this._ia.rotate_and_jump.id, this._ia.dodge_void.id])
    EAGLE_LIKE= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), ...this._living.LIVING(), this._ia.fly_and_attack.id])
    FLY_FOLLOWING= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), ...this._living.LIVING(), this._ia.fly_and_follow.id])
    FLY_FOLLOWING_FAST= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), ...this._living.LIVING(), this._ia.fly_and_follow_fast.id])
    FLY_FOLLOWING_FAST_DOWN= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), ...this._living.LIVING(), this._ia.fly_and_follow_fast_down.id])
    MANTA_LIKE= this.lazy(()=>[...this._physic.PHYSIC(), ...this._living.LIVING(), this._ia.fly_through_from_far.id])
    SMALL_MANTA_LIKE= this.lazy(()=>[...this._physic.PHYSIC(), ...this._living.LIVING(), this._ia.rotate_and_jump.id])

    // Phases
    demon_phases=this.behav(()=>new PhaseBehaviour(
        {tags:[...this.WALKING_FAST()], duration:100},
        {tags:[...this._physic.PHYSIC_FALLING(), this._particle.water_emitter.id], duration:100},
        {tags:[...this._physic.PHYSIC_FALLING(), this._particle.fire_emitter.id, this.basketball_summoner.id], duration:100, probability:.5}
    ))

    firebird_phases=this.behav(()=>new PhaseBehaviour(
        {tags:[...this.FLY_FOLLOWING_FAST(), this.bomb_summoner.id], duration: 200}, // Bomb follow

        {tags:[...this.FLY_FOLLOWING_FAST_DOWN(), this.fire_summoner.id], duration: 200}, // Fire follow

        {tags:[...this._physic.MOVING_GHOST_FRICTION(), this._physic.anti_gravity.id, this.basketball_summoner.id], duration: 30}, // Slow bomb follow + basketballs
        {tags:[...this._physic.MOVING_GHOST_FRICTION(), this.basketball_summoner.id], duration: 100},
        {tags:[...this.FLY_FOLLOWING(), this.bomb_summoner.id], duration: 100},
        {tags:[...this._physic.MOVING_GHOST_FRICTION(), this.basketball_summoner.id], duration: 100},
        {tags:[...this.FLY_FOLLOWING(), this.bomb_summoner.id], duration: 100},

        {tags:[...this.FLY_FOLLOWING_FAST_DOWN(), this.fire_summoner.id, this.super_basketball_summoner.id], duration: 300}, // Fire follow + super basketballs

        {tags:[...this.FLY_FOLLOWING_FAST(), this.barril_summoner.id], duration: 200}, // Barrils summoner + Fire follow
        {tags:[...this.FLY_FOLLOWING_FAST_DOWN(), this.fire_summoner.id, this.super_basketball_summoner.id], duration: 200},
        {tags:[...this.FLY_FOLLOWING_FAST(), this.barril_summoner.id], duration: 200},
        {tags:[...this.FLY_FOLLOWING_FAST_DOWN(), this.fire_summoner.id, this.super_basketball_summoner.id], duration: 200},

        {tags:[...this.FLY_FOLLOWING_FAST(), this.barril_summoner.id], duration: 200}, // Barrils summoner + Bomb follow
        {tags:[...this.FLY_FOLLOWING_FAST(), this.bomb_summoner.id], duration: 200},

        {tags:[...this.FLY_FOLLOWING(), this.lava_summoner.id, this.super_basketball_summoner.id], duration: 400},
    ))

    // Monsters
    PANDA=this.lazy(()=>[...this.RUNNING(), this._models.panda.id, this._fight.small_damage.id, this._fight.small_knockback.id])
    KANGAROO=this.lazy(()=>[...this.WOLF_LIKE(), this._models.bad_kangaroo.id, this._fight.small_damage.id, this._fight.small_knockback.id])
    EAGLE=this.lazy(()=>[...this.EAGLE_LIKE(), this._models.bird.id, this._fight.small_damage.id, this._fight.small_damage.id])
    BASKETBALL=this.lazy(()=>[...this.MISSILLING(), this._models.basketball.id, this._particle.smoke_emitter.id, this._fight.small_damage.id, this._fight.small_knockback.id, this._particle.vanish_after_eight.id])
    SUPER_BASKETBALL=this.lazy(()=>[...this.MISSILLING(), this._models.basketball.id, this._particle.fire_emitter.id, this.fire_summoner.id, this._fight.medium_damage.id, this._fight.medium_knockback.id, this._particle.vanish_after_sixteen.id])

    DEMON=this.lazy(()=>[this.demon_phases.id, this._models.demon.id, this._fight.small_damage.id, this._fight.medium_knockback.id])
    SPHINX=this.lazy(()=>[...this.WALKING(), this._models.sphinx.id, this._fight.medium_damage.id, this._fight.large_knockback.id])
    FIREBIRD=this.lazy(()=>[this.firebird_phases.id, this._models.aigle_feu_moche.id, this._living.lifebar.id, this._fight.small_damage.id, this._fight.small_knockback.id, this._effect.fire_immune.id])

    // Monsters Definition
    $FIREBIRD=this.lazyDef(()=>({tags:this.FIREBIRD(), models:()=>[new LivingModel(20),[NAME,"Firebird"]]}))

    // Invocations
    panda_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.PANDA(), size:[.5,.5,.5]}, 3, 100, 15, 30))
    kangaroo_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.KANGAROO(), size:[.5,.5,.5]}, 3, 100, 15, 30))
    bird_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.EAGLE(), size:[.3,.3,.3]}, 3, 100, 15, 30))
    basketball_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.BASKETBALL(), size:[.3,.3,.3]}, 4, 30, 15, 30))
    super_basketball_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.SUPER_BASKETBALL(), size:[.5,.5,.5]}, 1, 100, 20, 60))
    
    demon_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.DEMON(), size:[.5,.75,.5]}, 1, 100, 20, 60))
    sphinx_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {tags:this.SPHINX(), models:()=>[new LivingModel(10)], size:[1,1,1]}, 1, 100, 20, 60))

    // Boss invocations
    firebird_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour( {...this.$FIREBIRD(), size:[1,1,1]}, 1, 100, 20, 60, 1))
}