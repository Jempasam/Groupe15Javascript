import Entities from "./entities.js";
import {Monster} from "./monsters.js";
import {warpZone} from "./warpZones.js";

//Personnage à controller
export class Player extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, playerSpeed, jumpPower,scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Red(),scene);
        this.vectorSpeed = new BABYLON.Vector3(0,0,0);
        this.jumpPower = jumpPower;
        this.playerSpeed = playerSpeed;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);
        this.canJump = false;
        this.direction = new BABYLON.Vector3(0,0,0);
        console.log(this.mesh.ellipsoidOffset);

        /*this.pvMax = 5;
        this.pv = this.pvMax;*/

        //afficher l'ellipsoide
        //this.mesh.showBoundingBox = true;

    }
    // Autres méthodes de la classe Player
    //agit en fonction des collisions avec les murs, les sols et les killzones
    collisionCheck(touche,listeMonstres){
        if (touche.name.includes("Ground")) {
            //pose le joueur sur le sol lorsqu'il tombe dessus et redonne un saut
            if (this.vectorSpeed.y < 0 && this.mesh.position.y > (touche.position.y + touche.scaling.y/2+this.mesh.scaling.y/2)){
                this.vectorSpeed.y = 0;
                this.canJump = true;
            }
    
        }
        if (touche.name.includes("Wall")) {
            //pose le joueur sur le sol lorsqu'il tombe dessus
            if (this.vectorSpeed.y < 0 && this.mesh.position.y > touche.position.y + touche.scaling.y/2){
                this.mesh.position.y = touche.position.y + touche.scaling.y/2 + this.mesh.scaling.y/2;
                this.vectorSpeed.y = 0;
            }
        }
        if (touche.name.includes("KillZone")) {
            //tue le joueur
            console.log("kill");
            this.mesh.position.x = 0;
            this.mesh.position.y = 0;
            this.mesh.position.z = 0;
            this.vectorSpeed.x = 0;
            this.vectorSpeed.y = 0;
            this.vectorSpeed.z = 0;
            //repositionne tout les  monstres
            listeMonstres.forEach(monstre => {
                monstre.mesh.position.x = monstre.positionDepart.x;
                monstre.mesh.position.y = monstre.positionDepart.y;
                monstre.mesh.position.z = monstre.positionDepart.z;
                monstre.vectorSpeed.x = 0;
                monstre.vectorSpeed.y = 0;
                monstre.vectorSpeed.z = 0;
            });
        }
        if (touche.name.includes("warpZone")) {
            this.mesh.position.x = touche.xOut;
            this.mesh.position.y = touche.yOut;
            this.mesh.position.z = touche.zOut;
            console.log("warp");
            console.log(this.mesh.position);

        }
    }

    //bouge
    move(keyState, listeMonstres){
        this.vectorSpeed.x*=0.9;
        this.vectorSpeed.y-=0.005;
        this.vectorSpeed.z*=0.9;
        //tourne vers la direction du mouvement
        this.mesh.lookAt(new BABYLON.Vector3(this.mesh.position.x+this.vectorSpeed.x,this.mesh.position.y,this.mesh.position.z+this.vectorSpeed.z));
        //avance dans la direction du mouvement
        if (keyState['z'] || keyState['Z']) {
            console.log("z");
            this.vectorSpeed.z-= this.playerSpeed;
        }
        if (keyState['s'] || keyState['S']) {
            console.log("s");
            this.vectorSpeed.z+= this.playerSpeed;
        }
        if (keyState['q'] || keyState['Q']) {
            console.log("q");
            this.vectorSpeed.x+= this.playerSpeed;
        }
        if (keyState['d'] || keyState['D']) {
            console.log("d");
            this.vectorSpeed.x-= this.playerSpeed;
        }
        if (keyState[' '] && this.canJump) {
            console.log("space");
            this.vectorSpeed.y+= this.jumpPower;
        }

        if (keyState[' '] && this.canJump) {
            console.log("space");
            this.vectorSpeed.y+= this.jumpPower;
        }
    
    
        this.canJump = false;
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.collisionCheck(this.mesh, listeMonstres);
        this.x= this.mesh.position.x;
        this.y= this.mesh.position.y;
        this.z= this.mesh.position.z;

        if(this.y < -1000){
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
            //repositionne tout les  monstres
            listeMonstres.forEach(monstre => {
                monstre.mesh.position.x = monstre.positionDepart.x;
                monstre.mesh.position.y = monstre.positionDepart.y;
                monstre.mesh.position.z = monstre.positionDepart.z;
                monstre.x = monstre.positionDepart.x;
                monstre.y = monstre.positionDepart.y;
                monstre.z = monstre.positionDepart.z;
                monstre.vectorSpeed.x = 0;
                monstre.vectorSpeed.y = 0;
                monstre.vectorSpeed.z = 0;
            });
        }
    }
}
