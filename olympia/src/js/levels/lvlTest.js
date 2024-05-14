// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";
import { BreakableWall } from "../entities/breakableWalls.js";
import { MovingGround } from "../entities/movingGrounds.js";
import { Unlocker } from "../entities/unlocker.js";
import { Canon } from "../entities/canons.js";
import { World } from "../objects/world/World.mjs";
import { MeshBehaviour } from "../objects/behaviour/MeshBehaviour.mjs";
import { MESH, MeshModel } from "../objects/model/MeshModel.mjs";
import { MovementBehaviour } from "../objects/behaviour/MovementBehaviour.mjs";
import { MOVEMENT, MovementModel } from "../objects/model/MovementModel.mjs";
import { Vector3 } from "../../../../babylonjs/core/index.js";
import { TRANSFORM, TransformModel } from "../objects/model/TransformModel.mjs";
import { HitboxBehaviour } from "../objects/behaviour/HitboxBehaviour.mjs";
import { PlayerBehaviour } from "../objects/behaviour/controls/PlayerBehaviour.mjs";
import { ConstantForceBehaviour } from "../objects/behaviour/ConstantForceBehaviour.mjs";
import { SimpleCollisionBehaviour } from "../objects/behaviour/collision/SimpleCollisionBehaviour.mjs";
import { PushCollisionBehaviour } from "../objects/behaviour/PushCollisionBehaviour.mjs";

// Constructeur de niveau
export class LvlTest {

    /**
     * 
     * @param {*} player 
     * @param {*} listes 
     * @param {World} world 
     */
    constructor(player, listes, world) {
    // reset le joueur
    
    //listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker, ListeCanons];
    //créer un sol de départ
    const ground = new Ground("Ground1",-9, -1, 0, 20, 1, 5,this.scene);
    listes[1].push(ground);
    //créer un mur au bout du premier sol en -x et tourné de 90°
    const ground2= new Ground("Ground2",-21.5, -1, -7.5, 5, 1, 20,this.scene);
    listes[1].push(ground2);
    //créer un sol en hauteur
    const ground3 = new Ground("Ground3",-9, 0.5, -15, 10, 2, 25,this.scene);
    listes[1].push(ground3);

    //créer une rampe en tournant le sol
    //const ground4 = new Ground("Ground4",-2, 2, -5, 10, 1, 5,this.scene);
    //tourner le sol
    //ground4.mesh.rotation.z = -Math.PI/6;
    //actualiser les collisions
    //ground4.mesh.refreshBoundingInfo();
    //listes[1].push(ground4);

    //créer une rampe en tournant le sol
    //const ground5 = new Ground("Ground5",-9, 0, -1, 4, 1, 4,this.scene);
    //tourner le sol
    //ground5.mesh.rotation.x = Math.PI/6;
    //actualiser les collisions
    //ground5.mesh.refreshBoundingInfo();
    //listes[1].push(ground5);

    //ajouter un escalier à gauche du sol en hauteur
    //créer un sol
    world.addBehaviours("object", 
        [new HitboxBehaviour(),2], 
        [new MovementBehaviour(0.95), 1],
        new SimpleCollisionBehaviour()
    )

    world.addBehaviour("cube", [new MeshBehaviour(world.models["CUBE"]),2])
    world.addBehaviour("panda", [new MeshBehaviour(world.models["PANDA"]),2])

    world.addBehaviours("player", 
        new PlayerBehaviour(["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"],0.03,0.05),
        new ConstantForceBehaviour(new Vector3(0,-0.01,0)),
        new PushCollisionBehaviour()
    )

    world.add(["object","cube"],
        [TRANSFORM, new TransformModel({position:new Vector3(0, -1, 4), scale:new Vector3(4,1,5)})]
    )

    world.add(["object","cube"],
        [TRANSFORM, new TransformModel({position:new Vector3(4, 0, 4), scale:new Vector3(4,2,5)})]
    )

    world.add(["object","cube"],
        [TRANSFORM, new TransformModel({position:new Vector3(-3.5, 0.5, 4), rotation:new Vector3(0,0,-4), scale:new Vector3(4,1,5)})]
    )

    world.add(["object","player","panda"],
        [MOVEMENT, new MovementModel(new Vector3(0.1,0,0))],
        [TRANSFORM, new TransformModel({position:new Vector3(0, 2, 4)})]
    )

    const groundE11 = new Ground("GroundE11",-2, -1, -5, 4, 1, 5,this.scene);
    listes[1].push(groundE11);
    //créer un sol
    const groundE12 = new Ground("GroundE12",-2, -0.5, -6, 4, 1, 5,this.scene);
    listes[1].push(groundE12);
    //créer un sol
    const groundE13 = new Ground("Groun9E13",-2, 0, -7, 4, 1, 5,this.scene);
    listes[1].push(groundE13);
    //créer un sol
    const groundE14 = new Ground("GroundE14",-2, 0.5, -8, 4, 1, 5,this.scene);
    listes[1].push(groundE14);
    //créer un sol
    const groundE15 = new Ground("GroundE15",-2, 1, -9, 4, 1, 5,this.scene);
    listes[1].push(groundE15);

    //ajouter un escalier
    //créer un sol
    const groundE21 = new Ground("GroundE21",-17, -1, -15, 4, 1, 5,this.scene);
    listes[1].push(groundE21);
    //créer un sol
    const groundE22 = new Ground("GroundE22",-16, -0.5, -15, 4, 1, 5,this.scene);
    listes[1].push(groundE22);
    //créer un sol
    const groundE23 = new Ground("GroundE23",-15, 0, -15, 4, 1, 5,this.scene);
    listes[1].push(groundE23);
    //créer un sol
    const groundE24 = new Ground("GroundE24",-14, 0.5, -15, 4, 1, 5,this.scene);
    listes[1].push(groundE24);
    //créer un sol
    const groundE25 = new Ground("GroundE25",-13, 1, -15, 4, 1, 5,this.scene);
    listes[1].push(groundE25);
    
    //créer une warpZone
    const warpZone1 = new warpZone("warpZone1",-9, 2, -5, 1, 1, 1, -21.5, 0, -9,this.scene);
    listes[4].push(warpZone1);
    //créer un lvlWarp
    const lvlWarp0 = new lvlWarp("lvlWarp0",-12, 2, -5, 1, 1, 1, 0,this.scene);
    listes[5].push(lvlWarp0);

    const lvlWarpSam = new lvlWarp("lvlWarp0",-5, 2, -5, 1, 1, 1, 260402,this.scene);
    listes[5].push(lvlWarpSam);
    //créer une killZone
    const killZone1 = new killZone("KillZone1",-15, 0.5, -5, 2, 2, 5,this.scene);
    listes[3].push(killZone1);
    //mettre un sol sous la killZone
    const ground6 = new Ground("Ground6",-15, -1, -5, 2, 1, 5,this.scene);
    listes[1].push(ground6);

    //créer des monstres
    const monster = new Monster("Monster1","Panda", -20, 0, 0, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
    listes[0].push(monster);
    monster.toggleHitbox(true);
    
    const monster2 = new Monster("Monster2","Kangaroo1", -23, 1.5, -5, 1, 1, 1, player.playerSpeed*2, 15, this.scene);
    listes[0].push(monster2);
    monster2.toggleHitbox(true);

    //créer un monstre volant
    const monster3 = new Monster("Monster3","Bird", -20, 3, -10, 1, 1, 1, player.playerSpeed*2, 2, this.scene);
    listes[0].push(monster3);
    monster3.toggleHitbox(true);

    monster3.chercheJoueur = Monster.prototype.flyingChercheJoueur;
    monster3.mesh.instancedBuffers.color = new BABYLON.Color3(1,0.5,0);
    
    //créer un mur cassable
    const breakableWall = new BreakableWall("BreakableWall1",-9, 2, -7, 5, 1, 1, this.scene);
    listes[6].push(breakableWall);

    /*//créer un sol qui bouge
    const movingGround = new MovingGround("MovingGround1",4, 5, -10, 5, 1, 5, 4, -2, 0, this.scene);
    listes[1].push(movingGround);
    listes[7].push(movingGround);*/

    //créer un sol qui bouge
    const movingGround2 = new MovingGround("MovingGround2",0, 1, -15.5, 8, 1, 8, 10, 5, -15.5, 0.1 ,this.scene);
    listes[1].push(movingGround2);
    listes[7].push(movingGround2);

    //créer un débloqueur d'attaque
    const unlocker = new Unlocker("Unlocker1",-10, 2, -15, 1, 1, 1, 1, this.scene);
    listes[8].push(unlocker);
    //créer un débloqueur de saut
    const unlocker2 = new Unlocker("Unlocker2",-10, 2, -10, 1, 1, 1, 2, this.scene);
    listes[8].push(unlocker2);
    //créer un débloqueur de bouclier
    const unlocker3 = new Unlocker("Unlocker3",-10, 2, -20, 1, 1, 1, 3, this.scene);
    listes[8].push(unlocker3);
    //créer un débloqueur de dash
    const unlocker4 = new Unlocker("Unlocker4",-10, 2, -25, 1, 1, 1, 4, this.scene);
    listes[8].push(unlocker4);

    //créer un lvlWarp vers le boss1
    const lvlWarpBoss1 = new lvlWarp("lvlWarpBoss1",-12, 2, -25, 1, 1, 1, -2,this.scene);
    listes[5].push(lvlWarpBoss1);

    //créer un canon
    const canon = new Canon("Canon1",-5, 2, -15, 1, 1, 1, new BABYLON.Vector3(1,0.3,0), this.scene);
    listes[9].push(canon);

    player.resetPosition();

    }

}

// Export du constructeur de niveau
export default LvlTest;
