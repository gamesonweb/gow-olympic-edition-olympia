import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { LIVING, LivingModel } from "../../model/LivingModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";


export class LivingBehaviour extends Behaviour{


    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(let obj of objects){
            obj.getOrSet(LIVING,()=>new LivingModel())
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            const living=obj.get(LIVING)
            if(living){
                if(living.life!=living._previous_life){
                    const offset=living.life-living._previous_life
                    living._previous_life=living.life
                    obj.observers(ON_LIVE_CHANGE).notify(offset)
                    if(living.life<=0){
                        obj.observers(ON_DEATH).notify()
                        if(living.life<=0)obj.kill()
                    }
                }
            }
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(let obj of objects){
            obj.remove(LIVING)
        }
    }
}

/** @type {ObserverKey<number>} */
export const ON_LIVE_CHANGE=new ObserverKey("on_live_change")

/** @type {ObserverKey<void>} */
export const ON_DEATH=new ObserverKey("on_death")