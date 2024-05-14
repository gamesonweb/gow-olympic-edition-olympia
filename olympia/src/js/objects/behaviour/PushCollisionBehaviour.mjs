import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { MESH } from "../model/MeshModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { ON_COLLISION } from "./collision/SimpleCollisionBehaviour.mjs";
import { MOVEMENT, accelerate, accelerateX, accelerateY, accelerateZ } from "../model/MovementModel.mjs";
import { Ray, Vector3 } from "../../../../../babylonjs/core/index.js";


export class PushCollisionBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.observers(ON_COLLISION).add("PushCollisionBehaviour",(self,{self_hitbox,object,hitbox})=>{
                const movement=obj.get(MOVEMENT)
                if(movement){
                    if(
                        hitbox.position.y+hitbox.scaling.y/2 < self_hitbox.position.y+self_hitbox.scaling.y/4 &&
                        hitbox.scaling.x+hitbox.scaling.z > (self_hitbox.scaling.x+self_hitbox.scaling.z)/3
                    ){
                        const depth=hitbox.position.y+hitbox.scaling.y/2 - self_hitbox.position.y + self_hitbox.scaling.y/2
                        if(depth>0)accelerateY(movement.inertia, depth/3, depth/3)

                        // Friction
                        const under=object.get(MOVEMENT)
                        if(under){
                            movement.inertia.multiplyInPlace(new Vector3(0.98,0.98,0.98))
                            accelerate(
                                movement.inertia, 
                                Math.sign(under.inertia.x)*0.01, Math.sign(under.inertia.y)*0.01, Math.sign(under.inertia.z)*0.01,
                                Math.abs(under.inertia.x), Math.abs(under.inertia.y), Math.abs(under.inertia.z)
                            )
                        }
                    }
                    else{
                        if(
                            self_hitbox.position.y < hitbox.position.y-hitbox.scaling.y/2
                        ){
                            const depth=(self_hitbox.position.y+self_hitbox.scaling.y/2) - (hitbox.position.y-hitbox.scaling.y/2)
                            if(depth>0)accelerateY(movement.inertia, -depth/6, depth/6)
                        }
                        else{
                            const offset=hitbox.position.subtract(self_hitbox.position)
                            if(Math.abs(offset.x)/hitbox.scaling.x>Math.abs(offset.z)/hitbox.scaling.z){
                                const strength=((hitbox.scaling.x+self_hitbox.scaling.x)/2-Math.abs(hitbox.position.x-self_hitbox.position.x))/4
                                if(strength>0)accelerateX(movement.inertia, strength*-Math.sign(offset.x), strength)
                            }
                            else{
                                const strength=((hitbox.scaling.z+self_hitbox.scaling.z)/2-Math.abs(hitbox.position.z-self_hitbox.position.z))/4
                                if(strength>0)accelerateZ(movement.inertia, strength*-Math.sign(offset.z), strength)
                            }
                        }
                    }
                }
            })
        }
    }

    tick(){}
    doTick=false

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects) obj.observers(ON_COLLISION).remove("PushCollisionBehaviour")
    }
}