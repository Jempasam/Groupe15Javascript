import Entities from "./entities.js";
export class Monster extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, MonsterSpeed,scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Yellow(),scene);
        this.vectorSpeed = new BABYLON.Vector3(0,0,0);
        this.MonsterSpeed = MonsterSpeed;
        this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0);
        this.positionDepart = new BABYLON.Vector3(x,y,z);
    }

    //chercher si le joueur est dans le champ de vision
    //si oui, se diriger vers lui
    //si non, se diriger vers le point de départ
    chercheJoueur(player){
        // regarde si le joueur est à moins de 10 unités de distance en x et z
        if (Math.abs(player.mesh.position.x-this.mesh.position.x) < 10 && Math.abs(player.mesh.position.z-this.mesh.position.z) < 10){
            //si oui, se tourner vers lui (pas vers le haut)
            //console.log("joueur trouvé");
            this.mesh.lookAt(new BABYLON.Vector3(player.mesh.position.x,this.mesh.position.y,player.mesh.position.z));
            //se déplacer vers lui
            this.move();

        } else {
            //si non, se tourner vers le point de départ (pas vers le haut)
            //console.log("joueur perdu");
            this.mesh.lookAt(new BABYLON.Vector3(this.positionDepart.x,this.mesh.position.y,this.positionDepart.z));
            //se déplacer vers le point de départ
            this.move();
            
        }


    }

    move(){
        this.vectorSpeed.x=0;
        this.vectorSpeed.y -= 0.005;
        this.vectorSpeed.z=0;
        this.vectorSpeed.x = this.MonsterSpeed * Math.sin(this.mesh.rotation.y);
        this.vectorSpeed.z = this.MonsterSpeed * Math.cos(this.mesh.rotation.y);
        this.mesh.moveWithCollisions(this.vectorSpeed);
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;
    }

    collisionCheck(player, listeMonstres){
        //si le monstre touche presque le joueur, le tuer
        if (Math.abs(player.mesh.position.x-this.mesh.position.x) < 1.1 && Math.abs(player.mesh.position.z-this.mesh.position.z) < 1.1 && Math.abs(player.mesh.position.y-this.mesh.position.y) < 1){
            //tue le joueur
            console.log("kill");
            player.mesh.position.x = 0;
            player.mesh.position.y = 0;
            player.mesh.position.z = 0;
            player.vectorSpeed.x = 0;
            player.vectorSpeed.y = 0;
            player.vectorSpeed.z = 0;

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
    }

    //si le monstre touche un sol
    auSol(touche){
        if (touche.name.includes("Ground") || touche.name.includes("Wall")) {
            //pose le monstre sur le sol lorsqu'il tombe dessus
            if (this.vectorSpeed.y < 0 && this.mesh.position.y > (touche.position.y + touche.scaling.y/2+this.mesh.scaling.y/2)){
                this.vectorSpeed.y = 0;
            }
            return true;
        }
    }

    //obtenir le monstre par son mesh
    getMonsterByMesh(mesh){
        if (mesh == this.mesh){
            return this;
        }
    }
}
