import { Mesh, Vector3 } from "../../../../../../babylonjs/core/index.js";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { HITBOX } from "../../model/HitboxModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";

/** @type {ObserverKey<{self_hitbox:Mesh, object:GameObject, hitbox:Mesh}>} */
export const ON_COLLISION=new ObserverKey("onCollision")

export class SimpleCollisionBehaviour extends Behaviour{

    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        let object_list=objects.collect()
        for(let i=0;i<object_list.length;i++){
            let obj1=object_list[i]
            let hitbox1=obj1.get(HITBOX)?.hitbox
            if(!hitbox1)continue
            for(let j=i+1;j<object_list.length;j++){
                let obj2=object_list[j]
                let hitbox2=obj2.get(HITBOX)?.hitbox
                if(!hitbox2)continue
                if(hitbox1.intersectsMesh(hitbox2,true)){
                    obj1.observers(ON_COLLISION).notify({self_hitbox:hitbox1, object:obj2, hitbox:hitbox2})
                    obj2.observers(ON_COLLISION).notify({self_hitbox:hitbox2, object:obj1, hitbox:hitbox1})
                }
            }
        }
    }

    finish(){ }
}