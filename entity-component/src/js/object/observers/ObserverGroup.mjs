
/**
 * A group of observers
 */
export class ObserverGroup{
    /** @type {Object.<string|number,(function(...any):void)[]>} */
    #observers={}

    /**
     * Register an observer
     * @param {string|number} name
     * @param {function(...any):void} observer
     */
    add(name,observer){
        this.#observers[name]=observer
    }

    /**
     * Unregister an observer
     * @param {string|number} name
     */
    remove(name){
        delete this.#observers[name]
    }

    /**
     * Notify all observers
     * @param {any} value
     */
    notify(...value){
        for(let observer of Object.values(this.#observers)){
            observer(...value)
        }
    }

    
}