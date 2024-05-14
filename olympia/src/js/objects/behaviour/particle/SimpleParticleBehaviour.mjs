import { Behaviour } from "../Behaviour.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { MOVEMENT, accelerate } from "../../model/MovementModel.mjs"
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs"
import { Vector3 } from "../../../../../../babylonjs/core/index.js"
import { ModelKey } from "../../world/ModelHolder.mjs"


/**
 * Comportement de particule simple, déplace la particule grâce à l'inertie.
 */
export class SimpleParticleBehaviour extends Behaviour{

    /**
     * 
     * @param {Vector3} acceleration
     * @param {Vector3} maximum_speed
     * @param {Vector3} growing
     * @param {number} duration
     */
    constructor(acceleration, maximum_speed, growing, duration){
        super()
        this.acceleration=acceleration
        this.maximum_speed=maximum_speed
        this.growing=growing
        this.duration=duration
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world,objects){
        for(const obj of objects) obj.set(LOCAL,{age:0})
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            const state=obj.get(LOCAL); if(!state)continue
            state.age++
            if(state.age>this.duration){
                obj.kill()
                continue
            }

            const movement=obj.get(MOVEMENT); if(!movement)continue
            accelerate(movement.inertia, this.acceleration.x, this.acceleration.y, this.acceleration.z, this.maximum_speed.x, this.maximum_speed.y, this.maximum_speed.z)
            
            const transform=obj.get(TRANSFORM); if(!transform)continue
            if(this.duration-state.age<10){
                transform.scale.scaleInPlace(0.5)
            }
            else transform.scale.multiplyInPlace(this.growing)
        }
    }

    finish(){ }
}

/**
 * @param {World} world
 * @param {TransformModel} transform 
 * @param {import("../../world/TaggedDict.mjs").Tag[]} particle_tags
 * @param {Vector3} particle_size
 */
export function generateParticle(world, transform, particle_tags, particle_size){
    const position=transform.scale.clone()
    position.multiplyInPlace(Vector3.Random(0,1))
    position.subtractInPlace(transform.scale.scale(0.5))
    position.addInPlace(transform.position)
    world.add(particle_tags, new TransformModel({position:position, scale:particle_size, rotation:new Vector3(0, Math.random()*Math.PI*2, 0)}))
    /*let position=transform.scale.clone()
    position.multiplyInPlace(Vector3.Random(0,1))
    position.subtractInPlace(transform.scale.scale(0.5))
    position.addInPlace(transform.position)
    world.add(particle_tags, new TransformModel({scale:particle_size, position}))*/
}


/** @type {ModelKey<{age:number}}>} */
const LOCAL=new ModelKey("local")