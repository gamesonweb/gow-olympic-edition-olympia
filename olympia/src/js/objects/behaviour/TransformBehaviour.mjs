import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { HITBOX, HitboxModel } from "../model/HitboxModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";


export class TransformBehaviour extends Behaviour{

    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply(TRANSFORM, tf=>{
                tf.position._isDirty=false
                tf.rotation._isDirty=false
                tf.scale._isDirty=false
            })
        }
    }

    finish(){ }

    get order() {return 100}
}