import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs";
import { HITBOX, HitboxModel } from "../model/HitboxModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";


export class HitboxBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.getOrSet(HITBOX,()=>{
                const ret=new HitboxModel(world)
                const transform=obj.get(TRANSFORM); if(!transform)return ret
                ret.hitbox.position=transform.position
                ret.hitbox.rotation=transform.rotation
                ret.hitbox.scaling=transform.scale
                return ret
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
            let hitbox=obj.get(HITBOX)?.hitbox
            if(!hitbox)continue
            let transform=obj.get(TRANSFORM) ?? TransformModel.ZERO
            if(transform.position._isDirty) hitbox.position=transform.position
            if(transform.rotation._isDirty) hitbox.rotation=transform.rotation
            if(transform.scale._isDirty) hitbox.scaling=transform.scale
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.get(HITBOX)?.hitbox?.dispose()
            obj.remove(HITBOX)
        }
    }

    get order() {return 2}
}