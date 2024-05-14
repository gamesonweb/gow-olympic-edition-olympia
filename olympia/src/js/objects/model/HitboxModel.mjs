import { BoundingBox, Color3, MeshBuilder, TransformNode, Vector3 } from "../../../../../babylonjs/core/index.js";
import { ModelKey } from "../world/ModelHolder.mjs";
import { World } from "../world/World.mjs";
import { SCENE } from "./MeshModel.mjs";

export class HitboxModel{

    #hitbox
    
    /**
     * @param {World} world 
     */
    constructor(world){
        this.#hitbox=MeshBuilder.CreateBox("hitbox", {width: 1, height: 1, depth: 1}, world.model.get(SCENE));
        this.#hitbox.isVisible=false
    }

    get hitbox(){ return this.#hitbox }
}

/** @type {ModelKey<HitboxModel>} */
export const HITBOX=new ModelKey("hitbox")