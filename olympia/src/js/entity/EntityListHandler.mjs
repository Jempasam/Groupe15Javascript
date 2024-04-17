import { Entity } from "./Entity.mjs";
import { World } from "./World.mjs";


/**
 * Une liste d'entitées
 */
export class EntityListHandler{
    
    /**
     * Appelée lorsqu'une entité est ajoutée à la liste
     * @param {World} world 
     * @param {Entity} entity 
     */
    on_add(world,entity){}

    /**
     * Appelée lorsqu'une entité est retirée de la liste
     * @param {World} world 
     * @param {Entity} entity 
     */
    on_remove(world,entity){}

    /**
     * Appelée à chaque tick
     * @param {World} world 
     */
    on_tick(world){}

    get order(){ return 0 }
}