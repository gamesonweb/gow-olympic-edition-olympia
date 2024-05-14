import { TaggedDict } from "./TaggedDict.mjs"
import { GameObject } from "./GameObject.mjs"
import { Behaviour } from "../behaviour/Behaviour.mjs"
import { fastKeep, fastRemove, fastRemoveValue, fastRemoveValueAll } from "../../../../../samlib/Array.mjs";
import { ModelHolder } from "./ModelHolder.mjs";


/** @typedef {import("./TaggedDict.mjs").Tag} Tag */

/**
 * Représente un monde qui contient des objets associés à des tags, et de comportements associés à des tags.
 */
export class World{

    model=new ModelHolder()

    obj_state_age=0

    age=0

    /** @type {TaggedDict<GameObject>} */
    objects=new TaggedDict()

    /** @type {GameObject[]} */
    objects_list=[]

    /** @type {TaggedDict<BehaviourEntry>} */
    behaviours=new TaggedDict()

    /** @type {BehaviourEntry[]} */
    behaviours_list=[]

    tick(){
        for(let behav of this.behaviours_list){
            behav.behaviour.tick(this,...this.#getParams(behav))
        }
        for(let i=this.objects_list.length-1; i>=0; i--){
            if(!this.objects_list[i].alive){
                this.remove(this.objects_list[i])
            }
        }
        this.age++;
    }


    /**
     * @typedef {import("./ModelHolder.mjs").ModelAndKey} ModelAndKey
     */

    /**
     * Add tags to an object.
     * @param {GameObject} object 
     * @param {Tag[]} tags 
     */
    addTags(object, tags){
        const added_tags=[...tags]
        fastRemoveValueAll(added_tags,object.tags)
        this.objects.add(added_tags,object)
        this.forBehav(added_tags, behaviour=>{
            behaviour.behaviour.init(this,...this.#getParamsOf(behaviour,added_tags,[object]))
        })
    }

    /**
     * Remove tags from an object.
     * @param {GameObject} object 
     * @param {Tag[]} tags 
     */
    removeTags(object,tags){
        const removed_tags=[...tags]
        fastKeep(removed_tags,object.tags)
        removed_tags.forEach(tag => this.objects.removeTag(object,tag))
        this.forBehav(removed_tags, behaviour=>{
            behaviour.behaviour.finish(this,...this.#getParamsOf(behaviour,removed_tags,[object]))
        })
    }

    /**
     * Ajoute un objet au monde
     * @param {number} count Le nombre d'objet à ajouter, 1 par défaut
     * @param {Tag|Tag[]} tags Les tags de l'objet
     * @param {...ModelAndKey} data Les données de l'objet
     * @returns {GameObject[]} Un tableau des objets ajoutés
     */
    addMany(count, tags, ...data){
        if(!Array.isArray(tags))tags=[tags]
        
        // Add object
        if(!tags)throw new Error("Cannot add an object with no tags")
        let c=count || 1
        let addeds=[]
        for(let i=0;i<c;i++){
            let object=new GameObject(this)
            this.objects.add(tags,object)
            this.objects_list.push(object)
            for(let model of data){
                object.setAuto(model)
            }
            addeds.push(object)
        }
        // Init behaviours
        this.forBehav(tags, behaviour=>{
            behaviour.behaviour.init(this,...this.#getParamsOf(behaviour,tags,addeds))
        })

        this.obj_state_age++

        return addeds
    }

    /**
     * Ajoute un objet au monde
     * @param {Tag|Tag[]} tags Les tags de l'objet
     * @param {...ModelAndKey} data Les données de l'objet
     * @returns {GameObject} Un tableau des objets ajoutés
     */
    add(tags, ...data){
        return this.addMany(1, tags, ...data)[0]
    }

    /**
     * @param {GameObject} object The object to remove
     */
    remove(object){
        // Finish behaviours
        this.forBehav(object.tags, behaviour=>{
            behaviour.behaviour.finish(this,...this.#getParamsOf(behaviour,object.tags,[object]))
        })

        // Remove
        this.objects.remove(object)
        let index=this.objects_list.indexOf(object)
        fastRemove(this.objects_list,index)

        this.obj_state_age++
    }

    close(){
        while(this.objects_list.length>0) this.remove(this.objects_list[0])
        while(this.behaviours_list.length>0) this.removeBehaviour(this.behaviours_list[0])
        this.age=0
        this.obj_state_age=0
    }

    /**
     * Ajoute des behaviours au monde.
     * @param {(Tag|Tag[])} tags Les tags associés aux behaviours
     * @param {...(Behaviour|[Behaviour,number])} behaviours Les behaviours ou les behaviours + leur ordre de tick
     * @returns {BehaviourEntry[]}
     */
    addBehaviours(tags, ...behaviours) {
        if(!Array.isArray(tags))tags=[tags]
        
        let ret=[]
        for(const behaviour_added of behaviours){
            let behaviour, order
            if(behaviour_added instanceof Behaviour){
                behaviour=behaviour_added
                order=behaviour_added.order
            }
            else{
                behaviour=behaviour_added[0]
                order=behaviour_added[1]
            }
            let entry=new BehaviourEntry(behaviour,order)
            if(behaviour.doTick)this.behaviours_list.push(entry)
            this.behaviours.add(tags, entry)
            entry.behaviour.init(this,...this.#getParams(entry))
            entry.behaviour.open(this)
            ret.push(entry)
        }
        this.behaviours_list.sort((a,b)=>a.order-b.order)
        return ret
    }

    /**
     * Ajoute un behaviour au monde.
     * @param {(Tag|Tag[])} tags Les tags associés au behaviour
     * @param {Behaviour|[Behaviour,number]} behaviour Le behaviour ou le behaviour + son ordre de tick
     * @returns {BehaviourEntry}
     */
    addBehaviour(tags, behaviour) {
        return this.addBehaviours(tags,behaviour)[0]
    }

    /**
     * Supprime un behaviour du monde.
     * @param {BehaviourEntry} behaviour - Le behaviour à supprimer
     */
    removeBehaviour(behaviour) {
        // Finish behaviour
        behaviour.behaviour.finish(this,...this.#getParams(behaviour))
        behaviour.behaviour.close(this)

        // Remove
        this.behaviours.remove(behaviour)
        if(behaviour.behaviour.doTick)fastRemove(this.behaviours_list,this.behaviours_list.indexOf(behaviour))
    }

    /**
     * Get object list to give to behaviour
     * @param {BehaviourEntry} behaviour 
     * @returns {ObjectQuery[]}
     */
    #getParams(behaviour){
        let params=[]
        for(let tag_param of behaviour.tags){
            // Get tag group
            let tag_group
            if(Array.isArray(tag_param)){
                tag_group=tag_param
            }
            else{
                tag_group=[tag_param]
            }

            // Get object groups
            let object_groups=tag_group.map(tag=>this.objects.get(tag) || [])
            params.push(new ObjectQuery(tag_group,object_groups,object_groups))
        }
        return params
    }

    /**
     * Get object list to give to behaviour
     * @param {BehaviourEntry} behaviour
     * @param {Tag[]} tags
     * @param {GameObject[]} objects
     * @param {ObjectQuery[]} objects
     */
    #getParamsOf(behaviour, tags, objects){
        let params=[]
        for(let tag_param of behaviour.tags){
            // Get tag group
            let tag_group
            if(Array.isArray(tag_param)){
                tag_group=tag_param
            }
            else{
                tag_group=[tag_param]
            }

            // Get object groups
            let all_object_groups=tag_group.map(tag=>this.objects.get(tag) || [])
            let object_groups=tag_group.map(tag => {
                if(tags.includes(tag)){
                    return objects
                }
                else return []
            })
            params.push(new ObjectQuery(tag_group,object_groups,all_object_groups))
        }
        return params
    }

    /**
     * Execute sur fonctions sur les behaviours associés à des tags
     * @param {Tag[]} tags
     * @param {(behaviour:BehaviourEntry)=>void} callback
     */
    forBehav(tags, callback){
        for(let tag of tags){
            let list=this.behaviours.get(tag)
            if(list!==undefined){
                for(let behaviour of list){
                    callback(behaviour)
                }
            }
        }
    }
}

/**
 * Représente une requête d'objet qui permet au fonctions d'un behaviour de récupérer des objets sur lesquels il doit agir.
 */
export class ObjectQuery{

    /**
     * Crée une nouvelle requête d'objets
     * @param {Tag[]} tags
     * @param {GameObject[][]} object_groups
     */
    constructor(tags, object_groups, all_groups){
        this.tags=tags
        this.object_groups=object_groups
        this.all_groups=all_groups
    }

    /**
     * Itère sur les objets de la requête
     */
    [Symbol.iterator](){
        let object_groups=this.object_groups
        function *getIterator(){
            for(let objs of object_groups){
                yield* objs
            }
        }
        return getIterator()
    }

    /**
     * Retourne une requête sur tout les objets du monde même ceux non concernés par la fonction
     * @returns {ObjectQuery}
     */
    all(){
        return new ObjectQuery(this.tags,this.all_groups,this.all_groups)
    }

    /**
     * Collecte tout les objets de la requête
     * @returns {GameObject[]}
     */
    collect(){
        let objects=[]
        for(let objs of this.object_groups){
            objects.push(...objs)
        }
        return objects
    }

    /**
     * Vérifie si la requête contient un objet
     * @param {GameObject} object
     * @returns {boolean}
     */
    contains(object){
        if(!this.set){
            this.set=new Set()
            for(let objs of this.object_groups){
                for(let obj of objs){
                    this.set.add(obj.id)
                }
            }
        }
        return this.set.has(object.id)
    }

    /**
     * Vérifie si un objet correspond aux tags de la requête
     * @param {GameObject} object 
     * @returns {boolean}
     */
    match(object){
        return !this.tags.every(tag=>!object.tags.includes(tag))
    }
}

/**
 * 
 */
export class BehaviourEntry{
    /** @type {Tag[]} */
    tags=[]

    /**
     * @param {Behaviour} behaviour
     * @param {number} order
     */
    constructor(behaviour,order){
        this.behaviour=behaviour
        this.order=order
    }
}