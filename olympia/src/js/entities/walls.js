import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("wall", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("wallMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Blue();
        mesh.checkCollisions = false;
    }
    return mesh;
}

//atterir sur un mu arrete la chute mais ne permet pas de ressauter. On peut s'en servir comme plateforme aussi
//même si le nom est trompeur
export class Wall extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        
    }
}