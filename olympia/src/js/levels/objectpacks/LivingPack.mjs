import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { LivingBehaviour } from "../../objects/behaviour/life/LivingBehaviour.mjs";
import { ParticleLivingBehaviour } from "../../objects/behaviour/life/ParticleLivingBehaviour.mjs";
import { RespawnBehaviour } from "../../objects/behaviour/life/RespawnBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";
import { behaviourCollectable } from "../../objects/behaviour/generic/CollectableBehaviour.mjs";



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
    damage_dust=this.behav(()=>new ParticleLivingBehaviour(this._particle.DUST(), new Vector3(0.8,0.8,0.8)))
    damage_junk=this.behav(()=>new ParticleLivingBehaviour(this._particle.WOOD_JUNK(), new Vector3(0.8,0.8,0.8)))
    depth_damage=this.behav(()=>behaviourEach(o=>o.apply2(TRANSFORM, LIVING,(t,l)=>{
        if(t.position.y<-10)l.damage(3)
    })))
    respawn=this.behav(new RespawnBehaviour())

    // Items
    health_giver=this.behav(tags(()=>this.living.id), behaviourCollectable({use_count:Number.MAX_SAFE_INTEGER, reload_time:200},(_,obj)=>{
        obj.apply(LIVING,l=>l.life+=1)
        return true
    }))

    // Compilations
    LIVING= this.lazy(()=>[this.living.id, this.hitable.id, this.damage_blood.id, this.depth_damage.id])
    DESTRUCTIBLE= this.lazy(()=>[this.living.id, this.hitable.id, this.damage_junk.id, this.depth_damage.id])
    LIVING_SILENT= this.lazy(()=>[this.living.id, this.hitable.id, this.depth_damage.id])
}