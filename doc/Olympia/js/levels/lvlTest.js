// Import des classes du dossier "entities"
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monsters.js";
import { Ground } from "../entities/grounds.js";
import { Wall } from "../entities/walls.js";
import { killZone } from "../entities/killZones.js";
import { warpZone } from "../entities/warpZones.js";
import { lvlWarp } from "../entities/lvlWarp.js";

// Constructeur de niveau
export class LvlTest {
    constructor(player, listes) {
        //créer un sol de départ
    const ground = new Ground("Ground1",-9, -1, 0, 20, 1, 5,this.scene);
    listes[1].push(ground);
    //créer un mur au bout du premier sol en -x et tourné de 90°
    const ground2= new Ground("Ground2",-21.5, -1, -7.5, 5, 1, 20,this.scene);
    listes[1].push(ground2);
    //créer un sol en hauteur
    const ground3 = new Ground("Ground3",-9, 0.5, -10, 10, 2, 15,this.scene);
    listes[1].push(ground3);
    //créer une rampe en tournant le sol
    const ground4 = new Ground("Ground4",-2, 2, -5, 10, 1, 5,this.scene);
    //tourner le sol
    ground4.mesh.rotation.z = -Math.PI/6;
    //actualiser les collisions
    ground4.mesh.refreshBoundingInfo();
    listes[1].push(ground4);
    //créer une rampe en tournant le sol
    const ground5 = new Ground("Ground5",-9, 0, -1, 4, 1, 4,this.scene);
    //tourner le sol
    ground5.mesh.rotation.x = Math.PI/6;

    //actualiser les collisions
    ground5.mesh.refreshBoundingInfo();
    listes[1].push(ground5);


    //créer une warpZone
    const warpZone1 = new warpZone("warpZone1",-9, 2, -5, 1, 1, 1, -21.5, 0, -9,this.scene);
    listes[4].push(warpZone1);
    //créer un lvlWarp
    const lvlWarp0 = new lvlWarp("lvlWarp0",-12, 2, -5, 1, 1, 1, 0,this.scene);
    listes[5].push(lvlWarp0);
    //créer une killZone
    const killZone1 = new killZone("KillZone1",-15, 0.5, -5, 2, 2, 5,this.scene);
    listes[3].push(killZone1);
    //mettre un sol sous la killZone
    const ground6 = new Ground("Ground6",-15, -1, -5, 2, 1, 5,this.scene);
    listes[1].push(ground6);

    //créer des monstres
    const monster = new Monster("Monster1",-20, 0, 0, 1, 1, 1, player.playerSpeed*3,this.scene);
    listes[0].push(monster);
    const monster2 = new Monster("Monster2",-23, 1.5, -5, 3, 3, 3, player.playerSpeed*2,this.scene);
    listes[0].push(monster2);

    player.resetPosition();

    }

}

// Export du constructeur de niveau
export default LvlTest;
