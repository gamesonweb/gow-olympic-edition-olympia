import { LIVING } from "../../model/LivingModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


/**
 * Inflige régulièrement des dégats avant de disparaitre.
 */
export class PoisonBehaviour extends Behaviour{

    /**
     * @param {number} damage
     * @param {number} interval 
     * @param {number} duration
     */
    constructor(damage,interval,duration){
        super()
        this.damage=damage
        this.interval=interval
        this.duration=duration
    }
    
    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects){
            console.log("give init")
            obj.set([POISON,this.uid],{remaining_time:this.duration})
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply([POISON,this.uid], (poison)=>{
                if(poison.remaining_time%this.interval==0){
                    obj.apply(LIVING,l=>l.damage(this.damage))
                }

                poison.remaining_time--
                if(poison.remaining_time<0){
                    obj.removeTag(...objects.tags)
                }
            })
        }
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects){
            obj.remove([POISON,this.uid])
        }
    }
}

/** @type {ModelKey<{remaining_time:number}>} */
export const POISON=new ModelKey("poison")