import { EntityListHandler } from "./EntityListHandler.mjs";


/**
 * Une entité du monde
 */
export class Entity{
    
    /**
     * @returns {Array<EntityListHandler>} Des gestionnaire de liste
     */
    get_lists(){return []}

    on_add(world){}

    on_remove(world){}

}