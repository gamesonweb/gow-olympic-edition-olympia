// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";

// Constructeur de niveau
export class LvlAccueil {
    constructor( player,listes) {
        // reset le joueur
        player.resetPosition();

        // Création d'un sol de départ
        const ground = new Ground("Ground1",-2, -1, -5, 20, 1, 20,this.scene);
        listes[1].push(ground);

        // Création d'un sol de départ
        const groundL1P1 = new Ground("GroundL1P1",13, -1, 2, 10, 1, 9,this.scene);
        listes[1].push(groundL1P1);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wall = new Wall("Wall1",-23, 6, -3, 5, 20, 15,this.scene);
        listes[2].push(wall);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P1 = new Wall("WallL1P1", 10, 6, -5, 8, 20, 5,this.scene);
        listes[2].push(wallL1P1);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P2 = new Wall("WallL1P2", 10, 6, 5, 8, 20, 5,this.scene);
        listes[2].push(wallL1P2);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P3 = new Wall("WallL1P3", 10, 11, 0, 8, 10, 8,this.scene);
        listes[2].push(wallL1P3);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wall3 = new Wall("Wall3",-8, 6, -9, 35, 20, 3,this.scene);
        listes[2].push(wall3);

        // Création d'un sol du dessous
        const ground2 = new Ground("Ground2",-1, 0, -6, 4, 5, 4,this.scene);
        listes[1].push(ground2);

        //ajouter un lvlWarp
        const lvlWarp0 = new lvlWarp("lvlWarp0",10, 2, 0, 0.5, 3, 3, 1,this.scene);
        listes[5].push(lvlWarp0);

        
        //ajouter un escalier à gauche du sol en hauteur
    //créer un sol
    //const groundE11 = new Ground("GroundE11",-10, -1, -5, 1, 1, 10,this.scene);
    //listes[1].push(groundE11);
    //créer un sol
    const groundE12 = new Ground("GroundE12",-10, -0.5, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE12);
    //créer un sol
    const groundE13 = new Ground("Groun9E13",-10.5, -0.25, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE13);
    //créer un sol
    const groundE14 = new Ground("GroundE14",-11, 0, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE14);
    //créer un sol
    const groundE15 = new Ground("GroundE15",-11.5, 0.25, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE15);

    const ground3 = new Ground("Ground3",-23, 4.5, -6, 10, 1, 20,this.scene);
    listes[1].push(ground3);

    const groundE21 = new Ground("GroundE21",-12, 0, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE21);
    //créer un sol
    const groundE22 = new Ground("Groun9E22",-12.5, -0.3, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE22);
    //créer un sol
    const groundE23 = new Ground("GroundE23",-13, -0.6, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE23);
    //créer un sol
    const groundE24 = new Ground("GroundE24",-13.5, -1.2, -6, 1, 1, 22,this.scene);
    listes[1].push(groundE24);

    const ground4 = new Ground("Ground4",-15, -1.6, -6, 10, 1, 22,this.scene);
    listes[1].push(ground4);
    
        
    }
}

// Export du constructeur de niveau
export default LvlAccueil;
