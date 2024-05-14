
let id_counter=0

/**
 * @template T Event object
 */
export class ObserverKey{
    /** @type {string} */
    name
    constructor(name="unamed"){
        this.name=name+"_"+id_counter
        id_counter++
    }
}

/**
 * @template O
 * @template T
 * @typedef {[ObserverKey<T>,(O,T)=>void]} ListenerAndKey
 */

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
     * @param {string|number} prefix
     * @returns {string}
     */
    static generateName(prefix=""){
        const rand=crypto.getRandomValues(new Uint8Array(2))
        return prefix+"auto_"+performance.now()+"_"+rand[0]+"_"+rand[1]
    }

    /**
     * Register an observer
     * @param {string|number} name
     * @param {function(O,T):void} observer
     */
    add(name,observer){
        this.#observers[name]=observer
    }

    /**
     * Register an observer with an automaticcaly generated name
     * @param {function(O,T):void} observer
     * @param {string=} prefix A prefix for the auto-generated name
     * @returns {string} The name of the observer
     */
    addAuto(observer,prefix=""){
        const name=ObserverGroup.generateName(prefix)
        this.#observers[name]=observer
        return name
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
        group=new ObserverGroup(object)
        object["observers_"+key.name]=group
    }
    return group
}