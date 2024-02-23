import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("monster", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.registerInstancedBuffer("color", 4);
        mesh.material = new BABYLON.StandardMaterial("wallMaterial", scene);
        mesh.material.diffuseColor = BABYLON.Color3.White();
        mesh.checkCollisions = false;
    }
    return mesh;
}

export class Monster extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, MonsterSpeed, pv, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.vectorSpeed = new BABYLON.Vector3(0,0,0);
        this.MonsterSpeed = MonsterSpeed;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);
        this.mesh.instancedBuffers.color = BABYLON.Color3.Yellow();
        this.positionDepart = new BABYLON.Vector3(x,y,z);
        this.pv = pv;
        this.canTakeDamage = true;
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
        this.vectorSpeed.x=0;
        this.vectorSpeed.y -= 0.005;
        this.vectorSpeed.z=0;
        this.vectorSpeed.x = this.MonsterSpeed * Math.sin(this.mesh.rotation.y);
        this.vectorSpeed.z = this.MonsterSpeed * Math.cos(this.mesh.rotation.y);

        this.groundCheck(listeSol);
        this.detectAttack(listeMonstres);
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
        this.vectorSpeed.x=0;
        this.vectorSpeed.y=0;
        this.vectorSpeed.z=0;
        if (playerFound){
            this.vectorSpeed.x = this.MonsterSpeed * Math.sin(this.mesh.rotation.y);
            this.vectorSpeed.z = this.MonsterSpeed * Math.cos(this.mesh.rotation.y);
            if(player.mesh.position.y > this.mesh.position.y){
                this.vectorSpeed.y = this.MonsterSpeed;
            } else {
                this.vectorSpeed.y = -this.MonsterSpeed;
            }
        } else {
            this.vectorSpeed.x = this.MonsterSpeed * Math.sin(this.mesh.rotation.y);
            this.vectorSpeed.z = this.MonsterSpeed * Math.cos(this.mesh.rotation.y);
            if(this.positionDepart.y > this.mesh.position.y){
                this.vectorSpeed.y = this.MonsterSpeed;
            } else {
                this.vectorSpeed.y = -this.MonsterSpeed;
            }
        }

        this.flyingGroundCheck(listeSol);
        this.detectAttack(listeMonstres);
        this.playerCheck(player, listeMonstres);
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;
    }

    detectAttack(listeMonstres){
        //si on touche le mesh attaque
        if (this.mesh.getScene().getMeshByName("attaque") && this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("attaque"))){
        //if (this.mesh.intersectsMesh(this.mesh.getScene().getMeshByName("attaque"))){
            //enlever un point de vie
            this.takeDamage(listeMonstres);
        }
    }

    takeDamage(listeMonstres){
        if (this.canTakeDamage){
        this.pv -= 1;
        //reculer le monstre et l'empecher de prendre des dégats pendant 2 secondes
        this.vectorSpeed.x = -this.vectorSpeed.x*80;
        this.vectorSpeed.y = 0.1;
        this.vectorSpeed.z = -this.vectorSpeed.z*80;
        this.canTakeDamage = false;
        this.mesh.instancedBuffers.color = BABYLON.Color3.Red();

        setTimeout(() => {
            this.canTakeDamage = true;
            this.mesh.instancedBuffers.color = BABYLON.Color3.Yellow();
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
                    this.vectorSpeed.y = this.MonsterSpeed;
                    this.mesh.position.y = sol.mesh.position.y + (sol.ySize/2) + (this.ySize/2)+0.1;
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
            //reculer le joueur
            player.vectorSpeed.x = this.vectorSpeed.x*8;
            player.vectorSpeed.z = this.vectorSpeed.z*8;
            //reculer le monstre
            this.vectorSpeed.x = -this.vectorSpeed.x*40;
            this.vectorSpeed.z = -this.vectorSpeed.z*40;
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
