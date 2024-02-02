import Entities from "./entities.js";

//atterir sur un mu arrete la chute mais ne permet pas de ressauter
export class killZone extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, scene) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Purple(), scene);
        
    }
}