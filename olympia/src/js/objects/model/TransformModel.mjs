import { Color3, MeshBuilder, Vector3 } from "../../../../../babylonjs/core/index.js";
import { ModelKey } from "../world/ModelHolder.mjs";
import { World } from "../world/World.mjs";

export class TransformModel{
    
    /**
     * 
     * @param {{
     *  position?: Vector3|TransformModel?,
     *  rotation?: Vector3|TransformModel?,
     *  scale?: Vector3|TransformModel?,
     *  copied?: TransformModel?
     * }} param0 
     */
    constructor({position=null, rotation=null, scale=null, copied=null}){
        if(copied!=null){
            this._position=copied.position.clone()
            this._rotation=copied.rotation.clone()
            this._scale=copied.scale.clone()
        }
        if(position instanceof Vector3)this._position=position
        else if(position!=null)this._position=position.position.clone()
        
        if(rotation instanceof Vector3)this._rotation=rotation
        else if(rotation!=null)this._rotation=rotation.rotation.clone()

        if(scale instanceof Vector3)this._scale=scale
        else if(scale!=null)this._scale=scale.scale.clone()

        if(this._position==undefined)this._position=Vector3.Zero()
        if(this._rotation==undefined)this._rotation=Vector3.Zero()
        if(this._scale==undefined)this._scale=Vector3.One()
    }

    /** @returns {Vector3} */ get position(){return this._position}
    /** @returns {Vector3} */ get rotation(){return this._rotation}
    /** @returns {Vector3} */get scale(){return this._scale}

    /**
     * @return {TransformModel}
     */
    clone(){
        return new TransformModel({position:this.position.clone(), rotation:this.rotation.clone(), scale:this.scale.clone()})
    }

    /**
     * @param {TransformModel} copied 
     */
    copyFrom(copied){
        this.position.copyFrom(copied.position)
        this.rotation.copyFrom(copied.rotation)
        this.scale.copyFrom(copied.scale)
    }

    static ZERO=new TransformModel({position:new Vector3(0,0,0), rotation:new Vector3(0,0,0), scale:new Vector3(1,1,1)})

    get model_key(){ return TRANSFORM }
}

/** @type {ModelKey<TransformModel>} */
export const TRANSFORM=new ModelKey("transform")