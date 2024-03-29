
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

/**
 * Get an observer group from an object, or create it if it doesn't exist
 * @param {any} object 
 * @param {string} name 
 * @returns {ObserverGroup}
 */
export function observers(object,name){
    let group=object["observers_"+name]
    if(!group){
        group=new ObserverGroup()
        object["observers_"+name]=group
    }
    return group
}