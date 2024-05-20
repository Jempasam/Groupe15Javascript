import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { SummonerBehaviour } from "../../objects/behaviour/SummonerBehaviour.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { behaviourInterval } from "../../objects/behaviour/generic/IntervalBehaviour.mjs";
import { LivingModel } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM, TransformModel } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { IAPack } from "./IAPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PlayerPack } from "./PlayerPack.mjs";
import { SoilPack } from "./SoilPack.mjs";

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
        this._particle=fight._living._particle
        this._player=player
        this._soil=soil
    }

    // Effects
    fire_summoner=this.behav(behaviourInterval(10,behaviourEach( (o,w) =>{
        w.add([...this._physic.STATIC_GHOST(), ...this._soil.FIRE(), this._particle.vanish_after_four.id], new TransformModel({copied:o.get(TRANSFORM)}))
    })))

    // MOVEMENT
    RUNNING= this.lazy(()=>[...this._physic.PHYSIC_FALLING_SLIDE(), ...this._living.LIVING(), this._ia.follow_fast.id])
    WALKING= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this._living.LIVING(), this._ia.follow_slow.id])
    MISSILLING= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), this._living.hitable.id, this._ia.follow_fast.id])
    WOLF_LIKE= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this._living.LIVING(), this._ia.rotate_and_jump.id])
    EAGLE_LIKE= this.lazy(()=>[...this._physic.PHYSIC_SLIDE(), ...this._living.LIVING(), this._ia.fly_and_attack.id])

    // Monsters
    PANDA=this.lazy(()=>[...this.RUNNING(), this._models.panda.id, this._fight.small_damage.id, this._fight.small_knockback.id])
    KANGAROO=this.lazy(()=>[...this.WOLF_LIKE(), this._models.bad_kangaroo.id, this._fight.small_damage.id, this._fight.small_knockback.id])
    EAGLE=this.lazy(()=>[...this.EAGLE_LIKE(), this._models.bird.id, this._fight.small_damage.id, this._fight.small_damage.id])
    BASKETBALL=this.lazy(()=>[...this.MISSILLING(), this._models.basketball.id, this._particle.smoke_emitter.id, this._fight.small_damage.id, this._fight.small_knockback.id, this._particle.vanish_after_eight.id])
    SUPER_BASKETBALL=this.lazy(()=>[...this.MISSILLING(), this._models.basketball.id, this._particle.fire_emitter.id, this.fire_summoner.id, this._fight.medium_damage.id, this._fight.medium_knockback.id, this._particle.vanish_after_sixteen.id])

    SPHINX=this.lazy(()=>[...this.WALKING(), this._models.sphinx.id, this._fight.medium_damage.id, this._fight.large_knockback.id])

    // Invocations
    panda_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.PANDA(), models:()=>[this._fight.bad]}, new Vector3(.5,.5,.5), 3, 100, 15, 30))
    kangaroo_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.KANGAROO(), models:()=>[this._fight.bad]}, new Vector3(.5,.5,.5), 3, 100, 15, 30))
    bird_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.EAGLE(), models:()=>[this._fight.bad]}, new Vector3(.3,.3,.3), 3, 100, 15, 30))
    basketball_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.BASKETBALL(), models:()=>[this._fight.bad]}, new Vector3(.3,.3,.3), 4, 30, 15, 30))
    super_basketball_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.SUPER_BASKETBALL(), models:()=>[this._fight.bad]}, new Vector3(.5,.5,.5), 1, 100, 20, 60))

    sphinx_summoner=this.behav(tags(()=>this._player.player.id), ()=>new SummonerBehaviour({tags:this.SPHINX(), models:()=>[this._fight.bad, new LivingModel(10)]}, new Vector3(1,1,1), 1, 100, 20, 60))
}