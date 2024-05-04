
let id_counter=0

/**
 * @template T Event object
 */
export class ObserverKey{
    /** @type {string} */
    name
    constructor(name="unamed"){
        this.name=name+id_counter
        id_counter++
    }
}


/**
 * @template O The target object
 * @template T The event object
 * A group of observers
 */
export class ObserverGroup{

    static main_handler="__MAIN_HANDLER__"

    constructor(holder){
        this.#holder=holder
    }

    /** @type {O} */
    #holder

    /** @type {Object.<string|number,(function(O,T):void)[]>} */
    #observers={}

    /**
     * Register an observer
     * @param {string|number} name
     * @param {function(O,T):void} observer
     */
    add(name,observer){
        this.#observers[name]=observer
    }

    /**
     * Register the main observer
     * @param {(function(O,T):void)?} observer
     */
    set(observer){
        if(observer)this.add(ObserverGroup.main_handler,observer)
        else this.remove(ObserverGroup.main_handler)
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
     * @param {T} value
     */
    notify(value){
        for(let observer of Object.values(this.#observers)){
            observer(this.#holder,value)
        }
    }

    
}

/**
 * Get an observer group from an object, or create it if it doesn't exist
 * @template O
 * @template T
 * @param {O} object 
 * @param {ObserverKey<T>} key 
 * @returns {ObserverGroup<O,T>}
 */
export function observers(object,key){
    let group=object["observers_"+key.name]
    if(!group){
        group=new ObserverGroup(this)
        object["observers_"+key.name]=group
    }
    return group
}