import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING } from "../../model/LivingModel.mjs";
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";

export class MeleeAttackBehaviour extends Behaviour{

    /**
     * @param {number} acceleration 
     * @param {number} max_speed 
     * @param {number} follow_distance
     * @param {object} options
     * @param {number=} options.damage Les dégâts infligés par l'attaque au corps à corps
     * @param {Array<Vector3|null>=} options.targets Une liste de cibles à attaquer successivement, en positions relatives à l'ennemi le plus proche, ou null pour ne pas bouger.
     * @param {number=} options.targeting_time Le temps pendant lequel on reste sur une cible avant de passer à la suivante
     */
    constructor(acceleration, max_speed, follow_distance, options={}){
        super()
        this.acceleration=acceleration
        this.max_speed=max_speed
        this.follow_distance=follow_distance
        this.damage=options.damage ?? 1
        this.targeting_time=options.targeting_time ?? 20
        this.targets=options.targets ?? [new Vector3(0,0,0)]
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    init(world, objects, targets){
        for(const obj of objects){
            obj.set([LOCAL,this.uid],{loading:0,target_loading:0,actual_target:0})
            obj.observers(ON_COLLISION).add(this.uid,(self,{object,hitbox,self_hitbox})=>{
                if(!targets.match(object)) return
                if(obj.get([LOCAL,this.uid])?.loading??0 > 0) return

                const living=object.get(LIVING)
                if(living)living.damage(this.damage)

                const pushable=object.get(MOVEMENT)
                if(pushable){
                    const strength=this.damage*0.2
                    const offset=hitbox.position.subtract(self_hitbox.position)
                    offset.y=0
                    offset.normalize()
                    offset.scaleInPlace(strength)
                    accelerate(pushable.inertia, offset.x, offset.y+strength/4, offset.z, strength, strength, strength)
                }

                obj.apply([LOCAL,this.uid], m=>{ m.loading=20 })
            })

        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    tick(world, objects, targets){
        for(const obj of objects){
            const objp=obj.get(TRANSFORM); if(!objp)continue
            const local=obj.get([LOCAL,this.uid]); if(!local)continue
            for(const target of targets){
                // Trouve un objet cible, l'objet cible possible la plus proche
                const tarp=target.get(TRANSFORM); if(!tarp)continue
                const offset=tarp.position.subtract(objp.position)
                if(offset.length()<=this.follow_distance){
                    const movement=obj.get(MOVEMENT); if(!movement)continue

                    // Récupère la position cible
                    local.target_loading++
                    if(local.target_loading>=this.targeting_time){
                        local.target_loading=0
                        local.actual_target=(local.actual_target+1)%this.targets.length
                    }
                    let target_pos=this.targets[local.actual_target]
                    if(target_pos==null)target_pos=objp.position
                    else target_pos=target_pos.add(tarp.position)

                    // Movement
                    const direction=target_pos.subtract(objp.position).normalize().scaleInPlace(this.acceleration)
                    accelerate(movement.inertia, direction.x, direction.y, direction.z, this.max_speed, this.max_speed, this.max_speed)
                }
            }
            if(local.loading>0) local.loading--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([LOCAL,this.uid])
            obj.observers(ON_COLLISION).remove(this.uid)
        }
    }
}


/** @type {ModelKey<{loading:number, actual_target:number, target_loading:number}>} */
const LOCAL=new ModelKey("meleeattack")