import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, MovementModel, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";

/**
 * Fait tirer un objet lors de l'appui sur une touche
 */
export class PlayerShootBehaviour extends Behaviour{

    /**
     * @param {string} key La touche à presser pour tirer
     * @param {number} strength La force du tir
     * @param {number} reloading_time Le temps de rechargement
     * @param {import("../../world/TaggedDict.mjs").Tag[]} particle_tags Les tags à donner aux projectiles
     * @param {Vector3} size La taille des projectiles
     * @param {number=} shoot_count Le nombre de projectiles tirable à chaque rechargement
     * @param {number=} cadency La cadence de tir
     * @param {number=} knockback Le recul infligé au tireur
     */
    constructor(key, strength, reloading_time, particle_tags, size, shoot_count=1, cadency=20, knockback=1){
        super()
        this.key=key
        this.strength=strength
        this.reloading_time=reloading_time
        this.particle_tags=particle_tags
        this.size=size
        this.shoot_count=shoot_count
        this.cadency=cadency
        this.knockback=knockback
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.getOrSet(SHOOTING,()=>({reloading:0, cooldown:0, munition:this.shoot_count}))
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const shooting=obj.get(SHOOTING); if(!shooting)continue
            const transform=obj.get(TRANSFORM) ?? new TransformModel({})
            if(shooting.cooldown<=0){
                if(isKeyPressed(this.key) && shooting.munition>0){
                    obj.apply2(MOVEMENT, TRANSFORM, (move,tf)=>{
                        const direction=move.inertia.clone()
                        direction.y=0
                        direction.normalize()
                        const knockback=direction.clone().scale(-this.knockback)
                        const inertia=direction.scale(this.strength)

                        accelerateX(move.inertia, knockback.x*2, Math.abs(knockback.x))
                        accelerateZ(move.inertia, knockback.z*2, Math.abs(knockback.z))
                        
                        const bullet_location=transform.position.clone().addInPlaceFromFloats(
                            (tf.scale.x/2+this.size.x/2)*direction.x,
                            0,
                            (tf.scale.z/2+this.size.z/2)*direction.z,
                        )

                        world.add(
                            this.particle_tags,
                            new TransformModel({position:bullet_location, scale:this.size.clone(), rotation:tf.rotation.clone()}),
                            [MOVEMENT,new MovementModel(inertia)],
                        )
                    })
                    shooting.cooldown=this.cadency
                    shooting.reloading=this.reloading_time
                    shooting.munition--
                }
            }
            else shooting.cooldown--
            
            if(shooting.reloading==0)shooting.munition=this.shoot_count
            if(shooting.reloading>=0)shooting.reloading--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            obj.remove(SHOOTING)
        }
    }
}


/** @type {ModelKey<{reloading:number, cooldown:number, munition:number}>} */
export const SHOOTING=new ModelKey("shoot")