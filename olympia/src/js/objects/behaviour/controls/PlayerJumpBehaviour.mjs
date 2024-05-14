import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, accelerateY } from "../../model/MovementModel.mjs";
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";

/**
 * Fait sauter lors de l'appui sur une touche
 * Agit sur l'intertie.
 */
export class PlayerJumpBehaviour extends Behaviour{

    /**
     * @param {string} key La touche à presser pour sauter
     * @param {number} strength La force du saut
     * @param {number} jump_count Le nombre de saut possible avant de retoucher le sol
     * @param {import("../../world/TaggedDict.mjs").Tag[]=} particle Les tags à donner aux particules
     */
    constructor(key, strength, jump_count, particle=undefined){
        super()
        this.key=key
        this.strength=strength
        this.jump_count=jump_count
        this.particle=particle
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        this.eventid=ObserverGroup.generateName()
        for(const obj of objects){
            obj.getOrSet(JUMP,()=>new JumpModel())
            obj.observers(ON_COLLISION).add(this.eventid, (self,{hitbox,object,self_hitbox})=>{
                if(self_hitbox.position.y-self_hitbox.scaling.y/3 > hitbox.position.y+hitbox.scaling.y/2){
                    obj.apply(JUMP, jump=>jump.remaining_jump=this.jump_count)
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const jump=obj.get(JUMP); if(!jump)continue
            if(jump.cooldown<=0){
                if(isKeyPressed(this.key) && jump.remaining_jump>0){
                    console.log("jump")
                    obj.apply(MOVEMENT, move=>{
                        accelerateY(move.inertia, this.strength*2, this.strength)
                        const particle=this.particle
                        if(particle)obj.apply(TRANSFORM, tf=>{
                            world.add(particle, new TransformModel({copied:tf}))
                        })
                    })
                    jump.cooldown=14
                    jump.remaining_jump--
                }
            }
            else jump.cooldown--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            if(this.eventid) obj.observers(ON_COLLISION).remove(this.eventid)
            obj.remove(JUMP)
        }
    }
}

export class JumpModel{
    cooldown=0
    remaining_jump=0
}

/** @type {ModelKey<JumpModel>} */
export const JUMP=new ModelKey("jump")