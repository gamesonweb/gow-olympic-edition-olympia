import { Behaviour } from "../Behaviour.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { MOVEMENT } from "../../model/MovementModel.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObserverGroup, ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs"
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs"
import { equip } from "../../model/SlotModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"


export class EquipperBehaviour extends Behaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} given Les tags donnés.
     * @param {string?} slot Le slot où les objets sont donnés.
     */
    constructor(given,slot=null){
        super()
        this.given=given
        this.slot=slot
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    init(world, objects, targets){
        for(const obj of objects){
            obj.getOrSet(EQUIPPER,()=>({equippedTime:0}))
            obj.observers(ON_COLLISION).add(this.uniqueId(),(_,{object})=>{
                obj.apply(EQUIPPER, it=>{
                    if(it.equippedTime>0 || !targets.match(object))return
                    it.equippedTime=20
                    equip(object,this.slot,this.given)
                    obj.observers(ON_EQUIP).notify({equipped:object, equipper:this})
                    object.observers(ON_EQUIPPED).notify({giver:obj, equipper:this})
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
            obj.apply(EQUIPPER, it=>{
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
            obj.remove(EQUIPPER)
            obj.observers(ON_COLLISION).remove(this.uniqueId())
        }
    }
}


/** @type {ModelKey<{equippedTime:number}>} */
export const EQUIPPER=new ModelKey("equipper")

/** @type {ObserverKey<{equipped:GameObject, equipper:EquipperBehaviour}>} */
export const ON_EQUIP=new ObserverKey("onEquip")

/** @type {ObserverKey<{giver:GameObject, equipper:EquipperBehaviour}>} */
export const ON_EQUIPPED=new ObserverKey("onEquipped")