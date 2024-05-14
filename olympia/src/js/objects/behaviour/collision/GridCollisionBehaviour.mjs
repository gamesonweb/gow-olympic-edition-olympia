import { Mesh, Vector3 } from "../../../../../../babylonjs/core/index.js";
import { fastRemoveValue } from "../../../../../../samlib/Array.mjs";
import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { HITBOX } from "../../model/HitboxModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "./SimpleCollisionBehaviour.mjs";

/**
 * Une behaviour qui gère les collisions entre les objets du monde.
 * Il le fait de manière plus optimisé en rengeant les objets dans une grille avant de tester les collisions.
 * Sur les objets qui sont dans la même case.
 */
export class GridCollisionBehaviour extends Behaviour{

    /**
     * 
     * @param {number} sx
     * @param {number} sy
     * @param {number} sz
     */
    constructor(sx,sy,sz){
        super()
        this.sx=sx
        this.sy=sy
        this.sz=sz

        /** @type {Array<Array<Array<Array<[GameObject, minx:number,miny:number,minz:number, maxx:number,maxy:number,maxz:number]>>>>} */
        this.grid=[]

        for(let x=0; x<sx; x++) {
            this.grid.push([])
            for(let y=0; y<sy; y++){
                this.grid[this.grid.length-1].push([])
                for(let z=0; z<sz; z++){
                    this.grid[this.grid.length-1][this.grid[this.grid.length-1].length-1].push([])
                }
            }
        }
        console.log(this.grid)
    }

    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        // Get the bounding box around all the objects
        let min=new Vector3(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY)
        let max=new Vector3(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY)

        for(let obj of objects){
            let hitbox=obj.get(HITBOX)?.hitbox
            if(!hitbox)continue
            min.minimizeInPlace(hitbox.position.subtract(hitbox.scaling.scale(0.5)))
            max.maximizeInPlace(hitbox.position.add(hitbox.scaling.scale(0.5)))
        }

        const dimension=max.subtract(min)
        
        //Put the the objects in the grid
        for(let obj of objects){
            let hitbox=obj.get(HITBOX)?.hitbox
            if(!hitbox)continue
            let omin=hitbox.position.subtract(hitbox.scaling.scale(0.5)).subtractInPlace(min)
            let omax=hitbox.position.add(hitbox.scaling.scale(0.5)).subtractInPlace(min)
            let minx=Math.floor(omin.x/dimension.x), maxx=Math.ceil(omax.x/dimension.x)
            let miny=Math.floor(omin.y/dimension.y), maxy=Math.ceil(omax.y/dimension.y)
            let minz=Math.floor(omin.z/dimension.z), maxz=Math.ceil(omax.z/dimension.z)
            const entry=[obj,minx,miny,minz,maxx,maxy,maxz]
            for(let x=minx; x<maxx; x++){
                for(let y=miny; y<maxy; y++){
                    for(let z=minz; z<maxz; z++){
                        this.grid[x][y][z].push(entry)
                    }
                }
            }
        }

        // Test the collisions
        for(let x=0; x<this.sx; x++){
            for(let y=0; y<this.sy; y++){
                for(let z=0; z<this.sz; z++){
                    let objects=this.grid[x][y][z]
                    while(objects.length>0){
                        const entry=objects[0]
                        let [obj1,minx,miny,minz,maxx,maxy,maxz]=entry
                        for(let x=minx; x<maxx; x++){
                            for(let y=miny; y<maxy; y++){
                                for(let z=minz; z<maxz; z++){
                                    fastRemoveValue(this.grid[x][y][z],entry)
                                }
                            }
                        }
                        let hitbox1=obj1.get(HITBOX)?.hitbox
                        if(!hitbox1)continue
                        for(let j=0;j<objects.length;j++){
                            let obj2=objects[j][0]
                            let hitbox2=obj2.get(HITBOX)?.hitbox
                            if(!hitbox2)continue
                            if(hitbox1.intersectsMesh(hitbox2,true)){
                                obj1.observers(ON_COLLISION).notify({self_hitbox:hitbox1, object:obj2, hitbox:hitbox2})
                                obj2.observers(ON_COLLISION).notify({self_hitbox:hitbox2, object:obj1, hitbox:hitbox1})
                            }
                        }
                    }
                }
            }
        }
    }

    finish(){ }
}