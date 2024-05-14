

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

/** @type {StorageType<number>} */
export const NUMBER_DATA ={
    parse: e=>{
        let ret=parseFloat(e)
        if(isNaN(ret))return 0
        else return ret
    },
    serialize: e=>""+e,
    get default(){return 0}
}

/** @type {StorageType<Array>} */
export const ARRAY_DATA ={
    parse: JSON.parse,
    serialize: JSON.stringify,
    get default(){return []}
}

export class Storage{

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
     * @param {string} name 
     * @returns {string|null}
     */
    _internal_get(name){
        throw new Error("Internal get not defined")
    }

    /**
     * @param {string} name 
     * @param {string|null} value 
     */
    _internal_set(name,value){
        throw new Error("Internal set not defined")
    }

    /**
     * Get a data of the supplied type
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type
     * @returns {T}
     */
    get(name,type){
        let str=this._internal_get(this.prefix+name)
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
        if(str!=null)this._internal_set(this.prefix+name,str)
    }

    /**
     * Remove a stored data
     * @param {string} name 
     */
    remove(name){
        this._internal_set(this.prefix+name, null)
    }

    /**
     * Edit a stored data
     * @template T
     * @param {string} name 
     * @param {StorageType<T>} type 
     * @param {function(T):void} editor 
     */
    edit(name,type,editor){
        let data=this.get(name,type)
        editor(data)
        this.set(name,type,data)
    }

    _copyInto(other){
        other.prefix=this.prefix
    }

    /**
     * Create a new storage accessor to the same storage location with his own prefix
     */
    clone(){
        throw new Error("Clone not defined")
    }

}

class WrapperStorage extends Storage{
    
    constructor(storage){
        super()
        this.storage=storage
    }

    _internal_get(name){
        return this.storage.getItem(name)
    }

    _internal_set(name,value){
        if(value===null)this.storage.removeItem(name)
        else this.storage.setItem(name,value)
    }

    clone(){
        let copied=new WrapperStorage(this.storage)
        this._copyInto(copied)
        return copied
    }

}


/**
 * A simple local storage, never cleared
 */
export const LOCAL_STORAGE=new WrapperStorage(localStorage)

/**
 * a simple session storage, cleared when the session ends
 */
export const SESSION_STORAGE=new WrapperStorage(sessionStorage)


/**
 * @typedef {{name:string,username:string,password:string,image:string,creation:number}} PlayerSettings
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
        let data=SESSION_STORAGE.get("current_user",STRING_DATA)
        if(data=="")return undefined
        else return data
    }

    /**
     * Set the current user
     */
    set current_user(username){
        if(!username)username=""
        SESSION_STORAGE.set("current_user",STRING_DATA,username)
    }

    get current_user_data(){
        let current_user=this.current_user
        if(current_user!=undefined)return this.get_player(current_user)
        else return undefined
    }

    /**
     * @returns {PlayerData=}
     */
    #get_user_data(username){
        let players=LOCAL_STORAGE.get("players",OBJECT_DATA)
        if(!players)return undefined
        let player=players[username]
        if(!player)return undefined
        return player
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
            let players=LOCAL_STORAGE.get("players",OBJECT_DATA)
            players[name]={settings:{name, username:name, password, image:"../img/profile.webp", creation:Date.now()}, data:{}}
            LOCAL_STORAGE.set("players",OBJECT_DATA,players)
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
        let players=LOCAL_STORAGE.get("players",OBJECT_DATA)
        if(players[name]){
            delete players[name]
            LOCAL_STORAGE.set("players",OBJECT_DATA,players)
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
     * @param {PlayerSettings} data 
     * @returns {boolean} true if it succeed
     */
    set_player(data){
        let players=LOCAL_STORAGE.get("players",OBJECT_DATA)
        if(players[data.name]){
            players[data.name].settings=data
            LOCAL_STORAGE.set("players",OBJECT_DATA,players)
            return true
        }
        else return false
    }

    get players(){
        return Object.keys(LOCAL_STORAGE.get("players",OBJECT_DATA))
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
        else return undefined
    }

    _internal_get(name){
        let current_user=this.current_user ?? "guest"
        let str=this.#get_user_data(current_user)?.data?.[name]
        if(str===undefined)return null
        else return str
    }

    _internal_set(name,value){
        let current_user=this.current_user
        let players=LOCAL_STORAGE.edit("players",OBJECT_DATA, players=>{
            if(current_user){
                let current_user_data=players[current_user]
                if(current_user_data){
                    if(value!=null)current_user_data.data[name]=value
                    else delete current_user_data.data[name]
                }
            }
            else{
                if(players.guest==undefined){
                    players.guest={data:{}}
                }
                players.guest.data[name]=value
            }
        })
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
 * A local storage with accounts
 */
export const ACCOUNT_STORAGE=new AccountStorage(localStorage)

