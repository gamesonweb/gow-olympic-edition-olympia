import Entities from "./entities.js";
import { MovingGround } from "./movingGrounds.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("monster", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.registerInstancedBuffer("color", 4);
        mesh.material = new BABYLON.StandardMaterial("monsterMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.White();
        mesh.visibility = 0.5;
        mesh.checkCollisions = false;
    }
    return mesh;
}

export class Monster extends Entities {
    constructor(name, skin, x,y,z,xSize,ySize,zSize, MonsterSpeed, pv, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.vectorSpeed = new BABYLON.Vector3(0,0,0);
        this.MonsterSpeed = MonsterSpeed;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);
        this.mesh.instancedBuffers.color = BABYLON.Color3.Yellow();
        this.positionDepart = new BABYLON.Vector3(x,y,z);
        this.pv = pv;
        this.canTakeDamage = true;
        this.skinNom = skin;
        this.setSkin(this.mesh, xSize, ySize, zSize, scene);
        this.mesh.isVisible = false;
    }

    toggleHitbox(vision){
        this.mesh.isVisible = vision;
    }

    //attribution d'un modèle 3d au monstre
    setSkin(mesh, xSize, ySize, zSize, scene){
        //récupérer modèle panda
        let skinNom = this.skinNom;
        BABYLON.SceneLoader.ImportMesh("", "../../olympia/assets/", this.skinNom+".glb", scene, function (meshes) {
            let skin = meshes[0];
            
            skin.isVisible = true;
            //ajouter panda en enfant de monster
            mesh.addChild(skin);
            //skin.scaling = new BABYLON.Vector3(xSize, ySize, zSize);
            //placer le skin en fonction du modèle choisi
            switch (skinNom){
                case "Panda":
                case "Bird":
                    skin.scaling = new BABYLON.Vector3(xSize, ySize, zSize);
                    skin.position = new BABYLON.Vector3(0, 0, 0);
                    skin.rotation = new BABYLON.Vector3(0, 0, 0);
                    break;
                case "Kangaroo1":
                    skin.scaling = new BABYLON.Vector3(0.2*xSize, 0.2*ySize, 0.2*zSize);
                    skin.position = new BABYLON.Vector3(0,-0.5,0.5);
                    skin.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                    break;
                case "Kangaroo2":
                    skin.position = new BABYLON.Vector3(0,-0.5,0.5);
                    skin.rotation = new BABYLON.Vector3(0, 0, 0);
                    break;
                default:
                    skin.position = new BABYLON.Vector3(0,0,0);
                    skin.rotation = new BABYLON.Vector3(0, 0, 0);
                    break;
            }
        });
    }


    //chercher si le joueur est dans le champ de vision
    //si oui, se diriger vers lui
    //si non, se diriger vers le point de départ
    chercheJoueur(player, listeMonstres, listeSol){
        // regarde si le joueur est à moins de 10 unités de distance en x et z
        if (Math.abs(player.mesh.position.x-this.mesh.position.x) < 10 && Math.abs(player.mesh.position.z-this.mesh.position.z) < 10){
            //si oui, se tourner vers lui (pas vers le haut)
            //console.log("joueur trouvé");
            this.mesh.lookAt(new BABYLON.Vector3(player.mesh.position.x,this.mesh.position.y,player.mesh.position.z));
            //se déplacer vers lui
            this.move(player, listeMonstres, listeSol);

        } else {
            //si non, se tourner vers le point de départ (pas vers le haut)
            //console.log("joueur perdu");
            this.mesh.lookAt(new BABYLON.Vector3(this.positionDepart.x,this.mesh.position.y,this.positionDepart.z));
            //se déplacer vers le point de départ
            this.move(player, listeMonstres, listeSol);
            
            
        }


    }

    move(player, listeMonstres, listeSol){
        this.vectorSpeed.x*=0.90;
        this.vectorSpeed.y -= 0.02;
        this.vectorSpeed.z*=0.90;
        //si on est à peu près au point de départ et que le joueur n'est pas à moins de 10 unités de distance en x et z du monstre, le monstre s'arrête
        if (Math.abs(this.mesh.position.x-this.positionDepart.x) < 0.1 && Math.abs(this.mesh.position.z-this.positionDepart.z) < 0.1){
            if (Math.abs(player.mesh.position.x-this.mesh.position.x) > 10 || Math.abs(player.mesh.position.z-this.mesh.position.z) > 10){
            this.vectorSpeed.x = 0;
            this.vectorSpeed.z = 0;
            }
            else {
                this.vectorSpeed.x += this.MonsterSpeed * Math.sin(this.mesh.rotation.y)*0.15;
                this.vectorSpeed.z += this.MonsterSpeed * Math.cos(this.mesh.rotation.y)*0.15;
            }
        } else {
        this.vectorSpeed.x += this.MonsterSpeed * Math.sin(this.mesh.rotation.y)*0.15;
        this.vectorSpeed.z += this.MonsterSpeed * Math.cos(this.mesh.rotation.y)*0.15;
        }
        this.groundCheck(listeSol);
        this.detectHit(listeMonstres, false);
        this.playerCheck(player, listeMonstres);
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;
    }

    flyingChercheJoueur(player, listeMonstres, listeSol){
        // regarde si le joueur est à moins de 10 unités de distance en x et z
        if (Math.abs(player.mesh.position.x-this.mesh.position.x) < 10 && Math.abs(player.mesh.position.z-this.mesh.position.z) < 10){
            //si oui, se tourner vers lui (pas vers le haut)
            //console.log("joueur trouvé");
            this.mesh.lookAt(new BABYLON.Vector3(player.mesh.position.x,this.mesh.position.y,player.mesh.position.z));
            //se déplacer vers lui
            this.flyingMove(player, listeMonstres, listeSol, true);

        } else {
            //si non, se tourner vers le point de départ (pas vers le haut)
            //console.log("joueur perdu");
            this.mesh.lookAt(new BABYLON.Vector3(this.positionDepart.x,this.mesh.position.y,this.positionDepart.z));
            //se déplacer vers le point de départ
            this.flyingMove(player, listeMonstres, listeSol, false);
            
        }


    }

    flyingMove(player, listeMonstres, listeSol, playerFound){
        this.vectorSpeed.x*=0.98;
        if (Math.abs(this.vectorSpeed.y) > 1){
            //= 1 ou -1
            this.vectorSpeed.y = Math.sign(this.vectorSpeed.y);
        }
        this.vectorSpeed.y*=0.98;
        this.vectorSpeed.z*=0.98;
        if (playerFound){
            this.vectorSpeed.x += this.MonsterSpeed * Math.sin(this.mesh.rotation.y)*0.15;
            this.vectorSpeed.z += this.MonsterSpeed * Math.cos(this.mesh.rotation.y)*0.15;
            //si on est à + de 5 unités de distance du joueur, monter
            if(Math.abs(player.mesh.position.x-this.mesh.position.x) > 3 || Math.abs(player.mesh.position.z-this.mesh.position.z) > 3){
                if(player.mesh.position.y+5 > this.mesh.position.y){
                    this.vectorSpeed.y += this.MonsterSpeed;
                } else {
                    this.vectorSpeed.y += -this.MonsterSpeed;
                }
            }else{
                if(player.mesh.position.y > this.mesh.position.y){
                    this.vectorSpeed.y += this.MonsterSpeed*2;
                } else {
                    this.vectorSpeed.y += -this.MonsterSpeed;
                }
            }
        } else {
            //si on est à peu près au point de départ, le monstre s'arrête
            if (Math.abs(this.mesh.position.x-this.positionDepart.x) < 0.1 && Math.abs(this.mesh.position.z-this.positionDepart.z) < 0.1){
                this.vectorSpeed.x = 0;
                this.vectorSpeed.z = 0;
            } else {
            this.vectorSpeed.x += this.MonsterSpeed * Math.sin(this.mesh.rotation.y)*0.15;
            this.vectorSpeed.z += this.MonsterSpeed * Math.cos(this.mesh.rotation.y)*0.15;
            }
            if(this.positionDepart.y > this.mesh.position.y){
                this.vectorSpeed.y += this.MonsterSpeed;
            } else {
                this.vectorSpeed.y += -this.MonsterSpeed;
            }
        }

        this.flyingGroundCheck(listeSol);
        this.detectHit(listeMonstres, true);
        this.playerCheck(player, listeMonstres);
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;
    }

    detectHit(listeMonstres, isFlying){
        //si on touche le mesh attaque
        if (this.mesh.getScene().getMeshByName("attaque") && this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("attaque"))){
            //vecteur recul pour le monstre
            let vectRecul = new BABYLON.Vector3(this.mesh.position.x-this.mesh.getScene().getMeshByName("attaque").position.x, 0, this.mesh.position.z-this.mesh.getScene().getMeshByName("attaque").position.z);
            //normaliser le vecteur
            vectRecul = vectRecul.normalize();
            //enlever un point de vie
            this.takeDamage(listeMonstres, isFlying, vectRecul);
        }
        //si on touche le mesh bouclier
        if (this.mesh.getScene().getMeshByName("bouclier") && this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("bouclier"))){
            //vecteur recul pour le monstre
            let vectRecul = new BABYLON.Vector3(this.mesh.position.x-this.mesh.getScene().getMeshByName("bouclier").position.x, 0, this.mesh.position.z-this.mesh.getScene().getMeshByName("bouclier").position.z);
            //normaliser le vecteur
            vectRecul = vectRecul.normalize();
            this.vectorSpeed.x += VectRecul.x*0.5;
            this.vectorSpeed.y = 0.1;
            this.vectorSpeed.z += VectRecul.z*0.5;
            
        }
    }

    takeDamage(listeMonstres, isFlying, VectRecul){
        if (this.canTakeDamage){
        this.pv -= 1;
        //reculer le monstre et l'empecher de prendre des dégats pendant 2 secondes
        this.vectorSpeed.x += VectRecul.x*0.5;
        this.vectorSpeed.y = 0.1;
        this.vectorSpeed.z += VectRecul.z*0.5;
        this.canTakeDamage = false;
        this.mesh.instancedBuffers.color = new BABYLON.Color3(1,0,1);

        setTimeout(() => {
            this.canTakeDamage = true;
            if(isFlying){
            this.mesh.instancedBuffers.color = new BABYLON.Color3(1,0.5,0);
            } else {
            this.mesh.instancedBuffers.color = BABYLON.Color3.Yellow();
            }
        }, 1000);
    }

        //si le monstre n'a plus de pv, le tuer
        if (this.pv <= 0){
            this.mesh.dispose();
            //le supprimer de la liste
            let index = listeMonstres.indexOf(this);
            if (index > -1){
                listeMonstres.splice(index, 1);
            }

        }

    }
     
    groundCheck(listeSol){
        let point = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y-(this.ySize/2)-0.1, this.mesh.position.z);
        let pointIn = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y-(this.ySize/2), this.mesh.position.z);
        //affiche le point
        //let pointMesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter: 0.1}, this.scene);
        //pointMesh.position = point;
        //pointMesh.showBoundingBox = true;
        //let pointInMesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter: 0.1}, this.scene);
        //pointInMesh.position = pointIn;
        //pointInMesh.showBoundingBox = true;

        //pour chaque sol
        listeSol.forEach(sol => {
            //si le point est dans le sol (attention aux sols en pente)
            if (sol.mesh.rotation.z != 0 || sol.mesh.rotation.x != 0){
                if (this.mesh.intersectsMesh(sol.mesh, true)){
                    //on arrête de tomber
                    this.vectorSpeed.y = 0;
                    return;
                }
            } else {
                if (sol.mesh.intersectsPoint(point)){
                    //on arrête de tomber
                    this.vectorSpeed.y = 0;
                    this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2);
                }
            }
        
        });
        //pointMesh.dispose();
        //pointInMesh.dispose();
    }

    flyingGroundCheck(listeSol){
        let point = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y-(this.ySize/2)-0.1, this.mesh.position.z);
        let pointIn = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y-(this.ySize/2), this.mesh.position.z);
        //affiche le point
        //let pointMesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter: 0.1}, this.scene);
        //pointMesh.position = point;
        //pointMesh.showBoundingBox = true;
        //let pointInMesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter: 0.1}, this.scene);
        //pointInMesh.position = pointIn;
        //pointInMesh.showBoundingBox = true;

        //pour chaque sol mouvant
        listeSol.forEach(sol => {
            //si le point est dans le sol (attention aux sols en pente)
            /*if (sol.mesh.rotation.z != 0 || sol.mesh.rotation.x != 0){
                if (this.mesh.intersectsMesh(sol.mesh, true)){
                    //on arrête de tomber
                    this.vectorSpeed.y *= 0.9;
                    return;
                }
            } else {
                if (sol.mesh.intersectsPoint(point)){
                    //on arrête de tomber
                    this.vectorSpeed.y *= 0.9;
                    this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2)+0.1;
                }
            }*/
            //verifier si c'est un movingground
            if(sol instanceof MovingGround){
                //si le monstre touche le sol
                if (this.mesh.intersectsMesh(sol.mesh, true)){
                    //récupérer la direction du sol
                    let direction = sol.direction;
                    //normaliser la direction
                    direction = direction.normalize();
                    //verifier si le monstre va dans la direction du sol en y
                    if (this.vectorSpeed.y*direction.y < 0){
                        //si non, le repousser
                        this.vectorSpeed.y += direction.y;
                        this.mesh.position.y += direction.y;
                        return;
                    }else {
                        //si oui, le repousser
                        this.vectorSpeed.y -= direction.y;
                        this.mesh.position.y -= direction.y;
                    }
                    //pousser le monstre dans la direction
                    this.vectorSpeed.y += direction.y;
                    this.mesh.position.y += direction.y;
                    console.log("poussé");
                    console.log(direction);

                }
            }
            else {
                if (this.mesh.intersectsMesh(sol.mesh, true)){
                    this.vectorSpeed.y = 0;
                    //repousser le monstre en y
                    this.vectorSpeed.y += 0.1;

                }
            }
        
        });
        //pointMesh.dispose();
        //pointInMesh.dispose();
    }


    playerCheck(player, listeMonstres){
        //si le monstre touche presque le joueur, le tuer
        /*if (player.canTakeDamage && Math.abs(player.mesh.position.x-this.mesh.position.x) < 1.1 && Math.abs(player.mesh.position.z-this.mesh.position.z) < 1.1 && Math.abs(player.mesh.position.y-this.mesh.position.y) < 1.1){

            //si le joueur est au dessus du monstre, le repousser
            if (player.mesh.position.y > this.mesh.position.y){
                player.vectorSpeed.x = 1;
                player.mesh.position.y = this.mesh.position.y;
                player.vectorSpeed.z = 1;
            }

            //enlever un point de vie
            player.takeDamage();
            //si le joueur n'a plus de pv, le tuer
            if (player.pv <= 0){
                player.killPlayer();

                listeMonstres.forEach(monstre => {
                    monstre.resetPosition();
                });
            } else {
                //reculer le joueur
                player.vectorSpeed.x = this.vectorSpeed.x*8;
                player.vectorSpeed.z = this.vectorSpeed.z*8;
                //reculer le monstre
                this.vectorSpeed.x = -this.vectorSpeed.x*40;
                this.vectorSpeed.z = -this.vectorSpeed.z*40;

            }
            
            
        }*/

        if(BABYLON.Vector2.Distance(new BABYLON.Vector2(player.mesh.position.x, player.mesh.position.z), new BABYLON.Vector2(this.mesh.position.x, this.mesh.position.z)) < player.xSize/2 + this.xSize/2+0.1 && Math.abs(player.mesh.position.y-this.mesh.position.y) < player.ySize/2 + this.ySize/2+0.1){
            //vecteur de recul
            let vectRecul = new BABYLON.Vector3(player.mesh.position.x-this.mesh.position.x, 0, player.mesh.position.z-this.mesh.position.z);
            //normaliser le vecteur
            vectRecul = vectRecul.normalize();
            //reculer le joueur
            player.vectorSpeed.x = vectRecul.x*0.5;
            player.vectorSpeed.z = vectRecul.z*0.5;

            //reculer le monstre
            this.vectorSpeed.x = -vectRecul.x*0.5;
            this.vectorSpeed.z = -vectRecul.z*0.5;
            
            if(player.canTakeDamage && player.pv > 0){
                player.takeDamage();
                
            }else if(player.canTakeDamage && player.pv <= 0){
                player.killPlayer();
                listeMonstres.forEach(monstre => {
                    monstre.resetPosition();
                });
            }
        }
    }

    resetPosition(){
        this.mesh.position.x = this.positionDepart.x;
        this.mesh.position.y = this.positionDepart.y;
        this.mesh.position.z = this.positionDepart.z;
        this.x = this.positionDepart.x;
        this.y = this.positionDepart.y;
        this.z = this.positionDepart.z;
        this.vectorSpeed.x = 0;
        this.vectorSpeed.y = 0;
        this.vectorSpeed.z = 0;
    }
}
