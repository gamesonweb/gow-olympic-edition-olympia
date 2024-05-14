import { Vector3 } from "../../../../../babylonjs/core/index.js"
import { fastRemove } from "../../../../../samlib/Array.mjs"
import { MOVEMENT, accelerate } from "../model/MovementModel.mjs"
import { TRANSFORM, TransformModel } from "../model/TransformModel.mjs"
import { GameObject } from "../world/GameObject.mjs"
import { ModelKey } from "../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../world/World.mjs"
import { Behaviour } from "./Behaviour.mjs"


/**
 * Invoque des objets à intervalles réguliers.
 * Avec un nombre maximum d'objet limité.
 * Si un deuxième tag est fournit, alors les objets invoqués sont détruit si il n'y a
 * pas d'objet avec ce tag assez proche.
 */
export class SummonerBehaviour extends Behaviour{

    /**
     * 
     * @param {import("../world/TaggedDict.mjs").Tag[]} tags Les tags des objets invoqués
     * @param {Vector3=} relative_size La taille des objets invoqués relativement la la plus petite dimension horizontale de l'invoqueur
     * @param {number=} max_count Le nombre maximum d'objets invoqués 
     * @param {number=} interval L'intervalle entre chaque invocation
     * @param {number=} distance La distance maximale entre l'invoqueur et les objets invoqués, si les objets vont trop loins, ils sont attirés vers l'invocateur
     * @param {number=} dispawn_distance La distance maximale entre l'invoqueur et les objets du second tag avant que les objets invoqués soient détruits
     */
    constructor(tags, relative_size=Vector3.One(), max_count=1, interval=40, distance=6, dispawn_distance=10){
        super()
        this.tags=tags
        this.relative_size=relative_size
        this.max_count=max_count
        this.interval=interval
        this.distance=distance
        this.dispawn_distance=dispawn_distance

    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    init(_,objects){
        for(const obj of objects) obj.getOrSet([LOCAL,this.uid],()=>({loading:0,objects:[]}))
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} players
     */
    tick(world, objects, players){
        for(let obj of objects){
            obj.apply2([LOCAL,this.uid],TRANSFORM, (summoner,tf)=>{
                summoner.loading++
                if(summoner.loading>this.interval){
                    summoner.loading=0
                    
                    // Remove dead ones from list
                    for(let i=summoner.objects.length-1; i>=0; i--){
                        if(!summoner.objects[i].alive)fastRemove(summoner.objects,i)
                    }

                    // Summon
                    if(summoner.objects.length<this.max_count){
                        const maxdim=Math.min(tf.scale.x,tf.scale.z)
                        const size=this.relative_size.scale(maxdim)
                        const pos=tf.position.clone() .addInPlaceFromFloats(0,(tf.scale.y+size.y)/2,0)
                        const obj=world.add(this.tags, new TransformModel({position:pos, scale:size, rotation:tf.rotation.clone()}))
                        summoner.objects.push(obj)

                        obj.apply(MOVEMENT, mv=>mv.inertia.y+=0.2)
                    }

                    // Kill everybody if players is too far away
                    if(players){
                        let mindistance=Number.MAX_VALUE
                        for(const player of players)player.apply(TRANSFORM,ptf=>{
                            const distance=ptf.position.subtract(tf.position).length()
                            mindistance=Math.min(mindistance,distance)
                        })

                        if(mindistance>this.dispawn_distance){
                            for(const obj of summoner.objects) obj.kill()
                            summoner.objects.length=0
                        }
                    }
                }

                // Attract
                for(const obj of summoner.objects){
                    obj.apply2(TRANSFORM, MOVEMENT, (ttf,tmv)=>{
                        const offset=tf.position.subtract(ttf.position)
                        if(offset.length()>this.distance){
                            const d=offset.multiplyInPlace(new Vector3(1,0,1)).normalize().scaleInPlace(0.2)
                            accelerate(tmv.inertia, d.x,d.y,d.z, d.x,d.y,d.z)
                        }
                    })
                }
            })
        }
    }

    /**
     * @override
     * @param {ObjectQuery} objects
     */
    finish(_,objects){
        for(const obj of objects) obj.remove([LOCAL,this.uid])
    }
}

/** @type {ModelKey<{loading:number, objects:GameObject[]}>} */
const LOCAL=new ModelKey("local")