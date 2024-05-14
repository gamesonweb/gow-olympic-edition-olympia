import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("ground", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("groundMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Green();
        mesh.checkCollisions = false;
    }
    return mesh;
}

// Atterir sur un sol arrete la chute et permet de ressauter
export class Ground extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize,scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        //afficher les collisions
        //this.mesh.showBoundingBox = true;
        
    }
}
