// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";

// Constructeur de niveau
export class Lvl1 {
    constructor( player,listes) {
        // reset le joueur
        player.resetPosition();

        // Création d'un sol de départ
        const ground = new Ground("Ground1",4, -1, 20, 20, 1, 60,this.scene);
        listes[1].push(ground);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P1 = new Wall("WallL1P1", 0, 6, -5, 5, 20, 5,this.scene);
        listes[2].push(wallL1P1);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P2 = new Wall("WallL1P2", 0, 6, 5, 5, 20, 5,this.scene);
        listes[2].push(wallL1P2);

        // PosX, PosY, PosZ, TailleX, TailleY, Taille Z
        const wallL1P3 = new Wall("WallL1P3", 0, 11, 0, 5, 10, 8,this.scene);
        listes[2].push(wallL1P3);
        
    }
}

// Export du constructeur de niveau
export default Lvl1;
