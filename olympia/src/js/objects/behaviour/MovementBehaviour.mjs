import { MOVEMENT, MovementModel } from "../model/MovementModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Angle, Quaternion, Vector3 } from "../../../../../babylonjs/core/index.js";
import { TRANSFORM } from "../model/TransformModel.mjs";


export class MovementBehaviour extends Behaviour{

    constructor(speed_preservation){
        super()
        this.speed_preservation=speed_preservation
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(let obj of objects){
            let movement=obj.get(MOVEMENT)
            if(!movement) obj.set(MOVEMENT,new MovementModel(new Vector3(0,0,0)))
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            let transform=obj.get(TRANSFORM)
            if(!transform)continue

            let movement=obj.get(MOVEMENT)
            if(!movement)continue
            

            transform.position.addInPlace(movement.inertia)
            movement.inertia= movement.inertia.scale(this.speed_preservation)

            const strength=movement.inertia.multiplyByFloats(1,0,1).length()
            if(strength>0.03){
                const quat = new Quaternion()
                Quaternion.FromUnitVectorsToRef(new Vector3(0,0,1), movement.inertia.normalizeToNew(), quat)
                const angles=quat.toEulerAngles()

                // Rotation
                let offset=angles.y-transform.rotation.y
                if(offset>Math.PI)offset-=Math.PI*2
                else if(offset<-Math.PI)offset+=Math.PI*2
                transform.rotation.y+=offset*0.1
            }
        }
    }

    get order() { return 1 }

    finish(){ }
}