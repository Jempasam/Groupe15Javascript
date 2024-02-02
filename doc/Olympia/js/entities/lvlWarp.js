import Entities from "./entities.js";

//atterir sur un mu arrete la chute mais ne permet pas de ressauter
export class lvlWarp extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, nbLevel, scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.White(), scene);
        this.mesh.nbLevel = nbLevel;
    }
    
}