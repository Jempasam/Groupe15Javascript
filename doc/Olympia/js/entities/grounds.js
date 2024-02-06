import Entities from "./entities.js";


// Atterir sur un sol arrete la chute et permet de ressauter
export class Ground extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize,scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Green(),scene);
        //afficher les collisions
        //this.mesh.showBoundingBox = true;
        
    }
}
