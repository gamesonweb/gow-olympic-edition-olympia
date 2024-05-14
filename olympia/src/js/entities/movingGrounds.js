import Entities from "./entities.js";
import { Ground } from "./grounds.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("movingGround", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("groundMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Green();
        mesh.checkCollisions = false;
    }
    return mesh;
}

// Atterir sur un sol arrete la chute et permet de ressauter
export class MovingGround extends Ground {
    constructor(name,x,y,z,xSize,ySize,zSize, x2, y2, z2, speed, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        //afficher les collisions
        //this.mesh.showBoundingBox = true;
        this.x1 = x;
        this.y1 = y;
        this.z1 = z;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.direction = new BABYLON.Vector3(0,0,0);
        this.speed = speed;

        
    }

    //fonction de déplacement, fait des aller retour entre 2 points en entrant les coordonnées des points
    move(){
        //si on est à la position 1
        if (Math.abs(this.mesh.position.x - this.x1) < 0.1 && Math.abs(this.mesh.position.y - this.y1) < 0.1 && Math.abs(this.mesh.position.z - this.z1) < 0.1){
            //calculer la direction
            this.direction = new BABYLON.Vector3(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
            //normaliser la direction
            this.direction = this.direction.normalize();
        }
        //si on est à la position 2 (à peu près)
        else if (Math.abs(this.mesh.position.x - this.x2) < 0.1 && Math.abs(this.mesh.position.y - this.y2) < 0.1 && Math.abs(this.mesh.position.z - this.z2) < 0.1){
            //calculer la direction
            this.direction = new BABYLON.Vector3(this.x1 - this.x2, this.y1 - this.y2, this.z1 - this.z2);
            //normaliser la direction
            this.direction = this.direction.normalize();
        }
        //déplacer le sol
        this.mesh.position.x += this.direction.x * this.speed;
        this.mesh.position.y += this.direction.y * this.speed;
        this.mesh.position.z += this.direction.z * this.speed;
        
    }

}
