import { Player } from "./entities/player.js";
import { SamLevel } from "./levels/SamLevel.mjs"
import { LvlTest } from "./levels/lvlTest.js";
import { LvlAccueil } from "./levels/lvlAccueil.js";
import { Lvl1} from "./levels/lvl1.js";
import { LvlBoss1} from "./levels/lvlBoss1.js";
import { World } from "./objects/world/World.mjs";
import { loadModels } from "./ressources/Models.mjs";
import { Level } from "./levels/Level.mjs";
import { Engine, SSAO2RenderingPipeline, SceneOptimizer, SceneOptimizerOptions } from "../../../babylonjs/core/index.js";
import { SCENE } from "./objects/model/MeshModel.mjs";
import { adom, create } from "../../../samlib/DOM.mjs";
import { MessageManager } from "./messages/MessageManager.mjs";

/** Récupère et crée la fenêtre de jeu */
const gameElement = document.getElementById("olympia");
if(!gameElement){
    window.alert("Impossible de trouver l'élément pour y insérer le jeu!")
    throw new Error("Impossible de trouver l'élément pour y insérer le jeu!")
}
gameElement.innerHTML=""
const canvas=adom/*html*/`<canvas width=800 height=500></canvas>`
const infoJoueur=create("div.olympia-messages")
export const message= new MessageManager(infoJoueur)
gameElement.appendChild(canvas)
gameElement.appendChild(infoJoueur)

/** @type {Engine} */ const engine = new BABYLON.Engine(canvas, true);

let keyState = {};
let scene;
let world=new World()
let pause = false;

let camera;
let player;
let listeMonstres = [];
let listeGrounds = [];
let listeWalls = [];
let listeKillZones = [];
let listeWarpZones = [];
let listeLvlWarps = [];
let listeBreakableWalls = [];
let listeMoveGrounds = [];
let listeUnlocker = [];
let listeCanons = [];
let Boss = [];
let listeBombes = [];
let listes;
let decor;

let nbLevel = -1;
/** @type {Level?} */ let currentLevel=null


async function createScene() {
    scene = new BABYLON.Scene(engine);
    SceneOptimizer.OptimizeAsync(scene, new SceneOptimizerOptions(60))
    //scene.debugLayer.show();
    scene.clearColor = new BABYLON.Color3.Black();
    world.model.set(SCENE,scene)
    world.models=await loadModels(scene)
    const camY = 10;
    const camZ = -10;

    // Créer une camera qui regarde en 0,0,0
    camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, camY, camZ), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    //const ssao = new SSAO2RenderingPipeline("ssaopipeline", scene, 2, [camera]);


    // Créer une lumière
    const light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 5,6));

    // Créer un joueur
    player = new Player("Player",0, 0, 0, 1, 1, 1, 0.03, 0.4, scene);
    // player = scene.player;
    camera.lockedTarget = player.mesh;
    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker, listeCanons, Boss, listeBombes];
    // Appeler le niveau
    changeLevel();
    
    return scene;
}

//déplacer le joueur
function movePlayer(){
    //let listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker, listeCanons, Boss, listeBombes];
    player.move(listes);
    detectLvlWarp();
    
    //si on est dans le niveau d'accueil, la camera suit le joueur en z
    switch (nbLevel){
        case 0:
            camera.position.x = player.mesh.position.x;
            camera.position.z = 10;
            break;

        case 1:
            camera.position.x = player.mesh.position.x;
            camera.position.z = player.mesh.position.z + 15;
            camera.position.y = player.mesh.position.y + 10;
            break;
        
        case -2:
            camera.position.x = player.mesh.position.x;
            camera.position.z = player.mesh.position.z + 20;
            camera.position.y = player.mesh.position.y + 10;
            break;

        default:
            camera.position.x = player.mesh.position.x;
            camera.position.z = 10;
            break;
    }
    
}

//detecter la collision entre le joueur et un LvLWarp
function detectLvlWarp(){
    listeLvlWarps.forEach(lvlWarp => {
        if (player.mesh.intersectsMesh(lvlWarp.mesh, false)){
            nbLevel = lvlWarp.nbLevel;
            console.log("lvlWarp");
            console.log(nbLevel);
            changeLevel();
        }
    });
}

//changer de niveau
function changeLevel(){
    //supprimer les anciens éléments
    listeMonstres.forEach(monstre => {
        monstre.mesh.dispose();
        monstre = null;
    });
    listeMonstres = [];
    listeGrounds.forEach(ground => {
        ground.mesh.dispose();
        ground = null;
    });
    listeGrounds = [];
    listeWalls.forEach(wall => {
        wall.mesh.dispose();
        wall = null;
    });
    listeWalls = [];
    listeKillZones.forEach(killZone => {
        killZone.mesh.dispose();
        killZone = null;
    });
    listeKillZones = [];
    listeWarpZones.forEach(warpZone => {
        warpZone.mesh.dispose();
        warpZone = null;
    });
    listeWarpZones = [];
    listeLvlWarps.forEach(lvlWarp => {
        lvlWarp.mesh.dispose();
        lvlWarp = null;
    });
    listeLvlWarps = [];
    listeBreakableWalls.forEach(breakableWall => {
        breakableWall.mesh.dispose();
        breakableWall = null;
    });
    listeBreakableWalls = [];
    listeMoveGrounds.forEach(moveGround => {
        moveGround.mesh.dispose();
        moveGround = null;
    });
    listeMoveGrounds = [];
    listeUnlocker.forEach(unlocker => {
        unlocker.mesh.dispose();
        unlocker = null;
    });
    listeUnlocker = [];
    listeCanons.forEach(canon => {
        canon.mesh.dispose();
        canon.destroyVoyant();
        canon = null;
    });
    listeCanons = [];
    Boss.forEach(boss => {
        boss.breakBoss();
        boss = null;
    });
    Boss = [];
    listeBombes.forEach(bombe => {
        bombe.mesh.dispose();
        bombe = null;
    });
    listeBombes = [];

    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker, listeCanons, Boss, listeBombes];
    
    world.close()
    currentLevel=null
    
    //supprimer le décor
    //changer de niveau
    if(nbLevel == 260402){
        currentLevel = decor = new SamLevel();
        decor.start(world, {camera: camera})
    }
    if (nbLevel == -1){
        decor = new LvlTest(player, listes, world);
    }
    if (nbLevel == 0){
        
        decor = new LvlAccueil(player, listes);
    }
    if (nbLevel == 1){

        decor = new Lvl1(player,listes);
    }
    if (nbLevel == -2){

        decor = new LvlBoss1(player,listes);
    }
}

async function main(){
    let sceneToRender = await createScene();
    //si le jeu n'est pas en pause, faire avancer le jeu
    //si on appuie sur la touche P, mettre le jeu en pause en arrétant la boucle de rendu
    window.addEventListener('keydown', function(evt) {
        if (evt.code == "KeyP"){
            console.log("pause");
            pause = !pause;
            if (pause){
                message.send("PAUSE", MessageManager.FOREVER, "pause");
            }
            else{
                message.clear("pause");
            }
        }
    });
        setInterval(function(){
            if (!pause){
                world.tick()
                if(decor instanceof Level) decor.tick(world, {camera: camera})
                if(!currentLevel) movePlayer()
                //faire chercher le joueur par les monstres
                listeMonstres.forEach(monstre => {
                    monstre.chercheJoueur(player, listeMonstres, listeGrounds);
                    //si le monstre touche un sol, arrete de tomber
                    /*monstre.mesh.onCollideObservable.add((collidedMesh)=>{
                        let touche = collidedMesh;
                        monstre.auSol(touche);
                    })*/
                });
                //detecter si on tape un breakableWall
                listeBreakableWalls.forEach(breakableWall => {
                    breakableWall.detectAttack(listeBreakableWalls);
                }
                );
                //detecter si on tape un canon
                listeCanons.forEach(canon => {
                    canon.detectAttack();
                }
                );
                listeMoveGrounds.forEach(moveGround => {
                    moveGround.move();
                });
                Boss.forEach(boss => {
                    boss.act(listes, player);
                    if (!boss.enVie){
                        boss.postDeath(listes);
                        boss = null;
                        //enlever le boss de la liste
                        let index = Boss.indexOf(boss);
                        Boss.splice(index, 1);
                    }
                });
                listeBombes.forEach(bombe => {
                    bombe.detectTarget(player, listeBombes);
                });
            }
        }, 30);

        //boucle de rendu
        engine.runRenderLoop(function () {
            sceneToRender.render();
            if(currentLevel===null)message.send("PV: " + player.pv, MessageManager.FOREVER, "pv");
        });
    
}
main()