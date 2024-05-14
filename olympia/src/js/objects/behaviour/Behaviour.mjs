import { ObserverKey } from "../../../../../samlib/observers/ObserverGroup.mjs";
import { GameObject } from "../world/GameObject.mjs";
import { ObjectQuery, World } from "../world/World.mjs";

let id_counter=0

export class Behaviour{

    /** @type {number} */
    id;

    /** @type {string?}  */
    #unique_id=null

    constructor(){
        this.id=id_counter++
    }

    /**
     * Initialize the behaviour for many objects.
     * Called everytime objects of associated tags are added to the world
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    init(world, ...objects){
        throw new Error("Undefined method")
    }

    /**
     * Tick on all objects having at least one time this behaviour before individual ticks
     * @param {World} world 
     * @param {...ObjectQuery} objects 
     */
    tick(world, ...objects){
        throw new Error("Undefined method")
    }

    /**
     * Do the tick function of the behaviour should be called
     */
    doTick=true

    /**
     * Finish the behaviour
     * Called everytime objects of associated tags are removed from the world
     * @param {World} world
     * @param {...ObjectQuery} objects
     */
    finish(world, ...objects){
        throw new Error("Undefined method")
    }


    /**
     * Open the behaviour.
     * Called when the behaviour is added to the world
     * @param {World} world
     */
    open(world){

    }

    /**
     * Close the behaviour.
     * Called when the behaviour is removed from the world
     * @param {World} world
     */
    close(world){

    }

    /**
     * Returns a unique id for the behaviour
     * @param {string=} prefix 
     * @returns {string}
     */
    uniqueId(prefix=""){
        if(this.#unique_id==null)this.#unique_id=prefix+"_behav_"+this.constructor.name+"_"+this.id
        return this.#unique_id
    }

    get order(){ return 0 }

    get uid(){return this.uniqueId() }
}

/**
 * Create a simple behavioru with the given ticker function
 * @param {(world:World, q1?:ObjectQuery, q2?:ObjectQuery, q3?:ObjectQuery)=>void} ticker 
 */
export function behaviour(ticker){
    const ret=new Behaviour()
    ret.init=function(){}
    ret.tick=ticker
    ret.finish=function(){}
    return ret
}

/**
 * Create a simple behavioru with the given ticker function called on each objects of the first query
 * @param {(world:World, obj: GameObject)=>void} ticker 
 */
export function behaviourEach(ticker){
    const ret=new Behaviour()
    ret.init=function(){}
    ret.tick=function(world,objects){
        for(const obj of objects) ticker(world,obj)
    }
    ret.finish=function(){}
    return ret
}

/**
 * Create a simple behaviour that register an observer on the given event
 * @template T
 * @param {ObserverKey<T>} event 
 * @param {(GameObject,T)=>void} listener 
 * @returns 
 */
export function behaviourObserve(event,listener){
    const ret=new Behaviour()
    ret.init=function(world,objects){
        for(const obj of objects){
            obj.observers(event).add(this.uid,listener)
        }
    }
    ret.tick=function(){}
    ret.finish=function(world,objects){
        for(const obj of objects){
            obj.observers(event).remove(this.uid)
        }
    }
    return ret
}

/**
 * @template T
 * @typedef {[ObserverKey<T>,(GameObject,T)=>void]} ListenerAndKey
 */

/**
 * Create a simple behaviour that register many observers on many events
 * @param {...ListenerAndKey<*>} listeners
 * @returns 
 */
export function behaviourObserveMany(...listeners){
    const ret=new Behaviour()
    ret.init=function(world,objects){
        for(const obj of objects){
            for(const [key,listener] of listeners)obj.observers(key).add(this.uid,listener)
        }
    }
    ret.tick=function(){}
    ret.finish=function(world,objects){
        for(const obj of objects){
            for(const key of listeners)obj.observers(key[0]).remove(this.uid)
        }
    }
    return ret
}