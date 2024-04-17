import { Entity } from "./Entity.mjs"
import { EntityListHandler } from "./EntityListHandler.mjs"


/**
 * Un conteneur d'entitées
 */
export class World{

    /** @type {Set<Entity>} */
    _objects=new Set()

    /** @type {Map<EntityListHandler,Set<Entity>>} */
    _lists=new Map()

    /** @type {Array<EntityListHandler>} */
    _lists_list=new Array()

    /**
     * Ajoute un objet au monde
     * @param {Entity} entity 
     */
    add(entity){
        if(!this._objects.has(entity)){
            this._objects.add(entity)
            const lists=entity.get_lists()

            // Ajoute à la liste
            for(const list of lists){
                if(!this._lists.has(list)){
                    this._lists.set(list,new Set())
                    this._lists_list.push(list)
                    this._lists_list.sort((a,b)=>a.order-b.order)
                }
                this._lists.get(list)?.add(entity)
                list.on_add(this,entity)
            }

            // Lifecycle events
            entity.on_add(this)
        }
    }

    /**
     * Supprime un objet du monde
     * @param {Entity} entity 
     */
    remove(entity){
        if(this._objects.has(entity)){
            this._objects.delete(entity)
            const lists=entity.get_lists()

            // Retire de la liste
            for(const list of lists){
                list.on_remove(this,entity)
                this._lists.get(list)?.delete(entity)
            }

            // Lifecycle events
            entity.on_remove(this)
        }
    }

    /**
     * 
     * @returns {Iterable<Entity>}
     */
    all(){
        return this._objects
    }

    /**
     * @param {EntityListHandler} listid
     * @returns {Iterable<Entity>}
     */
    of(listid){
        return this._lists.get(listid) || []
    }

    tick(){
        for(let list of this._lists_list)list.on_tick(this)
    }

    /**
     * Free all resources
     * Should be called when the world is no longer needed
     */
    close(){
        for(const entity of this._objects){
            this.remove(entity)
        }
        this._lists.clear()
        this._lists_list.length=0
        if(this._objects.size>0)throw new Error("Failed to remove all entities")
    }
}