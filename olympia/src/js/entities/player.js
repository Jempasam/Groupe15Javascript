import Entities from "./entities.js";
import {Monster} from "./monsters.js";
import {warpZone} from "./warpZones.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("player", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("playerMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.Red();
        mesh.checkCollisions = false;
    }
    return mesh;
}

//Personnage à controller
export class Player extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, playerSpeed, jumpPower, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.vectorSpeed = new BABYLON.Vector3(0,0,0);
        this.jumpPower = jumpPower;
        this.playerSpeed = playerSpeed;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);
        this.maxJump = 0;
        this.canJump = false;
        this.direction = new BABYLON.Vector3(0,0,0);
        //console.log(this.mesh.ellipsoidOffset);
        this.canTakeDamage = true;
        this.unlockAttack = false;
        this.canAttack = true;
        this.pvMax = 5;
        this.pv = this.pvMax;

        //temps d'invincibilité après avoir pris des dégats
        this.immortalTime = 1000;

        //afficher l'ellipsoide
        //this.mesh.showBoundingBox = true;

    }
    // Autres méthodes de la classe Player
    //detecter si un sol est juste en dessous de nous
    detectGround(listeSol, listeMoveGrounds){
        //this.canJump = false;
        //créer un point juste sous le joueur
        let point = new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y-0.51, this.mesh.position.z);
        //affiche le point
        /*let pointMesh = BABYLON.MeshBuilder.CreateSphere("point", {diameter: 0.1}, this.scene);
        pointMesh.position = point;
        pointMesh.material = new BABYLON.StandardMaterial("pointMaterial", this.scene);
        pointMesh.material.diffuseColor = BABYLON.Color3.Blue();
        pointMesh.showBoundingBox = true;*/

        //console.log("point créé");
        //console.log(point);

        //pour chaque sol
        listeSol.forEach(sol => {
            //si le point est dans le sol (attention aux sols en pente)
            if (sol.mesh.rotation.z != 0 || sol.mesh.rotation.x != 0){
            if (this.mesh.intersectsMesh(sol.mesh, true) ){
                //on peut sauter
                this.canJump = true;
                //on arrête de tomber
                this.vectorSpeed.y = 0;
            }
        } else {
            if (sol.mesh.intersectsPoint(point)){
                //on peut sauter
                this.canJump = true;
                //on arrête de tomber
                this.vectorSpeed.y = 0;
                this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2);
            }
        }
        //pointMesh.dispose();
        });

        //pour chaque sol mobile
        listeMoveGrounds.forEach(sol => {
            //si le point est dans le sol (attention aux sols en pente)
            if (sol.mesh.rotation.z != 0 || sol.mesh.rotation.x != 0){
                if (this.mesh.intersectsMesh(sol.mesh, true) ){
                    //on peut sauter
                    this.canJump = true;
                    //on arrête de tomber
                    this.vectorSpeed.y = 0;

                    this.mesh.position.x += sol.direction.x*sol.speed;
                    this.mesh.position.z += sol.direction.z*sol.speed;
                }
            } else {
                //si la plateforme monte
                if (sol.direction.y > 0){
                    if (sol.mesh.intersectsPoint(point)){
                        //on peut sauter
                        this.canJump = true;
                        //on arrête de tomber
                        this.vectorSpeed.y = 0;
                        this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2);

                        this.mesh.position.x += sol.direction.x*sol.speed;
                        this.mesh.position.z += sol.direction.z*sol.speed;
                    }
                } else {
                    //detecter le sol dans une zone rectangulaire sous le joueur
                    if (this.mesh.position.x > sol.mesh.position.x - sol.xSize/2 && this.mesh.position.x < sol.mesh.position.x + sol.xSize/2 && this.mesh.position.z > sol.mesh.position.z - sol.zSize/2 && this.mesh.position.z < sol.mesh.position.z + sol.zSize/2 && this.mesh.position.y < sol.mesh.position.y + sol.ySize/2 + this.ySize && this.mesh.position.y > sol.mesh.position.y + sol.ySize/2){
                        //on peut sauter
                        this.canJump = true;
                        //on arrête de tomber
                        this.vectorSpeed.y = 0;
                        this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2)+0.3;
                        this.mesh.position.x += sol.direction.x*sol.speed;
                        this.mesh.position.z += sol.direction.z*sol.speed;
                    }
                
                }
            }
            //pointMesh.dispose();
        });
    }

    

    detectWarpZone(listeWarpZones){
        listeWarpZones.forEach(warpZone => {
            if (this.mesh.intersectsMesh(warpZone.mesh, true)){
                this.mesh.position.x = warpZone.mesh.xOut;
                this.mesh.position.y = warpZone.mesh.yOut;
                this.mesh.position.z = warpZone.mesh.zOut;
                this.vectorSpeed.x = 0;
                this.vectorSpeed.y = 0;
                this.vectorSpeed.z = 0;
                this.x = warpZone.xOut;
                this.y = warpZone.yOut+ this.mesh.ySize;
                this.z = warpZone.zOut;
                console.log("warp");
                //console.log(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)
            }
        });
    }

    detectKillZone(listeKillZones, listeMonstres){
        //si le joueur touche une killZone et qu'il peut prendre des dégats
        if (this.canTakeDamage && this.pv > 0){
            listeKillZones.forEach(killZone => {
                if (this.mesh.intersectsMesh(killZone.mesh, true)){
                    this.takeDamage();
                }
            });
        } else if (this.pv <= 0){
            this.killPlayer();
            listeMonstres.forEach(monstre => {
                monstre.resetPosition();
            });
        }
    }

    detectUnlocker(listeUnlockers){
        listeUnlockers.forEach(unlocker => {
            if (this.mesh.intersectsMesh(unlocker.mesh, true)){
                unlocker.unlock(this);
                unlocker.mesh.dispose();
                //le supprimer de la liste
                listeUnlockers.splice(listeUnlockers.indexOf(unlocker), 1);
                unlocker = null;
            }
        });
    }

    takeDamage(){
        this.pv -= 1;
        this.canTakeDamage = false;
        //changer la couleur du joueur
        this.mesh.material.diffuseColor = BABYLON.Color3.Gray();
        //attendre 1 seconde avant de pouvoir reprendre des dégats
        setTimeout(() => {
            //changer la couleur du joueur
            this.mesh.material.diffuseColor = BABYLON.Color3.Red();
            this.canTakeDamage = true;
            
        }, this.immortalTime);
    }

    killPlayer(){
        this.pv = this.pvMax;
        this.resetPosition();
        //message dans le div
        document.getElementById("infoJoueur").innerHTML = "Vous êtes mort! Vous avez été renvoyé au début du niveau!";
        //ajouter une bordure violette au div
        document.getElementById("infoJoueur").style.border = "2px solid black";
        //arrondir les coins du div
        document.getElementById("infoJoueur").style.borderRadius = "10px";
        //ajouter un fond blanc au div
        document.getElementById("infoJoueur").style.backgroundColor = "white";
        //afficher le div
        document.getElementById("infoJoueur").style.display = "block";
        //afficher le div pendant 3 secondes
        setTimeout(function(){
            document.getElementById("infoJoueur").style.display = "none";
        }, 3000);
        //cacher le div

    }

    //fonction pour réinitialiser la position du joueur
    resetPosition(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.vectorSpeed.x = 0;
        this.vectorSpeed.y = 0;
        this.vectorSpeed.z = 0;

    }

    attaquer(){
        //si le joueur a débloqué l'attaque
        if (this.unlockAttack){
            //si il n'y a pas déjà une attaque en cours
            if(this.canAttack){
            //créer un mesh en demi sphere devant le joueur
            let attaque = BABYLON.MeshBuilder.CreateSphere("attaque", {diameter: 0.5, segments: 16}, this.scene);
            //couper la sphere en deux
            attaque.scaling.x = 6;
            attaque.scaling.y = 0.5;
            attaque.scaling.z = 4;
            //normaliser le vecteur vitesse
            let normeVitesse = Math.sqrt(this.vectorSpeed.x*this.vectorSpeed.x + this.vectorSpeed.z*this.vectorSpeed.z);
            //diviser la vitesse par sa norme
            let vecteurNormalise = new BABYLON.Vector3(this.vectorSpeed.x/normeVitesse, 0, this.vectorSpeed.z/normeVitesse);
            attaque.position = vecteurNormalise.scale(1).add(this.mesh.position);
            //tourner l'attaque dans la direction du joueur
            attaque.lookAt(this.direction);
            attaque.material = new BABYLON.StandardMaterial("attaqueMaterial", this.scene);
            attaque.material.diffuseColor = BABYLON.Color3.Blue();
            attaque.checkCollisions = false;
            this.canAttack = false;
            //attendre 1 seconde avant de faire disparaitre l'attaque
            setTimeout(() => {
                attaque.dispose();
                setTimeout(() => {
                this.canAttack = true;
                }, 200);
            }, 300);
            /*listeMonstres.forEach(monstre => {
                //si le monstre est touché
                if (attaque.intersectsMesh(monstre.mesh, true)){
                    monstre.takeDamage();
                    console.log("touché");
                }
            });*/
        }
        //}
        //si une attaque est en cours
        /*if(this.mesh.getScene().getMeshByName("attaque")){
            let attaque = this.mesh.getScene().getMeshByName("attaque");
            //faire se déplacer l'attaque avec le joueur
            //attaque.position = new BABYLON.Vector3(this.mesh.position.x+this.vectorSpeed.x*20, this.mesh.position.y, this.mesh.position.z+this.vectorSpeed.z*20);
            //rendre le mesh de moins en moins visible
            attaque.visibility -= 0.05;
            }*/
        }
    }


    //bouge
    move(keyState, listes){
        this.vectorSpeed.x*=0.9;
        this.vectorSpeed.y-=0.005;
        this.vectorSpeed.z*=0.9;
        //tourne vers la direction du mouvement
        this.direction = new BABYLON.Vector3(this.mesh.position.x+this.vectorSpeed.x,this.mesh.position.y,this.mesh.position.z+this.vectorSpeed.z);
        this.mesh.lookAt(this.direction);
        //detecter si un sol est juste en dessous de nous
        this.detectGround(listes[1], listes[7]);
        this.detectWarpZone(listes[4]);
        this.detectKillZone(listes[3], listes[0]);
        this.detectUnlocker(listes[8]);
        //this.attaquer(keyState, listes[0]);
        
        //avance dans la direction du mouvement
        if (keyState['KeyW']) {
            console.log("z");
            this.vectorSpeed.z-= this.playerSpeed;
        }
        if (keyState['KeyS']) {
            console.log("s");
            this.vectorSpeed.z+= this.playerSpeed;
        }
        if (keyState['KeyA']) {
            console.log("q");
            this.vectorSpeed.x+= this.playerSpeed;
        }
        if (keyState['KeyD']) {
            console.log("d");
            this.vectorSpeed.x-= this.playerSpeed;
        }
        if (keyState['Space'] && this.canJump) {
            if (this.maxJump > 0){
            console.log("space");
            this.vectorSpeed.y+= this.jumpPower;
            }
        }
    
    
        this.canJump = false;
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x= this.mesh.position.x;
        this.y= this.mesh.position.y;
        this.z= this.mesh.position.z;

        if(this.y < -1000){
            this.resetPosition();
            this.pv -= 1;
            //repositionne tout les  monstres
            listes[0].forEach(monstre => {
                monstre.resetPosition();
            });
            //message dans le div
            document.getElementById("infoJoueur").innerHTML = "Ne sautez pas dans le vide! Vous risqueriez de vous blesser très fort!";
            //ajouter une bordure violette au div
            document.getElementById("infoJoueur").style.border = "2px solid purple";
            //arrondir les coins du div
            document.getElementById("infoJoueur").style.borderRadius = "10px";
            //ajouter un fond blanc au div
            document.getElementById("infoJoueur").style.backgroundColor = "white";
            //afficher le div
            document.getElementById("infoJoueur").style.display = "block";
            //afficher le div pendant 3 secondes
            setTimeout(function(){
                document.getElementById("infoJoueur").style.display = "none";
            }, 3000);
            //cacher le div

        }
    }
}