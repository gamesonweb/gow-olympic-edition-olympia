import { Vector3 } from "../../../../../babylonjs/core/index.js"
import { TransformModel } from "../model/TransformModel.mjs"
import { World } from "./World.mjs"


/**
 * 
 * @param {string} map 
 * @param {[number,number]} position 
 * @param {[number,number]} size 
 * @param {(letter:string, pos:[number,number], size:[number,number])=>void} factory
 * @param {number} wordLength The number of characters per tile
 * @param {boolean} isSizeOfTile Is the given size the size for the tile or the size for the whole map 
 */
export function forMap(map, position, size, factory, wordLength=1, isSizeOfTile=false){

    /** @type {Array<Array<string?>>} */
    let table=[]
    let column=[]

    // Get Width and Height
    let width=0
    let height=0
    let widtha=0
    for(let i=0; i<map.length; i++){
        if(map[i]===']'){
            column=[]
            widtha=0
        }
        else if(map[i]==='\n'){
            height++
            width=Math.max(width, widtha)
            widtha=0
            table.push(column)
            column=[]
        }
        else{
            const letter=map.substring(i,i+wordLength)
            i+=wordLength-1
            widtha++
            column.push(letter)
        }
    }
    table.push(column)
    width=Math.max(width, widtha)

    const get_size= (x,y)=>{
        let height=1, width=1
        while(table[y]?.[x+width]?.[0]=="-") width++
        while(table[y+height]?.[x]?.[0]=="|") height++
        for(let xx=0; xx<width; xx++){
            for(let yy=0; yy<height; yy++){
                if(table[y+yy]?.[x+xx]!==undefined)table[y+yy][x+xx]=null
            }
        }

        return [width,height]
    }

    // Map
    /** @type {[number,number]} */
    let cellsize
    if(isSizeOfTile) cellsize=size
    else cellsize=[size[0]/width, size[1]/height]
    for(let y=0; y<table.length; y++){
        for(let x=0; x<table[y].length; x++){
            var letter=table[y][x]
            if(letter===null)continue
            let size=get_size(x,y)
            factory(letter, [position[0]+x*cellsize[0], position[1]+y*cellsize[1]], [cellsize[0]*size[0], cellsize[1]*size[1]])
        }
    }
}


function codeToNum(code){
    if('0'.charCodeAt(0)<=code && code<='9'.charCodeAt(0)) return code-'0'.charCodeAt(0)+1
    else if('A'.charCodeAt(0)<=code && code<='Z'.charCodeAt(0))return code-'A'.charCodeAt(0)+11
    else throw new Error("Invalid number value. Should match [0-9A-Z]")
}

/** @typedef {import("../world/TaggedDict.mjs").Tag} Tag */
/** @typedef {import("./ModelHolder.mjs").ModelAndKey} ModelAndKey */

/**
 * @typedef {{
 *  tags?: Tag[] | (()=>Tag[]),
 *  models?: ()=>Array<ModelAndKey>,
 *  size?: Vector3 | ((it:Vector3)=>Vector3),
 *  position?: ((it:Vector3)=>Vector3),
 *  rotation?: Vector3
 * }} ObjectDefinition
 */

/**
 * 
 * @param {object} options
 * @param {Vector3} options.tile_size
 * @param {Vector3} options.position
 * @param {Object.<string,ObjectDefinition>} options.objects
 * @param {Array<string>|string} options.maps
 * @param {World} options.world
 * 
 */
export function createLevel(options){
    if(!(options.world instanceof World))throw new Error("options.world should be an instance of World")
    if(!(options.tile_size instanceof Vector3))throw new Error("options.tile_size should be an instance of Vector3")
    if(!(options.position instanceof Vector3))throw new Error("options.position should be an instance of Vector3")
    if(!options.objects)throw new Error("options.objects should be defined")
    if(!Array.isArray(options.maps)) options.maps=[options.maps]
    for(const map of options.maps){
        forMap(map, [0,0], [1,1], (letter, pos, size)=>{
            
            // Object type
            const object=options.objects[letter[0]]
            if(!object)throw new Error(`Object ${letter} not found`)
            
            const tags= object.tags ? (Array.isArray(object.tags) ? object.tags : object.tags()) : []

            const dim_transform = object.size ? ( object.size instanceof Vector3 ? it=>object.size : object.size) : it=>it

            const pos_transform= object.position ? object.position : it=>it

            const models= object.models?.() ?? []

            const rotation= object.rotation ?? Vector3.Zero()

            // Position and dimension
            let foot_height=codeToNum(letter.charCodeAt(1))
            let size_heigth=codeToNum(letter.charCodeAt(2))

            let dimension=options.tile_size.multiplyByFloats(size[0], size_heigth, size[1])
            dimension=dim_transform(dimension)

            let coordinates=options.position.add(new Vector3(
                pos[0]*options.tile_size.x+dimension.x/2,
                options.tile_size.z*foot_height+dimension.y/2, 
                pos[1]*options.tile_size.z+dimension.z/2
            ))
            coordinates=pos_transform(coordinates)
            
            options.world.add(tags, new TransformModel({rotation, position:coordinates, scale:dimension}), ...models)
        }, 3, true)
    }
}