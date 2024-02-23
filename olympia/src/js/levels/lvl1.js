// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { BreakableWall } from "../entities/breakableWalls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";
import { Unlocker } from "../entities/unlocker.js";

// Constructeur de niveau
export class Lvl1 {
    constructor( player,listes) {
        // reset le joueur
        player.resetPosition();

        // Création d'un sol de départ
        const ground = new Ground("Ground1",3, -1, 5, 14, 1, 20,this.scene);
        listes[1].push(ground);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P1 = new Wall("WallL1P1", -18, 6, -5, 37, 20, 5,this.scene);
        listes[2].push(wallL1P1);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P2 = new Wall("WallL1P2", -18, 6, 5, 37, 20, 5,this.scene);
        listes[2].push(wallL1P2);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P3 = new Wall("WallL1P3", -18, 11, 0, 37, 10, 8,this.scene);
        listes[2].push(wallL1P3);

        const groundE11 = new Ground("GroundE11",3, -3, 18, 11, 1, 5,this.scene);
        listes[1].push(groundE11);
        //créer un sol
        const groundE12 = new Ground("GroundE12",3, -2.5, 17, 11, 1, 5,this.scene);
        listes[1].push(groundE12);
        //créer un sol
        const groundE13 = new Ground("Groun9E13",3, -2, 16, 11, 1, 5,this.scene);
        listes[1].push(groundE13);
        //créer un sol
        const groundE14 = new Ground("GroundE14",3, -1.5, 15, 11, 1, 5,this.scene);
        listes[1].push(groundE14);
        //créer un sol
        const groundE15 = new Ground("GroundE15",3, -1, 14, 11, 1, 5,this.scene);
        listes[1].push(groundE15);
        const groundE16 = new Ground("GroundE16",3, -3.5, 19, 11, 1, 5,this.scene);
        listes[1].push(groundE16);
        const groundE17 = new Ground("GroundE17",3, -4, 20, 11, 1, 5,this.scene);
        listes[1].push(groundE17);

        //créer un mur cassable
        const murLvl1 = new BreakableWall("MurLvl1",10, -2, 30.5, 2, 2, 15, this.scene);
        listes[6].push(murLvl1);

        // Création d'un sol de départ
        const ground2 = new Ground("Ground2",33, -4, 30, 75, 1, 15,this.scene);
        listes[1].push(ground2);

        // Création d'un débloqueur d'attaque
        const unlocker = new Unlocker("Unlocker1",0, 0, 10, 1, 1, 1, 1, this.scene);
        listes[8].push(unlocker);
        
    }
}

// Export du constructeur de niveau
export default Lvl1;
