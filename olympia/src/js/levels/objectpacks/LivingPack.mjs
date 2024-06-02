import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { LivingBehaviour, ON_DEATH } from "../../objects/behaviour/life/LivingBehaviour.mjs";
import { ParticleLivingBehaviour } from "../../objects/behaviour/life/ParticleLivingBehaviour.mjs";
import { RESPAWN_ANCHOR, RespawnBehaviour } from "../../objects/behaviour/life/RespawnBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourCollectable } from "../../objects/behaviour/generic/CollectableBehaviour.mjs";
import { LifeBarBehaviour } from "../../objects/behaviour/life/LifeBarBehaviour.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { CURRENT_LEVEL, LEVEL_CONTEXT, NEXT_LEVEL } from "../Level.mjs";
import { LifeMessageBehaviour } from "../../objects/behaviour/life/LifeMessageBehaviour.mjs";



/**
 * Un pack de behaviours de base pour la gestion des vies
 */
export class LivingPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {ParticlePack} particle
     */
    constructor(world,particle){
        super(world)
        this._particle=particle
        this._registerNames()
    }

    // Living
    hitable=this.empty()
    living=this.behav(new LivingBehaviour())
    damage_blood=this.behav(()=>new ParticleLivingBehaviour(this._particle.BLOOD(), new Vector3(0.8,0.8,0.8)))
    damage_cloud=this.behav(()=>new ParticleLivingBehaviour(this._particle.CLOUD(), new Vector3(0.4,0.4,0.4)))
    damage_junk=this.behav(()=>new ParticleLivingBehaviour(this._particle.WOOD_JUNK(), new Vector3(0.8,0.8,0.8)))
    damage_fire=this.behav(()=>new ParticleLivingBehaviour(this._particle.FIRE(), new Vector3(0.8,0.8,0.8)))
    depth_damage=this.behav(()=>behaviourEach(o=>o.apply2(TRANSFORM, LIVING,(t,l)=>{
        if(t.position.y<-10)l.damage(3)
    })))
    respawn=this.behav(new RespawnBehaviour())
    reload_on_death=this.behav(behaviourObserve(ON_DEATH,(obj)=>{
        obj.world.model.apply2(LEVEL_CONTEXT, CURRENT_LEVEL, (context,cur)=>{
            context.switchTo(cur())
        })
    }))
    lifebar=this.behav(new LifeBarBehaviour())
    life_message=this.behav(new LifeMessageBehaviour())

    // Items
    health_giver=this.behav(tags(()=>this.living.id), behaviourCollectable({use_count:Infinity, reload_time:200},(_,obj)=>{
        obj.apply(LIVING,l=>l.life+=1)
        return true
    }))

    checkpoint=this.behav(tags(()=>this.respawn.id), behaviourCollectable({use_count:Infinity, reload_time:200},(_,obj)=>{
        obj.apply2(RESPAWN_ANCHOR, TRANSFORM, (anchor,tf)=>{
            anchor[0].copyFrom(tf.position)
        })
        return true
    }))

    // Compilations
    LIVING= this.lazy(()=>[this.living.id, this.hitable.id, this.damage_cloud.id, this.depth_damage.id])
    WOOD_DESTRUCTIBLE= this.lazy(()=>[this.living.id, this.hitable.id, this.damage_junk.id, this.depth_damage.id])
    MACHINE_DESTRUCTIBLE= this.lazy(()=>[this.living.id, this.hitable.id, this.damage_fire.id, this.damage_cloud.id, this.depth_damage.id])
    LIVING_SILENT= this.lazy(()=>[this.living.id, this.hitable.id, this.depth_damage.id])
}