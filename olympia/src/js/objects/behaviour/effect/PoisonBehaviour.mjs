import { LIVING } from "../../model/LivingModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


/**
 * Inflige régulièrement des dégats avant de disparaitre.
 * Un second ObjectQuery peut être passé pour définir les objets immunisés.
 */
export class PoisonBehaviour extends Behaviour{

    /**
     * @param {number} damage
     * @param {number} interval 
     */
    constructor(damage,interval){
        super()
        this.damage=damage
        this.interval=interval
    }

    init(_,objects){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery=} immunity
     */
    tick(world,objects,immunity){
        for(const obj of objects){
            if(world.age%this.interval==0){
                if(!immunity || !immunity.match(obj)) obj.apply(LIVING,l=>l.damage(this.damage))
            }
        }
    }

    finish(_,objects){ }
}