// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Ground } from "../entities/grounds.js";
import { MovingGround } from "../entities/movingGrounds.js";
import { Wall } from "../entities/walls.js";
import { BreakableWall } from "../entities/breakableWalls.js";
import { killZone } from "../entities/killZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";
import { Canon } from "../entities/canons.js";
import { BossBasket } from "../entities/bossBasket.js";
// Constructeur de niveau
export class LvlBoss1 {
    constructor( player,listes) {
        // reset le joueur
        player.resetPosition();

        //créer un sol de départ
        const ground = new Ground("Ground1",0, -1, 0, 5, 1, 5,this.scene);
        listes[1].push(ground);
        //note les coordonnées du milieu du sol de départ
        let coordDepart = new BABYLON.Vector3(ground.mesh.position.x, ground.mesh.position.y, ground.mesh.position.z);

        const couloir = new Ground("couloir",coordDepart.x, coordDepart.y, coordDepart.z-10, 5, 1, 20,this.scene);
        listes[1].push(couloir);

        const plateforme = new Ground("plateforme",coordDepart.x, coordDepart.y, coordDepart.z-25, 50, 1, 10,this.scene);
        listes[1].push(plateforme);

        //créer 3 canons à égal distance les uns des autres au bord de la plateforme
        const canon1 = new Canon("canon1",coordDepart.x-16, coordDepart.y+11, coordDepart.z-34, 1, 1, 3, new BABYLON.Vector3(0,0.3,-1), this.scene);
        listes[9].push(canon1);
        const canon2 = new Canon("canon2",coordDepart.x, coordDepart.y+11, coordDepart.z-34, 1, 1, 3, new BABYLON.Vector3(0,0.3,-1), this.scene);
        listes[9].push(canon2);
        const canon3 = new Canon("canon3",coordDepart.x+16, coordDepart.y+11, coordDepart.z-34, 1, 1, 3, new BABYLON.Vector3(0,0.3,-1), this.scene);
        listes[9].push(canon3);

        //créer des plateformes sous les murs cassables et au dessus de la plateforme centrale
        const plateforme1 = new Ground("plateforme1",coordDepart.x-16, coordDepart.y+10, coordDepart.z-30, 5, 1, 6,this.scene);
        listes[1].push(plateforme1);
        const plateforme2 = new Ground("plateforme2",coordDepart.x, coordDepart.y+10, coordDepart.z-30, 5, 1, 6,this.scene);
        listes[1].push(plateforme2);
        const plateforme3 = new Ground("plateforme3",coordDepart.x+16, coordDepart.y+10, coordDepart.z-30, 5, 1, 6,this.scene);
        listes[1].push(plateforme3);

        //créer des plateformes qui bougent verticalement pour atteindre les plateformes sous les murs cassables
        const plateforme4 = new MovingGround("plateforme4",coordDepart.x-16, coordDepart.y+10, coordDepart.z-25, 5, 1, 5, coordDepart.x-16, coordDepart.y, coordDepart.z-25, 0.1, this.scene);
        listes[7].push(plateforme4);
        const plateforme5 = new MovingGround("plateforme5",coordDepart.x, coordDepart.y+10, coordDepart.z-25, 5, 1, 5, coordDepart.x, coordDepart.y, coordDepart.z-25, 0.1, this.scene);
        listes[7].push(plateforme5);
        const plateforme6 = new MovingGround("plateforme6",coordDepart.x+16, coordDepart.y+10, coordDepart.z-25, 5, 1, 5, coordDepart.x+16, coordDepart.y, coordDepart.z-25, 0.1, this.scene);
        listes[7].push(plateforme6);

        //créer un boss
        const boss = new BossBasket("boss",coordDepart.x, coordDepart.y, coordDepart.z-60, 20, 10, 10, 0.05, 3 ,this.scene);
        listes[10].push(boss);
        /*//créer rectangle jaune représentant le boss
        const bossPoint = BABYLON.MeshBuilder.CreateBox("bossPoint", {height: 10, width: 20, depth: 10}, this.scene);
        bossPoint.position = new BABYLON.Vector3(coordDepart.x, coordDepart.y, coordDepart.z-60);
        bossPoint.isVisible = true;
        bossPoint.material = new BABYLON.StandardMaterial("bossPointMaterial", this.scene);
        bossPoint.material.diffuseColor = BABYLON.Color3.Yellow();
        bossPoint.checkCollisions = false;*/



    }
}

// Export du constructeur de niveau
export default LvlBoss1;