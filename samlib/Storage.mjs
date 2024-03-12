import { FlowGraphSendCustomEventBlock } from "babylonjs/FlowGraph/Blocks/Execution/flowGraphSendCustomEventBlock"


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

/** @type {StorageType<string>} */
export const STRING_DATA ={
    parse: e=>e,
    serialize: e=>e,
    get default(){return ""}
}

/** @type {StorageType<Array>} */
export const ARRAY_DATA ={
    parse: JSON.parse,
    serialize: JSON.stringify,
    get default(){return []}
}

class Storage{

    /**
     * A prefix added before every stored data names.
     * Useful for making account-based storage.
     * @type {string}
     */
    prefix=""
    
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
        let str=this.storage.getItem(this.prefix+name)
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
        if(str!=null)localStorage.setItem(this.prefix+name,str)
    }

    /**
     * Remove a stored data
     * @param {string} name 
     */
    remove(name){
        this.storage.removeItem(this.prefix+name)
    }

    /**
     * Edit a stored data
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type 
     * @param {function(T):void} editor 
     */
    edit(name,type,editor){
        let data=this.get(this.prefix+name,type)
        editor(data)
        this.set(this.prefix+name,type,data)
    }

    /**
     * Create a new storage accessor to the same storage location with his own prefix
     */
    clone(){
        let storage=new Storage(this.storage)
        storage.prefix=this.prefix
        return storage
    }

}

/**
 * @typedef {{name:string,password:string,image:string,creation:number}} PlayerSettings
 * @typedef {{settings:PlayerSettings,data:Object}} PlayerData
 */
class AccountStorage extends Storage{
    
    constructor(storage){
        super(storage)
    }
    
    /**
     * Get the current user
     */
    get current_user(){
        let data=super.get("current_user",STRING_DATA)
        if(data=="")return undefined
        else return data
    }

    /**
     * Set the current user
     */
    set current_user(username){
        let data=super.set("current_user",STRING_DATA,username)
    }

    /**
     * @returns {PlayerData=}
     */
    #get_user_data(username){
        let players=super.get("players",OBJECT_DATA)
        if(!players)return undefined
        let player=players[username]
        if(!player)return undefined
    }

    /**
     * Add a new player and return his data if it succeed
     * @param {string} name 
     * @param {string} password 
     * @returns {PlayerSettings=}
     */
    add_player(name,password){
        let already=this.#get_user_data(name)
        if(!already){
            let players=super.get("players",OBJECT_DATA)
            players[name]={settings:{name, password, image:null, creation:Date.now()}, data:{}}
            super.set("players",OBJECT_DATA,players)
            return players[name].settings
        }
        return undefined
    }

    /**
     * Remove player and return if it succeed
     * @param {string} name 
     * @returns {boolean} true if it succeed
     */
    remove_player(name){
        let players=super.get("players",OBJECT_DATA)
        if(players[name]){
            delete players[name]
            super.set("players",OBJECT_DATA,players)
            return true
        }
        else return false
    }

    /**
     * Get the player data of the given player if it exist
     * @param {string} name 
     * @returns {PlayerSettings=}
     */
    get_player(name){
        return this.#get_user_data(name)?.settings
    }

    /**
     * Set the settings of the given player
     * @param {string} name 
     * @param {string} data 
     * @returns {boolean} true if it succeed
     */
    set_player(name,data){
        let players=super.get("players",OBJECT_DATA)
        if(players[name]){
            players[name].settings=data
            super.set("players",OBJECT_DATA,players)
            return true
        }
        else return false
    }

    get players(){
        return Object.keys(super.get("players",OBJECT_DATA))
    }

    /**
     * Get the given player if the password is good
     * @param {string} name 
     * @param {string} password
     * @returns {PlayerSettings=}
     */
    try_get_player(name,password){
        const player=this.#get_user_data(name)
        if(player && player.settings.password==password){
            return player.settings
        }
    }

    get(name,type){
        let str=this.#get_user_data(this.current_user)?.data[name]
        if(str==null)return type.default
        else{
            let data=type.parse(str)
            if(data==null)return type.default
            else return data
        }
    }
    
    set(name,type,data){
        let str=type.serialize(data)
        let storage=this.#get_user_data(this.current_user)?.data
        if(str!=null && storage)storage[name]=str
        else return data.default
    }

    remove(name){
        let storage=this.#get_user_data(this.current_user)?.data
        if(storage)delete storage[name]
    }

    /**
     * Create a new storage accessor to the same storage location with his own prefix
     */
    clone(){
        let storage=new AccountStorage(this.storage)
        storage.current_user=this.current_user
        storage.prefix=this.prefix
        return storage
    }

}

/**
 * A simple local storage, never cleared
 */
export const LOCAL_STORAGE=new Storage(localStorage)

/**
 * A local storage with accounts
 */
export const ACCOUNT_STORAGE=new AccountStorage(localStorage)

/**
 * a simple session storage, cleared when the session ends
 */
export const SESSION_STORAGE=new Storage(sessionStorage)
