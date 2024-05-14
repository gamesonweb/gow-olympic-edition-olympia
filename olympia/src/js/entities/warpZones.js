import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("warpZone", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("wallMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Black();
        mesh.checkCollisions = false;
    }
    return mesh;
}

//atterir sur un mu arrete la chute mais ne permet pas de ressauter
export class warpZone extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, xOut, yOut, zOut, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.mesh.xOut = xOut;
        this.mesh.yOut = yOut;
        this.mesh.zOut = zOut;
        this.mesh.checkCollisions = false;
    }

    
}