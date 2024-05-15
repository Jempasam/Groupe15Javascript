import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { behaviourEach } from "../../objects/behaviour/Behaviour.mjs";
import { LivingBehaviour } from "../../objects/behaviour/life/LivingBehaviour.mjs";
import { ParticleLivingBehaviour } from "../../objects/behaviour/life/ParticleLivingBehaviour.mjs";
import { LIVING } from "../../objects/model/LivingModel.mjs";
import { TRANSFORM } from "../../objects/model/TransformModel.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack } from "./ObjectPack.mjs";
import { ParticlePack } from "./ParticlePack.mjs";



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
    }
    // Living
    living=this.behav(new LivingBehaviour())
    damage_smoke=this.behav(()=>new ParticleLivingBehaviour(this._particle.SMOKE(), new Vector3(0.4,0.4,0.4)))
    depth_damage=this.behav(()=>behaviourEach((_,o)=>o.apply2(TRANSFORM, LIVING,(t,l)=>{
        if(t.position.y<-10)l.damage(1)
    })))

    // Compilations
    LIVING= this.lazy(()=>[this.living.id, this.damage_smoke.id, this.depth_damage.id])
    LIVING_SILENT= this.lazy(()=>[this.living.id, this.depth_damage.id])
}