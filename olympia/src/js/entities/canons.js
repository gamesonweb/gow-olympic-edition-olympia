import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("canon", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("canonMaterial", scene);
        mesh.material.diffuseColor = new BABYLON.Color3(1,1,1);
        mesh.checkCollisions = false;
    }
    return mesh;
}

export class Canon extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, direction = new BABYLON.Vector3(0,0,0), scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.mesh.checkCollisions = true;
        this.mesh.isVisible = true;
        this.direction = direction;
        this.canBeHit = false;
        this.mesh.lookAt(new BABYLON.Vector3(this.direction.x+this.mesh.position.x, this.direction.y+this.mesh.position.y, this.direction.z+this.mesh.position.z));
        this.mesh.isVisible = false;
        //10 secondes avant de pouvoir être touché
        this.timerBeforeHit = 120;

        //créer un carré rouge pour indiquer si le canon peut être touché
        this.voyant = BABYLON.MeshBuilder.CreateBox("voyant", {height: 0.2, width: 0.2, depth: 0.2}, scene);
        this.voyant.position = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
        this.voyant.lookAt(new BABYLON.Vector3(this.direction.x+this.mesh.position.x, this.direction.y+this.mesh.position.y, this.direction.z+this.mesh.position.z));
        //placer le voyant au dessus du canon
        this.voyant.position.x += -this.direction.x/2;
        this.voyant.position.y +=  this.ySize/2;
        this.voyant.position.z += -this.direction.z/2;
        
        this.voyant.material = new BABYLON.StandardMaterial("voyantMaterial", scene);
        this.voyant.material.diffuseColor = new BABYLON.Color3.Red();
        this.voyant.checkCollisions = false;
        this.voyant.isVisible = true;

        this.setSkin(this.mesh, xSize, ySize, zSize, scene);

    }

    toggleHitbox(vision){
        this.mesh.isVisible = vision;
    }

    setSkin(mesh, xSize, ySize, zSize, scene){
        BABYLON.SceneLoader.ImportMesh("", "../../olympia/assets/", "Canon.glb", scene, function (meshes) {
            let skin = meshes[0];
            skin.scaling = new BABYLON.Vector3(0.5*xSize, 0.5*ySize, 0.5*zSize);
            skin.isVisible = true;
            //ajouter le skin en enfant du mesh
            mesh.addChild(skin);
            //placer le skin en fonction du modèle choisi
            skin.position = new BABYLON.Vector3(0, 0, 0);
            skin.rotation = new BABYLON.Vector3(0, 0, 0);
        });
    }

    detectAttack(){
        if (this.canBeHit){
            //changer la couleur du voyant
            this.voyant.material.diffuseColor = new BABYLON.Color3.Green();
            if (this.mesh.getScene().getMeshByName("attaque") && this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("attaque"))){
                //faire apparaitre un projectile
                this.projectile = BABYLON.MeshBuilder.CreateSphere("projectile", {diameter: 0.5}, this.mesh.getScene());
                this.projectile.position = new BABYLON.Vector3(this.mesh.position.x+this.direction.x, this.mesh.position.y+this.direction.y, this.mesh.position.z+this.direction.z);
                this.projectile.material = new BABYLON.StandardMaterial("projectileMaterial", this.mesh.getScene());
                //projectile orange comme un ballon de basket
                this.projectile.material.diffuseColor = new BABYLON.Color3(1,0.5,0);
                this.canBeHit = false;
                //déplacer le projectile
                this.moveProjectile(this.projectile);
                //changer la couleur du voyant
                this.voyant.material.diffuseColor = new BABYLON.Color3.Red();
                //remettre le timer avant de pouvoir être touché
                this.timerBeforeHit = 120;

            } else {

            }
        } else {
            this.timerBeforeHit -= 1;
            if (this.timerBeforeHit <= 0){
                this.canBeHit = true;
            }
        }

        

    }

    //déplacer le projectile
    moveProjectile(projectile){
        //déplacer le projectile dans la direction du canon à une vitesse de 0.1 unité par frame (60 frames par seconde) pendant 5 secondes
        //le faire tomber par la gravité
        let gravity = -0.01;
        let speed = 0.5;
        let time = 0;
        let interval = setInterval(() => {
            projectile.position.x += this.direction.x*speed;
            projectile.position.y += this.direction.y*speed + gravity*time;
            projectile.position.z += this.direction.z*speed;
            time += 1;
            if (time === 300){
                clearInterval(interval);
                projectile.dispose();
            }
        }, 1000/60);

    }

    //détruire le voyant du canon quand le canon est détruit
    destroyVoyant(){
        this.voyant.dispose();
    }
}