import Entities from "./entities.js";

let mesh;
function getMesh(scene){
    if(!mesh){
        mesh = BABYLON.MeshBuilder.CreateBox("unlocker", {height: 1, width: 1, depth: 1}, scene);
        mesh.isVisible = false;
        mesh.material = new BABYLON.StandardMaterial("wallMaterial", scene);
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
    }

    //débloquer une capacité
    unlock(player){
        //défini la capacité du joueur débloquée
        if (this.nbPower === 1){
            player.unlockAttack = true;
        } 
        if (this.nbPower === 2){
            player.maxJump =1;
        }

    }

}

