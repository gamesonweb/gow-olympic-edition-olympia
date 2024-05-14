import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";

/**
 * Fait bouger un objet lors de l'appui sur des touches
 * Agit sur l'intertie.
 */
export class PlayerBehaviour extends Behaviour{

    /**
     * 
     * @param {[string,string,string,string]} param0 
     * @param {number} acceleration 
     * @param {number} max_speed 
     */
    constructor([left,up,right,bottom], acceleration, max_speed){
        super()
        this.left=left
        this.up=up
        this.right=right
        this.bottom=bottom
        this.acceleration=acceleration
        this.max_speed=max_speed
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        let dx=0
        let dz=0
        if(isKeyPressed(this.up))dz-=1
        if(isKeyPressed(this.bottom))dz+=1
        if(isKeyPressed(this.left))dx+=1
        if(isKeyPressed(this.right))dx-=1
        if(dx!=0 || dz!=0){
            dx*=this.acceleration
            dz*=this.acceleration
            for(let obj of objects){
                let movement=obj.get(MOVEMENT)
                if(!movement)continue
                accelerateX(movement.inertia, dx, this.max_speed)
                accelerateZ(movement.inertia, dz, this.max_speed)
            }
        }

    }

    finish(){ }
}