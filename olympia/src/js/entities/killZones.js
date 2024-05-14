import Entities from "./entities.js";


let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("killZone", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("killZoneMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Purple();
        mesh.visibility = 0.5;
        mesh.checkCollisions = false;
    }
    return mesh;
}

export class killZone extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene), scene);
        this.mesh.checkCollisions = false;
    }


}