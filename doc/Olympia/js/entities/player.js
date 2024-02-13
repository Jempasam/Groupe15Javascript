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
        this.canJump = false;
        this.direction = new BABYLON.Vector3(0,0,0);
        console.log(this.mesh.ellipsoidOffset);
        this.canTakeDamage = true;
        this.pvMax = 5;
        this.pv = this.pvMax;

        //temps d'invincibilité après avoir pris des dégats
        this.immortalTime = 1000;

        //afficher l'ellipsoide
        //this.mesh.showBoundingBox = true;

    }
    // Autres méthodes de la classe Player
    //detecter si un sol est juste en dessous de nous
    detectGround(listeSol){
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
                console.log(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z)
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
    }

    resetPosition(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.vectorSpeed.x = 0;
        this.vectorSpeed.y = 0;
        this.vectorSpeed.z = 0;

    }


    //bouge
    move(keyState, listes){
        this.vectorSpeed.x*=0.9;
        this.vectorSpeed.y-=0.005;
        this.vectorSpeed.z*=0.9;
        //tourne vers la direction du mouvement
        this.mesh.lookAt(new BABYLON.Vector3(this.mesh.position.x+this.vectorSpeed.x,this.mesh.position.y,this.mesh.position.z+this.vectorSpeed.z));
        //detecter si un sol est juste en dessous de nous
        this.detectGround(listes[1]);
        this.detectWarpZone(listes[4]);
        this.detectKillZone(listes[3], listes[0]);
        
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
            console.log("space");
            this.vectorSpeed.y+= this.jumpPower;
        }
    
    
        this.canJump = false;
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x= this.mesh.position.x;
        this.y= this.mesh.position.y;
        this.z= this.mesh.position.z;

        if(this.y < -1000){
            this.resetPosition();
            //repositionne tout les  monstres
            listes[0].forEach(monstre => {
                monstre.resetPosition();
            });
        }
    }
}
