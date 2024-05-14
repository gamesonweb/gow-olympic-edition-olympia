import { fastRemove } from "../../../../../samlib/Array.mjs";

/**
 * Représente un tag, auquel des objets sont associés
 * @typedef {(string|number)} Tag
 */

/**
 * Un dictionnaire qui associe des objets à des Tags.
 * @class
 * @template {{tags: Array<Tag>}} T
 */
export class TaggedDict{

    /** @type {Object.<Tag,T[]>} */
    #dict={}

    /**
     * Récupère un itérateur sur les associations tag-objet
     * @returns {[Tag,T[]][]}
     */
    entries(){
        return Object.entries(this.#dict)
    }

    /**
     * Récupère tout les objets associés à un tag
     * @param {Tag} tag
     * @returns {T[]}
     */
    get(tag){
        return this.#dict[tag]
    }

    /**
     * Associe un objet à un tag ou plusieurs tags.
     * @param {Tag[]} tags Les tags
     * @param {T} entry L'objet à associer
     */
    add(tags, entry) {
        for(const tag of tags){
            if(!entry.tags.includes(tag)){
                let list=this.#dict[tag]
                if(list===undefined){
                    list=[]
                    this.#dict[tag]=list
                }
                list.push(entry)
                entry.tags.push(tag)
            }
        }
    }

    /**
     * Dissocie un objet d'un tag.
     * @param {T} entry 
     * @param {Tag} tag 
     */
    removeTag(entry,tag){
        // Find in entry tag list
        let inside_index=entry.tags.indexOf(tag)
        if(inside_index===undefined)throw new Error(`Does not have tag ${tag}`)
        fastRemove(entry.tags,inside_index)
        
        // Remove from dict tag list
        let list=this.#dict[tag]
        if(list===undefined)throw new Error("Corrupted Tagged Dict")
        var index=list.indexOf(entry)
        if(index===undefined)throw new Error("Corrupted Tagged Dict")
        fastRemove(list,index)
    }

    /**
     * Dissocie un objet de tout les tags
     * @param {T} entry 
     */
    remove(entry){
        while(entry.tags.length>0)this.removeTag(entry,entry.tags[0])
    }
    
}