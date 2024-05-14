import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateSphere("Bombe", {diameter: 1}, scene);
        mesh.isVisible = false;
        mesh.registerInstancedBuffer("color", 4);
        mesh.material = new BABYLON.StandardMaterial("bombeMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.White();
        mesh.checkCollisions = false;
    }
    return mesh;
}

export class Bombe extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, radius, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.radius = radius;
        this.speed = 0.1;
        this.auSol = false;
        this.active = true;
        //couleur beige
        this.mesh.instancedBuffers.color = new BABYLON.Color3(0.9,0.8,0.7);
        this.mesh.checkCollisions = false;
    }
    
    //tomber
    fall(listeGrounds, listeMovingGrounds){
        this.mesh.position.y -= this.speed;
        this.groundCheck(listeGrounds, listeMovingGrounds);

    }

    //détection de collision avec le sol
    groundCheck(listeGrounds, listeMovingGrounds){
        let sols = [];
        listeGrounds.forEach(grounds => {
            sols.push(grounds.mesh);
        });
        listeMovingGrounds.forEach(grounds => {
            sols.push(grounds.mesh);
        });
        sols.forEach(sol => {
            if (this.mesh.intersectsMesh(sol)){
                this.mesh.position.y = sol.position.y + sol.scaling.y/2 + this.ySize/2;
                this.speed = 0;
                this.auSol = true;
            }
        });
    }

    //lancer une boucle quand la bombe est créée
    start(listeGrounds, listeMovingGrounds){
        this.mesh.isVisible = true;
        this.speed = 0.1;
        //tomber jusqu'à collision avec le sol
        let interval = setInterval(() => {
            this.fall(listeGrounds, listeMovingGrounds);
            if(this.auSol){
                clearInterval(interval);
                this.TimerExplosion();
            }
        }, 10);
    }

    //déclencher l'explosion
    TimerExplosion(){
        //changer la couleur de la bombe à chaque tick
        let i = 0;
        let interval = setInterval(() => {
            //changer la couleur de la bombe en la rendant plus orange
            i += 1;
            this.mesh.instancedBuffers.color = new BABYLON.Color3(0.9,0.8-0.01*i,0.7-0.15*i);

        }, 100);
        //déclencher l'explosion après 3 secondes
        setTimeout(() => {
            clearInterval(interval);
            this.explosionTrigger();
        }, 3000);
    }

    explosionTrigger(){
        //créer une explosion
        this.explosion = BABYLON.MeshBuilder.CreateSphere("explosion", {diameter: this.radius}, this.mesh.getScene());
        this.explosion.position = this.mesh.position;
        this.explosion.material = new BABYLON.StandardMaterial("explosionMaterial", this.mesh.getScene());
        this.explosion.material.diffuseColor = new BABYLON.Color3(1,0.5,0);
        this.explosion.material.alpha = 0.5;
        this.explosion.checkCollisions = false;
        this.mesh.dispose();
        console.log("explosion");
        //détruire l'explosion après 1 seconde
        setTimeout(() => {
            console.log("explosion fin");
            this.explosion.dispose();
            this.active = false;
        }, 500);

    }

    detectTarget(player, listeBombes){
        //si l'explosion est finie, détruire la bombe
        if (!this.active){
            listeBombes.splice(listeBombes.indexOf(this), 1);
            return;
        }
        if (player.canTakeDamage){
            if (this.explosion && player.mesh.intersectsMesh(this.explosion)){
                player.takeDamage();
            }
        }
    }
}