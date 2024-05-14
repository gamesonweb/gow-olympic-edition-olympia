import Entities from "./entities.js";
import { Bombe } from "./bombes.js";
import { lvlWarp } from "./lvlWarp.js";
import { Ground } from "./grounds.js";
let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("Boss", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("bossMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Yellow();
        mesh.checkCollisions = false;
    }
    return mesh;
}

// Atterir sur un sol arrete la chute et permet de ressauter
export class BossBasket extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, Speed, pv, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.Speed =Speed;
        this.pv = pv;
        this.mesh.checkCollisions = true;
        this.mesh.isVisible = true;
        this.mesh.position1 = new BABYLON.Vector3(x,y,z);
        this.PoseAtteinte = true;
        this.posCible = 1;
        this.canBeHit = true;
        this.canAttack = true;
        this.enVie = true;
        
        //créer un anneau rouge horizontal au dessus du boss 
        this.anneau = BABYLON.MeshBuilder.CreateTorus("anneau", {diameter: 5, thickness: 0.2}, scene);
        this.anneau.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
        this.anneau.decalage = this.ySize/2+3;
        this.anneau.position.y += this.anneau.decalage;
        this.anneau.material = new BABYLON.StandardMaterial("anneauMaterial", scene);
        this.anneau.material.diffuseColor = new BABYLON.Color3.Red();
        this.anneau.isVisible = true;

    }

    //action du boss
    act(listes,player){
        if (this.enVie){
            let pos1 = this.mesh.position1;
            let pos2 = new BABYLON.Vector3(pos1.x+16, pos1.y, pos1.z);
            let pos3 = new BABYLON.Vector3(pos1.x-16, pos1.y, pos1.z);

            this.move(pos1, pos2, pos3);
            if(this.canBeHit){
                this.detectAttack();
            };
            if (this.canAttack){
                this.canAttack = false;
                this.attack(listes[1], listes[7], listes[11], player);
                setTimeout(() => {
                    this.canAttack = true;
                }, 1500);
            }
        }
        
    }

    move(pos1, pos2, pos3){
        if (this.PoseAtteinte){
            //génère un random entre 1 et 3
            this.posCible = Math.floor(Math.random() * 3) + 1;
            this.PoseAtteinte = false;
        } else {
            switch(this.posCible){
                case 1:
                    //aller vers la position 1 à la vitesse Speed
                    this.mesh.position = BABYLON.Vector3.Lerp(this.mesh.position, pos1, this.Speed);
                    this.anneau.position = new BABYLON.Vector3.Lerp(this.anneau.position, new BABYLON.Vector3(pos1.x, pos1.y+this.anneau.decalage, pos1.z), this.Speed);
                    if (Math.abs(this.mesh.position.x - pos1.x) < 0.1 && Math.abs(this.mesh.position.y - pos1.y) < 0.1 && Math.abs(this.mesh.position.z - pos1.z) < 0.1){
                        this.PoseAtteinte = true;
                    }
                    break;
                case 2:
                    //aller vers la position 2 à la vitesse Speed
                    this.mesh.position = BABYLON.Vector3.Lerp(this.mesh.position, pos2, this.Speed);
                    this.anneau.position = new BABYLON.Vector3.Lerp(this.anneau.position, new BABYLON.Vector3(pos2.x, pos2.y+this.anneau.decalage, pos2.z), this.Speed);
                    if (Math.abs(this.mesh.position.x - pos2.x) < 0.1 && Math.abs(this.mesh.position.y - pos2.y) < 0.1 && Math.abs(this.mesh.position.z - pos2.z) < 0.1){
                        this.PoseAtteinte = true;
                    }
                    break;
                case 3:
                    //aller vers la position 3 à la vitesse Speed
                    this.mesh.position = BABYLON.Vector3.Lerp(this.mesh.position, pos3, this.Speed);
                    this.anneau.position = new BABYLON.Vector3.Lerp(this.anneau.position, new BABYLON.Vector3(pos3.x, pos3.y+this.anneau.decalage, pos3.z), this.Speed);
                    if (Math.abs(this.mesh.position.x - pos3.x) < 0.1 && Math.abs(this.mesh.position.y - pos3.y) < 0.1 && Math.abs(this.mesh.position.z - pos3.z) < 0.1){
                        this.PoseAtteinte = true;
                    }
                    break;
            }
        }
    }

    //casser les éléments supplémentaires du boss
    breakBoss(){
            this.mesh.dispose();
            this.anneau.dispose();
    }

    //detecter le passage d'un projectile dans l'anneau rouge
    detectAttack(){
        if (this.mesh.getScene().getMeshByName("projectile") && this.anneau.intersectsMesh(this.mesh.getScene().getMeshByName("projectile"))){
            this.canBeHit = false;
            this.mesh.material.diffuseColor = new BABYLON.Color3.Red();
            this.pv -= 1;
            if (this.pv <= 0){
                this.die();
            }
            console.log(this.pv);
            //attendre 2 secondes avant de pouvoir être touché à nouveau
            setTimeout(() => {
                this.mesh.material.diffuseColor = new BABYLON.Color3.Yellow();
                this.canBeHit = true;
            }, 2000);
        }
    }

    //mourir
    die(){
        this.breakBoss();
        this.enVie = false;
    }

    postDeath(listes){
        //actions à effectuer après la mort du boss
        //créer un changeur de lvl
        const lvlWarp1 = new lvlWarp("lvlWarp1", this.x, this.y+1, this.z, 1, 1, 1, 0, this.mesh.getScene());
        listes[5].push(lvlWarp1);
        //créer un sol our atteindre le changeur de lvl
        const ground = new Ground("Ground1", this.x, this.y, this.z+15, 5, 1, 35, this.mesh.getScene());
        listes[1].push(ground);


    }

    attack(listeGrounds, listeMoveGrounds, listeBombes, player){
        this.createProjectile(listeGrounds, listeMoveGrounds, listeBombes, player);
    }

    createProjectile(listeGrounds, listeMoveGrounds, listeBombes, player){
        //récupérer les coordonnées des sols
        let sols = [];
        let selectedSol;
        let bombe;
        //random entre 1 et 5
        let random = Math.floor(Math.random() * 5) + 1;
        switch (random){
            case 1: // si 1 alors attaque au dessus du joueur
                //créer un projectile au dessus du joueur
                let playerPos = player.mesh.position;
                bombe = new Bombe("bombe", playerPos.x, playerPos.y+5, playerPos.z, 1, 1, 1, 5, this.mesh.getScene());
                listeBombes.push(bombe);
                bombe.start(listeGrounds, listeMoveGrounds);
                break;

            default: // si 2 alors attaque sur un sol aléatoire
                //créer un projectile sur un sol aléatoire
                listeGrounds.forEach(ground => {
                    sols.push(ground.mesh);
                });
                listeMoveGrounds.forEach(ground => {
                    sols.push(ground.mesh);
                });
                selectedSol = sols[Math.floor(Math.random() * sols.length)];
                bombe = new Bombe("bombe", selectedSol.position.x, selectedSol.position.y+5, selectedSol.position.z, 1, 1, 1, 5, this.mesh.getScene());
                listeBombes.push(bombe);
                bombe.start(listeGrounds, listeMoveGrounds);
                break;

        }
    }
}