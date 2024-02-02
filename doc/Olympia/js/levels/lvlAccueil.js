// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";

// Constructeur de niveau
export class LvlAccueil {
    constructor( player,listes) {
        // Création de la scène
        const camY = 5;
        const camZ = 10;

        // Création des listes d'entités

        // joueur en 0 0 0
        player.mesh.position.x = 0;
        player.mesh.position.y = 0;
        player.mesh.position.z = 0;

        // Création d'un sol de départ
        const ground = new Ground("Ground1",-9, -1, 0, 20, 1, 5,this.scene);
        listes[1].push(ground);
        //ajout d'un monstre
        const monster = new Monster("Monster3",-18, 0, 0, 1, 1, 1, player.playerSpeed*1.2,this.scene);
        listes[0].push(monster);



    }
}

// Export du constructeur de niveau
export default LvlAccueil;
