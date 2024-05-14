import { World } from "../objects/world/World.mjs";
import { Camera } from "../../../../babylonjs/core/Cameras/camera.js"




export class Level{

    /**
     * Called when the level is started
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    start(world,options){
        throw new Error("Not implemented")
    }

    /**
     * Called each tick when the world is running
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    tick(world,options){
        throw new Error("Not implemented")
    }

    /**
     * Called when the level is finished.
     * It can restart after.
     * @param {World} world 
     * @param {{camera:Camera}} options 
     */
    stop(world,options){
        throw new Error("Not implemented")
    }
}