

/**
 * A type of storable data
 * @template T
 */
class StorageType{
    /**
     * Parse a stored data in string format
     * @param {string} str
     * @returns {T?}
     */
    parse(str){
        return null
    }

    /**
     * Serialize data into string format
     * @param {T} data 
     * @returns {string?}
     */
    serialize(data){
        return null
    }

    /**
     * Get a default data of this type
     * @returns {T}
     */
    get default(){
        // @ts-ignore
        return undefined
    }
}

/** @type {StorageType<Object>} */
export const OBJECT_DATA ={
    parse: JSON.parse,
    serialize: JSON.stringify,
    get default(){return {}}
}

/** @type {StorageType<Array>} */
export const ARRAY_DATA ={
    parse: JSON.parse,
    serialize: JSON.stringify,
    get default(){return []}
}

class Storage{

    /**
     * A infix added before every stored data names.
     * Useful for making account-based storage.
     * @type {string}
     */
    infix=""
    
    constructor(storage){
        this.storage=storage
    }

    /**
     * Get a data of the supplied type
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type
     * @returns {T}
     */
    get(name,type){
        let str=this.storage.getItem(this.infix+name)
        if(str==null)return type.default
        else{
            let data=type.parse(str)
            if(data==null)return type.default
            else return data
        }
    }

    /**
     * Set a data of the supplied type
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type
     * @param {T} data
     */
    set(name,type,data){
        let str=type.serialize(data)
        if(str!=null)localStorage.setItem(this.infix+name,str)
    }

    /**
     * Remove a stored data
     * @param {string} name 
     */
    remove(name){
        this.storage.removeItem(this.infix+name)
    }

    /**
     * Edit a stored data
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type 
     * @param {function(T):void} editor 
     */
    edit(name,type,editor){
        let data=this.get(this.infix+name,type)
        editor(data)
        this.set(this.infix+name,type,data)
    }
}

export const LOCAL_STORAGE=new Storage(localStorage)

export const SESSION_STORAGE=new Storage(sessionStorage)