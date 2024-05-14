import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("lvlWarp", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("lvlWarpMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.White();
        mesh.checkCollisions = false;
    }
    return mesh;
}
//atterir sur un mu arrete la chute mais ne permet pas de ressauter
export class lvlWarp extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, nbLevel, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.nbLevel = nbLevel;
        this.mesh.checkCollisions = false;
    }
    
}