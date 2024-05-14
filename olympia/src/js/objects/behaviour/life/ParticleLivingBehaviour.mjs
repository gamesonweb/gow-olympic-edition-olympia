import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING } from "../../model/LivingModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { generateParticle } from "../particle/SimpleParticleBehaviour.mjs";
import { ON_DEATH, ON_LIVE_CHANGE } from "./LivingBehaviour.mjs";


export class ParticleLivingBehaviour extends Behaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} tags 
     * @param {Vector3} size 
     */
    constructor(tags,size){
        super()
        this.tags=tags
        this.size=size
    }
    
    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        this.eventid=ObserverGroup.generateName("particleliving")
        for(const obj of objects){
            obj.observers(ON_LIVE_CHANGE).add(this.eventid, (target,change)=>{
                if(change<0)obj.apply(TRANSFORM, tf=>{
                    for(let i=0; i<8; i++)generateParticle(world,tf,this.tags,this.size.clone())
                })
            })
            obj.observers(ON_DEATH).add(this.eventid, (target)=>{
                obj.apply(TRANSFORM, tf=>{
                    for(let i=0; i<20; i++)generateParticle(world,tf,this.tags,this.size.clone())
                })
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply2(LIVING, TRANSFORM, (living,transform)=>{
                if(living.life==1){
                    if(world.age%10==0)generateParticle(world,transform,this.tags,this.size.clone())
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        if(this.eventid)for(const obj of objects){
            obj.observers(ON_LIVE_CHANGE).remove(this.eventid)
            obj.observers(ON_DEATH).remove(this.eventid)
        }
    }
}