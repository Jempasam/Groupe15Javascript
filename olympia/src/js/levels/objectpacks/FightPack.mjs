import { ProjectileBehaviour } from "../../objects/behaviour/life/ProjectileBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { ObjectPack } from "./ObjectPack.mjs";



/**
 * Un pack de behaviours de base pour la gestion des combats et des équipes
 */
export class FightPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {LivingPack} living
     */
    constructor(world,living){
        super(world)
        this._living=living
    }

    // Teams
    ennemy= this.empty()
    friendly= this.empty()

    // Projectiles
    MELEE_ATTACK= this.behav([this.ennemy.id], new ProjectileBehaviour(1,0.2,10))
    LARGE_MELEE_ATTACK= this.behav([this.ennemy.id], new ProjectileBehaviour(2,0.2,20))
    //FIREBALL_ATTACK= this.behav([this.ennemy.id], new ProjectileBehaviour(2,0.3,30, [IN_FIRE]))

    // Compilations
    LIVING_ENNEMY= this.lazy(()=>[...this._living.LIVING(), this.ennemy.id])
    LIVING_FRIENDLY= this.lazy(()=>[...this._living.LIVING(), this.friendly.id])
}