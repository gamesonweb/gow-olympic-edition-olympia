import { MOVEMENT, MovementModel } from "../model/MovementModel.mjs";
import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { TRANSFORM } from "../model/TransformModel.mjs";
import { isKeyPressed} from "../../controls/Keyboard.mjs"

export class ConstantForceBehaviour extends Behaviour{

    /**
     * 
     * @param {Vector3} force
     */
    constructor(force){
        super()
        this.force=force
    }

    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            let movement=obj.get(MOVEMENT)
            if(!movement)continue

            movement.inertia.addInPlace(this.force)
        }
    }

    finish(){ }
}