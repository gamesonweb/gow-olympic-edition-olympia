// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { BreakableWall } from "../entities/breakableWalls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";
import { Unlocker } from "../entities/unlocker.js";
import { MovingGround } from "../entities/movingGrounds.js";

// Constructeur de niveau
export class Lvl1 {
    constructor( player,listes) {
        // reset le joueur
        player.resetPosition();

        // Zone en bas du lvl 1
        const groundLAVA = new Ground("GroundLAVA",75, -6, 0, 225, 1, 150,this.scene);
        listes[1].push(groundLAVA);

        const killZone1 = new killZone("KillZone1",75, -5.8, 0, 225, 1, 150,this.scene);
        listes[3].push(killZone1);


        // Création avec la sortie de la TP
        const ground = new Ground("Ground1",3, -3, 5, 14, 5, 20,this.scene);
        listes[1].push(ground);

        const wallL1P1 = new Wall("WallL1P1", -18, 6, -5, 37, 20, 5,this.scene);
        listes[2].push(wallL1P1);

        const wallL1P2 = new Wall("WallL1P2", -18, 6, 5, 37, 20, 5,this.scene);
        listes[2].push(wallL1P2);

        const wallL1P3 = new Wall("WallL1P3", -18, 11, 0, 37, 10, 8,this.scene);
        listes[2].push(wallL1P3);

        const wallL1P4 = new Wall("WallL1P4", -6, 0, 0, 4, 20, 5,this.scene);
        listes[2].push(wallL1P4);

        const unlocker = new Unlocker("Unlocker1",0, 0, 10, 1, 1, 1, 2, this.scene);
        listes[8].push(unlocker);

        const wallL1P5 = new Wall("WallL1P5", 5, 0, -5, 10, 1.5, 1,this.scene);
        listes[2].push(wallL1P5);

        const wallL1P6 = new Wall("WallL1P6", 10, 0, 4.75, 1, 1.5, 20.75,this.scene);
        listes[2].push(wallL1P6);

        const wallL1P7 = new Wall("WallL1P7", -4, 0.5, 11, 1, 1.5, 8,this.scene);
        listes[2].push(wallL1P7);

        const wallL1P8 = new Wall("WallL1P8", -3.5, 0.5, 15, 2, 1.5, 1,this.scene);
        listes[2].push(wallL1P8);

        const wallL1P9 = new Wall("WallL1P9", 9, 0, 15, 1.5, 1.5, 0.5,this.scene);
        listes[2].push(wallL1P9);


        // Escalier 
        const groundE11 = new Ground("GroundE11",3, -4, 18, 11, 3, 5,this.scene);
        listes[1].push(groundE11);

        const groundE12 = new Ground("GroundE12",3, -3.5, 17, 11, 3, 5,this.scene);
        listes[1].push(groundE12);

        const groundE13 = new Ground("Groun9E13",3, -3, 16, 11, 3, 5,this.scene);
        listes[1].push(groundE13);

        const groundE14 = new Ground("GroundE14",3, -2.5, 15, 11, 3, 5,this.scene);
        listes[1].push(groundE14);

        const groundE15 = new Ground("GroundE15",3, -2, 14, 11, 3, 5,this.scene);
        listes[1].push(groundE15);

        const groundE16 = new Ground("GroundE16",3, -4.5, 19, 11, 3, 5,this.scene);
        listes[1].push(groundE16);

        const groundE17 = new Ground("GroundE17",3, -5, 20, 11, 3, 5,this.scene);
        listes[1].push(groundE17);


        // Zone sous premier escalier
        const murLvl1 = new BreakableWall("MurLvl1",10, -2, 30.5, 2, 2, 15, this.scene);
        listes[6].push(murLvl1);

        const ground2 = new Ground("Ground2",8, -6, 30, 22, 5, 15,this.scene);
        listes[1].push(ground2);

        const groundEZ1 = new Ground("GrounEZ1",3, -4, 36, 11, 1, 5,this.scene);
        listes[1].push(groundEZ1);

        const groundEZ2 = new Ground("GroundEZ2",3, -4.5, 37, 11, 1, 5,this.scene);
        listes[1].push(groundEZ2);

        const groundEZ3 = new Ground("GroundEZ3",3, -5, 38, 11, 1, 5,this.scene);
        listes[1].push(groundEZ3);

        const groundEZ4 = new Ground("GroundEZ4",3, -5.5, 39, 11, 1, 5,this.scene);
        listes[1].push(groundEZ4);

        const groundEZ5 = new Ground("GroundEZ5",3, -6, 40, 11, 1, 5,this.scene);
        listes[1].push(groundEZ5);


        // Transition entre première zone sous escalier et zone de combat 1
        let PosMouvementY = -4.5;
        let PosMouvementZ = 30
        
        const movingGround1 = new MovingGround("MovingGround1", 20, PosMouvementY, PosMouvementZ, 6, 1, 6, 28, PosMouvementY, PosMouvementZ, 0.12 ,this.scene);
        listes[7].push(movingGround1);

        const movingGround2 = new MovingGround("MovingGround2", 40, PosMouvementY, PosMouvementZ, 6, 1, 6, 32, PosMouvementY, PosMouvementZ, 0.12 ,this.scene);
        listes[7].push(movingGround2);


        // Première zone de combat
        const groundE18 = new Ground("GroundE18",51, -5, 30, 19, 3, 13,this.scene);
        listes[1].push(groundE18);

        const groundE19 = new Ground("GroundE19",51, -5, 34, 9.5, 3, 40,this.scene);
        listes[1].push(groundE19);

        const murLvl2 = new BreakableWall("MurLvl2",51, -1.5, 20, 9.5, 4, 2, this.scene);
        listes[6].push(murLvl2);

        const monster1 = new Monster("Monster1", "Panda",53, -4, 32, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
        listes[0].push(monster1);

        const monster2 = new Monster("Monster2", "Panda", 53, -4, 30, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
        listes[0].push(monster2);

        const monster4 = new Monster("Monster4", "Panda", 50, -4, 19, 2, 2, 2, player.playerSpeed*3, 3, this.scene);
        listes[0].push(monster4);
        monster4.toggleHitbox(true);

        const murLvl3 = new BreakableWall("MurLvl3",51, -3, 40, 9.5, 2, 2, this.scene);
        listes[6].push(murLvl3);

        const murLvl4 = new BreakableWall("MurLvl4",51, -3, 43, 9.5, 2, 2, this.scene);
        listes[6].push(murLvl4);


        // Jonglage entre les plateformes mouvantes après première zone de combat
        const movingGround3 = new MovingGround("MovingGround3", 64, -4.3, 50, 6, 1, 8, 57, -4.3, 50, 0.1 ,this.scene);
        listes[7].push(movingGround3);

        const movingGround4 = new MovingGround("MovingGround4", 70, -4.5, 50, 7, 1, 8, 70, 2.5, 50, 0.1 ,this.scene);
        listes[7].push(movingGround4);

        const movingGround5 = new MovingGround("MovingGround5", 77, 2.5, 50, 7, 1, 8, 77, -4.5, 50, 0.1 ,this.scene);
        listes[7].push(movingGround5);

        const movingGround6 = new MovingGround("MovingGround6", 84, -4.5, 50, 7, 1, 8, 84, 2.5, 50, 0.1 ,this.scene);
        listes[7].push(movingGround6);

        //const monster3 = new Monster("Monster3", "Panda", 84, 0, 50, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
        //listes[0].push(monster3);
        //monster3.chercheJoueur = Monster.prototype.flyingChercheJoueur;
        //monster3.mesh.instancedBuffers.color = new BABYLON.Color3(1,0.5,0);


        // Nouvelle zone de combat avec Murets

        const groundE20 = new Ground("GroundE20",100, -1, 49, 25, 8, 10,this.scene);
        listes[1].push(groundE20);
        
        const groundE21 = new Ground("GroundE21",112.5, -1, 45, 12.5, 8, 18,this.scene);
        listes[1].push(groundE21);

        const monster5 = new Monster("Monster5", "Panda", 113, 2.5, 48, 1.85, 1.85, 1.85, player.playerSpeed*3, 4, this.scene);
        listes[0].push(monster5);

        const monster6 = new Monster("Monster6", "Panda", 97, 2.5, 49, 1, 1, 1, player.playerSpeed*5, 2, this.scene);
        listes[0].push(monster6);

        const monster10 = new Monster("Monster10", "Panda", 110, 2.5, 48, 1, 1, 1, player.playerSpeed*5, 2, this.scene);
        listes[0].push(monster10);

        const monster7 = new Monster("Monster7", "Panda", 97, 2.5, 51, 1, 1, 1, player.playerSpeed*5, 2, this.scene);
        listes[0].push(monster7);

        const murLvl5 = new BreakableWall("MurLvl5",88, 4, 49, 1, 2, 10, this.scene);
        listes[6].push(murLvl5);

        const groundP1 = new Ground("GroundP1",95, 4, 49, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP1);

        const groundP2 = new Ground("GroundP2",100, 4, 50, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP2);

        const groundP3 = new Ground("GroundP3",105, 4, 47, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP3);

        const groundP4 = new Ground("GroundP4",110, 4, 50, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP4);

        const groundP6 = new Ground("GroundP6",110, 4, 44, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP6);

        const groundP7 = new Ground("GroundP7",115, 4, 49, 1.2, 6, 10,this.scene);
        listes[1].push(groundP7);

        const groundP8 = new Ground("GroundP8",115, 4, 44, 1.2, 6, 1.2,this.scene);
        listes[1].push(groundP8);

        const wallL1P10 = new Wall("WallL1P10", 103, 3.5, 54.5, 32, 1, 0.5,this.scene);
        listes[2].push(wallL1P10);

        const murLvl6 = new BreakableWall("MurLvl6",118, 4, 49, 1, 2, 10, this.scene);
        listes[6].push(murLvl6);



        // Escaliers après 2ème zone de combat

        const groundE22 = new Ground("GroundE22",118, -1, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE22);

        const groundE23 = new Ground("GroundE23",119, -1.5, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE23);

        const groundE24 = new Ground("GroundE24",120, -2, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE24);

        const groundE25 = new Ground("GroundE25",121, -2.5, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE25);

        const groundE26 = new Ground("GroundE26",122, -3, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE26);

        const groundE27 = new Ground("GroundE27",123, -3.5, 49, 1, 8, 10,this.scene);
        listes[1].push(groundE27);

        const groundE28 = new Ground("GroundE28",130, -4, 49, 15, 8, 10,this.scene);
        listes[1].push(groundE28);

        const monster8 = new Monster("Monster8", "Panda", 130, -4, 49, 1.5, 1.5, 1.5, player.playerSpeed*2.5, 3, this.scene);
        listes[0].push(monster8);

            //créer un monstre volant
        const monster9 = new Monster("Monster9","Bird", 135, -4, 49, 1, 1, 1, player.playerSpeed*2, 2, this.scene);
        listes[0].push(monster9);

        monster9.chercheJoueur = Monster.prototype.flyingChercheJoueur;


        for (let i = 0; i < 12; i++) // On boucle le nombre de marche
        { 
            const ground = new Ground
            (
                "GroundE" + (i + 62), // Nom unique pour chaque marche
                130, //PosX de la première marche
                -6 + (i * 0.5), //PosY + PosY pour chaque prochaine marche
                38 - (i * - 1), // PosZ + PosZ pour chaque prochaine marche
                8, //TailleX pour chaque marche
                1, //TailleY Pour chaque marche
                10, //TailleZ pour chaque marche
                this.scene
            );

            listes[1].push(ground);
        }


        // Dernière zone avant boss final

        const movingGround7 = new MovingGround("MovingGround7", 141, -0.5, 49, 8, 1, 6, 141, -0.5, 30, 0.15 ,this.scene);
        listes[7].push(movingGround7);

        const movingGround8 = new MovingGround("MovingGround8", 150, -0.5, 25, 5, 1, 6, 135, -0.5, 25, 0.18 ,this.scene);
        listes[7].push(movingGround8);

        const movingGround9 = new MovingGround("MovingGround9", 135, -0.5, 19, 5, 1, 6, 150, -0.5, 19, 0.14 ,this.scene);
        listes[7].push(movingGround9);

        const movingGround10 = new MovingGround("MovingGround10", 150, -0.5, 13, 5, 1, 6, 135, -0.5, 13, 0.12 ,this.scene);
        listes[7].push(movingGround10);

        const movingGround11 = new MovingGround("MovingGround11", 135, -0.5, 7, 5, 1, 6, 150, -0.5, 7, 0.2 ,this.scene);
        listes[7].push(movingGround11);

        const groundE29 = new Ground("GroundE29",144, -4, -3, 8, 8, 15,this.scene);
        listes[1].push(groundE29);


        for (let i = 0; i < 30; i++) // On boucle le nombre de marche
        { 
            const ground = new Ground
            (
                "GroundE" + (i + 30), // Nom unique pour chaque marche
                144, //PosX de la première marche
                0 + (i * 0.5), //PosY + PosY pour chaque prochaine marche
                -11 - (i * 1), // PosZ + PosZ pour chaque prochaine marche
                8, //TailleX pour chaque marche
                1, //TailleY Pour chaque marche
                24, //TailleZ pour chaque marche
                this.scene
            );

            listes[1].push(ground);
        }

        const wallL1F1 = new Wall("WallL1F1", 149, 18, -43, 2, 10, 12,this.scene);
        listes[2].push(wallL1F1);

        const wallL1F2 = new Wall("WallL1F2", 139, 18, -43, 2, 10, 12,this.scene);
        listes[2].push(wallL1F2);

        const wallL1F3 = new Wall("WallL1F3", 144, 20, -43, 12, 3, 12,this.scene);
        listes[2].push(wallL1F3);

        const lvlWarp1 = new lvlWarp("lvlWarp1",144, 18, -46, 8, 6, 2, -2,this.scene);
        listes[5].push(lvlWarp1);

        
    }
}

// Export du constructeur de niveau
export default Lvl1;
