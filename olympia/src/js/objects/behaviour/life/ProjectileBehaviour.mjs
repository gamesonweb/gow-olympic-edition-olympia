import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { HITBOX, HitboxModel } from "../../model/HitboxModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { ObserverGroup, ObserverKey, observers } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs"


export class ProjectileBehaviour extends Behaviour{

    /**
     * 
     * @param {number} damage
     * @param {number} knockback
     * @param {number} lifetime
     * @param {import("../../world/TaggedDict.mjs").Tag[]=} given
     */
    constructor(damage, knockback, lifetime, given=[]){
        super()
        this.damage=damage
        this.knockback=knockback
        this.lifetime=lifetime
        this.given=given
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} shootable
     */
    init(world,objects,shootable){
        this.eventid=ObserverGroup.generateName("projectile")
        for(let obj of objects){
            obj.getOrSet(PROJECTILE, ()=>({age:0}))
            obj.observers(ON_COLLISION).add(this.eventid, (_,{object,self_hitbox,hitbox})=>{
                if(!shootable.match(object))return
                if(obj.get(PROJECTILE)?.dying??false)return

                object.apply(LIVING,living=>{
                    living.damage(this.damage)
                })
                obj.apply(MOVEMENT, thismove=>{
                    object.apply(MOVEMENT, movement=>{
                        const offset=thismove.inertia.clone()
                        offset.y=0
                        offset.normalize()
                        offset.scaleInPlace(this.knockback)
                        accelerate(movement.inertia, offset.x, this.knockback/8, offset.z, this.knockback, this.knockback/8, this.knockback)
                    })
                })
                obj.apply(PROJECTILE, it=>{
                    it.dying=true
                    it.age=Math.max(it.age, this.lifetime-10)
                })
                object.addTag(...this.given)
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply(PROJECTILE, projectile=>{
                projectile.age++
                if(projectile.age>this.lifetime)world.remove(obj)
                if(this.lifetime-projectile.age<5)obj.apply(TRANSFORM, transform=>transform.scale.scaleInPlace(0.5))
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.remove(PROJECTILE)
            if(this.eventid) obj.observers(ON_COLLISION).remove(this.eventid)
        }
    }
}

/** @type {ObserverKey<number>} */
export const ON_ATTACK=new ObserverKey("on_attack")

/** @type {ModelKey<{age:number,dying:boolean}>} */
export const PROJECTILE=new ModelKey("projectile")