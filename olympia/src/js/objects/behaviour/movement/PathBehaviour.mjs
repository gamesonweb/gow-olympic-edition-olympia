import { Behaviour } from "../Behaviour.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { MOVEMENT } from "../../model/MovementModel.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"


export class PathBehaviour extends Behaviour{

    /**
     * 
     * @param {Array<Vector3>} offseted_path
     * @param {number} validation_distance
     * @param {number} acceleration
     * @param {number} max_speed
     */
    constructor(offseted_path, validation_distance, acceleration, max_speed){
        super()
        this.offseted_path=offseted_path
        this.validation_distance=validation_distance
        this.acceleration=acceleration
        this.max_speed=max_speed
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            const transform=obj.get(TRANSFORM)
            if(transform){
                obj.set(PATH,new PathModel(this.offseted_path.map(v=>v.add(transform.position))))
            }
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            let path=obj.get(PATH); if(!path)continue
            let movement=obj.get(MOVEMENT); if(!movement)continue
            let transform=obj.get(TRANSFORM); if(!transform)continue

            const actual=path.actual()
            const offset=actual.subtract(transform.position)
            const speed=offset.clone()
            speed.normalize()
            speed.scaleInPlace(this.acceleration)
            speed.addInPlace(movement.inertia)
            speed.minimizeInPlaceFromFloats(this.max_speed,this.max_speed,this.max_speed)
            speed.maximizeInPlaceFromFloats(-this.max_speed,-this.max_speed,-this.max_speed)
            movement.inertia.copyFrom(speed)
            if(offset.length()<this.validation_distance)path.next()
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove(PATH)
        }
    }
}


export class PathModel{


    index=0

    /**
     * @param {Array<Vector3>} path
     */
    constructor(path){
        this.path=path
    }

    next(){
        this.index++
        if(this.index>=this.path.length)this.index=0
    }

    actual(){
        return this.path[this.index]
    }
}


/** @type {ModelKey<PathModel>} */
export const PATH=new ModelKey("path")