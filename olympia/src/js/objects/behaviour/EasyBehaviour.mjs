import { ObserverKey } from "../../../../../samlib/observers/ObserverGroup.mjs";
import { GameObject } from "../world/GameObject.mjs";
import { ModelKey } from "../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";

/**
 * Une base pour aider à créer des behaviours.
 * Aide à enregistrer des listeners et des models sur les objets.
 */
export class EasyBehaviour extends Behaviour{

    /**
     * Some events to register on the main objects.
     * @type {Array<import("../../../../../samlib/observers/ObserverGroup.mjs").ListenerAndKey<GameObject,*>>}
     * */
    events

    /**
     * Some private models to register and remove of the main objects.
     * @type {Array<[ModelKey<*>,(GameObject)=>any]>}
     */
    models

    /**
     * Initialize the behaviour for many objects.
     * Called everytime objects of associated tags are added to the world
     * @param {World} world
     * @param {ObjectQuery} main
     * @param {...ObjectQuery} objects
     */
    init(world, main, ...objects){
        for(let obj of main){
            if(this.events)for(const [key,listener] of this.events) obj.observers(key).add(this.uid,listener)
            if(this.models)for(const [key,getter] of this.models) obj.set([key,this.uid],getter(obj))
        }
    }

    /**
     * Finish the behaviour
     * Called everytime objects of associated tags are removed from the world
     * @param {World} world
     * @param {ObjectQuery} main
     * @param {...ObjectQuery} objects
     */
    finish(world, main, ...objects){
        for(let obj of main){
            if(this.events) for(const [key] of this.events) obj.observers(key).remove(this.uid)
            if(this.models) for(const [key] of this.models) obj.remove([key,this.uid])
        }
    }

}