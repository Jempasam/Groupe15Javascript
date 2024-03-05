import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("unlocker", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("unlockerMaterial", scene);
        mesh.material.diffuseColor = new BABYLON.Color3(0.5,1,1);
        mesh.checkCollisions = false;
    }
    return mesh;
}

//permet au joueur de débloquer une capacité différente en fonction du nbPower
export class Unlocker extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, nbPower, scene) {
        super(name,x,y,z,xSize,ySize,zSize, getMesh(scene));
        this.nbPower = nbPower;
        this.mesh.checkCollisions = false;
    }

    //débloquer une capacité
    unlock(player){
        //défini la capacité du joueur débloquée
        // 1 = attaque
        if (this.nbPower === 1){
            player.unlockAttack = true;
            
        } 
        // 2 = saut
        if (this.nbPower === 2){
            player.maxJump =1;
        }

        //afficher le message de déblocage
        this.displayMessage(this.nbPower);

    }

    //afficher le message de déblocage
    displayMessage(nbPower){
        if(nbPower === 1){
            document.getElementById("infoJoueur").innerHTML = "Vous avez débloqué l'attaque! Faites un clic gauche pour attaquer devant vous!";
            //ajouter une bordure rouge au div
            document.getElementById("infoJoueur").style.border = "2px solid red";
            //arrondir les coins du div
            document.getElementById("infoJoueur").style.borderRadius = "10px";
        }
        if(nbPower === 2){
            document.getElementById("infoJoueur").innerHTML = "Vous avez débloqué le saut! Appuyez sur espace pour sauter!";
            //ajouter une bordure verte au div
            document.getElementById("infoJoueur").style.border = "2px solid green";
            //arrondir les coins du div
            document.getElementById("infoJoueur").style.borderRadius = "10px";
        }

        //ajouter un fond blanc au div
        document.getElementById("infoJoueur").style.backgroundColor = "white";
        //afficher le div
        document.getElementById("infoJoueur").style.display = "block";
        //afficher le div pendant 3 secondes
        setTimeout(function(){
            document.getElementById("infoJoueur").style.display = "none";
        }, 5000);
        //cacher le div



    }

}

