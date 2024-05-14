import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { generateParticle } from "./SimpleParticleBehaviour.mjs";


/**
 * Emet des objets à intervalle régulier tout autour de l'objet.
 * Utile pour les particules.
 */
export class EmitterBehaviour extends Behaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} tags Les tags à donner aux particules.
     * @param {Vector3} size La taille des particules.
     * @param {number=} time_spacing L'intervalle de temps entre chaque émission.
     */
    constructor(tags,size,time_spacing=10){
        super()
        this.tags=tags
        this.size=size
        this.time_spacing=time_spacing
    }
    
    init(){}

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply(TRANSFORM, transform=>{
                if(world.age%this.time_spacing==0)generateParticle(world,transform,this.tags,this.size.clone())
            })
        }
    }

    finish(){}
}