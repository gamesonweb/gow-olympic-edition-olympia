import { GameObject } from "../world/GameObject.mjs"
import { ModelKey } from "../world/ModelHolder.mjs"

/**
 * @typedef {import("../world/TaggedDict.mjs").Tag} Tag
 */


/**
 * Donne des tags à un objet, en les associant à un slot.
 * Si des tags sont déjà associés au slot, alors ils sont remplacés.
 * @param {GameObject} obj 
 * @param {string?} slot 
 * @param {Tag[]} tags 
 */
export function equip(obj, slot, tags){
    if(slot!=null){
        const slots=obj.getOrSet(SLOTS,()=>({}))
        console.log("slot",slots,slot,tags)
        const previous=slots[slot]
        if(previous){
            obj.removeTag(...previous)
        }
        slots[slot]=tags
        if(tags.length==0)delete slots[slot]
        if(tags.length>0)obj.addTag(...tags)
        console.log("after slot",slots,slot,tags)
    }
    else obj.addTag(...tags)
}

/** @type {ModelKey<Object.<string,Tag[]>>} */
export const SLOTS=new ModelKey("slots")