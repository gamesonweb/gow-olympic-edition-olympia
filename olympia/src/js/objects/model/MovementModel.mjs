import { Vector3 } from "../../../../../babylonjs/core/Maths/math.js";
import { ModelKey } from "../world/ModelHolder.mjs";

export class MovementModel{
    
    /**
     * @param {Vector3} inertia 
     */
    constructor(inertia){
        this.inertia=inertia
    }

    get model_key(){return MOVEMENT}
}

/** @type {ModelKey<MovementModel>} */
export const MOVEMENT=new ModelKey("movement")

/**
 * Accelerate an inertia vector
 * @param {Vector3} inertia 
 * @param {number} dx 
 * @param {number} dy 
 * @param {number} dz 
 */
export function accelerate(inertia, dx, dy, dz, maxx, maxy, maxz){
    accelerateX(inertia, dx, maxx)
    accelerateY(inertia, dy, maxy)
    accelerateZ(inertia, dz, maxz)
}

/**
 * Accelerate an inertia vector on the x axis
 * @param {Vector3} inertia 
 * @param {number} dx 
 * @param {number} maxx 
 */
export function accelerateX(inertia, dx, maxx){
    const sign=Math.sign(dx)
    if(dx>0 && inertia.x<maxx) inertia.x=Math.min(maxx, inertia.x+dx)
    else if(dx<0 && inertia.x>-maxx) inertia.x=Math.max(-maxx, inertia.x+dx)
}

/**
 * Accelerate an inertia vector on the y axis
 * @param {Vector3} inertia 
 * @param {number} dy 
 * @param {number} maxy 
 */
export function accelerateY(inertia, dy, maxy){
    const sign=Math.sign(dy)
    if(dy>0 && inertia.y<maxy) inertia.y=Math.min(maxy, inertia.y+dy)
    else if(dy<0 && inertia.y>-maxy) inertia.y=Math.max(-maxy, inertia.y+dy)
}

/**
 * Accelerate an inertia vector on the z axis
 * @param {Vector3} inertia 
 * @param {number} dz 
 * @param {number} maxz 
 */
export function accelerateZ(inertia, dz, maxz){
    const sign=Math.sign(dz)
    if(dz>0 && inertia.z<maxz) inertia.z=Math.min(maxz, inertia.z+dz)
    else if(dz<0 && inertia.z>-maxz) inertia.z=Math.max(-maxz, inertia.z+dz)
}
