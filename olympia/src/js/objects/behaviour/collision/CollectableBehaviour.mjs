import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { Behaviour } from "../Behaviour.mjs"
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs"


export class CollectableBehaviour extends Behaviour{

    /**
     * @param {(collecter:GameObject)=>boolean} collecter Appelé lorsqu'un objet le collecte. Si il renvoie true le collectable est supprimé. 
     */
    constructor(collecter){
        super()
        this.collecter=collecter
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    init(world, objects, targets){
        for(const obj of objects){
            obj.getOrSet([COLLECTABLE,this.uid],()=>({equippedTime:0}))
            obj.observers(ON_COLLISION).add(this.uid,(_,{object})=>{
                obj.apply([COLLECTABLE,this.uid], it=>{
                    if(it.equippedTime>0 || (targets && !targets.match(object)))return
                    if(this.collecter(object)){
                        it.equippedTime=20
                        obj.observers(ON_COLLECT).notify({collecter:object, equipper:this})
                        object.observers(ON_COLLECTED).notify({collectable:obj, equipper:this})
                    }
                })
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
            obj.apply([COLLECTABLE,this.uid], it=>{
                if(it.equippedTime==1){
                    obj.kill()
                }
                if(it.equippedTime>0){
                    it.equippedTime--
                    obj.apply(TRANSFORM, it=>it.scale.scaleInPlace(0.9))
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([COLLECTABLE,this.uid])
            obj.observers(ON_COLLISION).remove(this.uid)
        }
    }
}

/**
 * @param {CollectableBehaviour['collecter']} collecter
 */
export function behaviourCollectable(collecter){
    return new CollectableBehaviour(collecter)
}

/** @type {ModelKey<{equippedTime:number}>} */
export const COLLECTABLE=new ModelKey("collectable")

/** @type {ObserverKey<{collecter:GameObject, equipper:CollectableBehaviour}>} */
export const ON_COLLECT=new ObserverKey("on_collect")

/** @type {ObserverKey<{collectable:GameObject, equipper:CollectableBehaviour}>} */
export const ON_COLLECTED=new ObserverKey("on_collected")