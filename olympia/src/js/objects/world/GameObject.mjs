import { ObserverGroup, ObserverKey, observers } from "../../../../../samlib/observers/ObserverGroup.mjs"
import { ModelHolder } from "./ModelHolder.mjs"
import { World } from "./World.mjs"

let obj_counter=0

/** @typedef {import("./TaggedDict.mjs").Tag} Tag */


/**
 * Represents a game object.
 * @satisfies {any}
 * @class
 */
export class GameObject extends ModelHolder{
    /** @type {World} */
    world

    /** @type {Tag[]} */
    tags=[]

    /** @type {number} */
    id=obj_counter++

    /** @type {boolean} */
    alive=true

    /**
     * 
     * @param {World} world 
     * @param {any=} data 
     */
    constructor(world, data){
        super()
        this.world=world
        if(data){
            Object.assign(this,data)
        }
    }

    /**
     * @template T
     * @param {ObserverKey<T>} key
     * @returns {ObserverGroup<GameObject,T>}
     */
    observers(key){
        return observers(this,key)
    }

    /**
     * @param {...Tag} tags
     */
    removeTag(...tags){
        if(this.world)this.world.removeTags(this,tags)
    }

    /**
     * @param {...Tag} tags
     */
    addTag(...tags){
        if(this.world)this.world.addTags(this,tags)
    }

    kill(){
        this.alive=false
    }
}

