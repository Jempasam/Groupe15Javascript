import Entities from "./entities.js";

//atterir sur un mu arrete la chute mais ne permet pas de ressauter. On peut s'en servir comme plateforme aussi
//même si le nom est trompeur
export class Wall extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Blue(),scene);
        
    }
}