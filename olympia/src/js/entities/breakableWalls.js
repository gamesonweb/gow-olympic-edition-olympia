import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("breakableWall", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("breakableWallMaterial", scene);
        mesh.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5);
        mesh.checkCollisions = false;
    }
    return mesh;
}

//atterir sur un mu arrete la chute mais ne permet pas de ressauter. On peut s'en servir comme plateforme aussi
//même si le nom est trompeur
export class BreakableWall extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        
    }

    detectAttack(listeBreakableWalls){
            if (this.mesh.getScene().getMeshByName("attaque") && this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("attaque"))){
                this.mesh.dispose();
                listeBreakableWalls.splice(listeBreakableWalls.indexOf(this),1);
            }
    }
}

