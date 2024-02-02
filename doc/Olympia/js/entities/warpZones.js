import Entities from "./entities.js";

//atterir sur un mu arrete la chute mais ne permet pas de ressauter
export class warpZone extends Entities {
    constructor(name,x,y,z,xSize,ySize,zSize, xOut, yOut, zOut) {
        super(name,x,y,z,xSize,ySize,zSize, BABYLON.Color3.Black());
        this.mesh.xOut = xOut;
        this.mesh.yOut = yOut;
        this.mesh.zOut = zOut;
    }

    
}