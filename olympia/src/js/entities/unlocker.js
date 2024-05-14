import { message } from "../script.js";
import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        //créer un anneau de taille 1
        mesh = BABYLON.MeshBuilder.CreateTorus("unlocker", {diameter: 1, thickness: 0.1, tessellation: 32}, scene);
        //tourner à la verticale
        mesh.rotation.x = Math.PI/2;
        mesh.isVisible = false;
        mesh.registerInstancedBuffer("color", 4);
        mesh.material = new BABYLON.StandardMaterial("unlockerMaterial", scene);
        mesh.material.diffuseColor = new BABYLON.Color3(1,1,1);
        mesh.checkCollisions = false;
    }
    return mesh;
}

//permet au joueur de débloquer une capacité différente en fonction du nbPower
export class Unlocker extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, nbPower, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.nbPower = nbPower;
        this.mesh.instancedBuffers.color = BABYLON.Color3.White();
        this.mesh.checkCollisions = false;
        switch(nbPower){
            case 1:
                this.mesh.instancedBuffers.color = new BABYLON.Color3(1,0,0);
                break;
            case 2:
                this.mesh.instancedBuffers.color = new BABYLON.Color3(0,0.5,0);
                break;
            case 3:
                this.mesh.instancedBuffers.color = new BABYLON.Color3(0.5,0.25,0);
                break;
            case 4:
                this.mesh.instancedBuffers.color = new BABYLON.Color3(1,1,0);
                break;
            default:
                break;
        }
    }

    //débloquer une capacité
    unlock(player){
        switch(this.nbPower){
            case 1:
                player.unlockAttack = true;
                console.log("attack unlocked");
                break;
            case 2:
                player.maxJump =1;
                console.log("jump unlocked");
                break;
            case 3:
                player.unlockShield = true;
                console.log("shield unlocked");
                break;
            case 4:
                player.unlockDash = true;
                console.log("dash unlocked");
                break;
            default:
                break;
        }
        

        //afficher le message de déblocage
        this.displayMessage(this.nbPower);

    }

    //afficher le message de déblocage
    displayMessage(nbPower){
        if(nbPower === 1){
            message.send("Vous avez débloqué l'attaque! Appuyez sur 'K' pour attaquer devant vous!", 6000, "unlock");
        }
        if(nbPower === 2){
            message.send("Vous avez débloqué le saut! Appuyez sur 'espace' pour sauter!", 6000, "unlock");
        }
        if(nbPower === 3){
            message.send("Vous avez débloqué le bouclier! Appuyez sur 'O' pour immobiliser les ennemis proches!", 6000, "unlock");
        }
        if(nbPower === 4){
            message.send("Vous avez débloqué la charge! Appuyez sur 'Maj Gauche' pour charger dans une direction!", 6000, "unlock");
        }
    }

}

