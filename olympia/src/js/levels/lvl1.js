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
import { MovingGround } from "../entities/movingGrounds.js";

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

        const wallL1P4 = new Wall("WallL1P4", -6, 0, 0, 4, 20, 5,this.scene);
        listes[2].push(wallL1P4);

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

        // Création du sol principal
        const ground2 = new Ground("Ground2",8, -4, 30, 22, 1, 15,this.scene);
        listes[1].push(ground2);

        // Création d'un débloqueur d'attaque
        const unlocker = new Unlocker("Unlocker1",0, 0, 10, 1, 1, 1, 1, this.scene);
        listes[8].push(unlocker);

        let PosMouvementY = -4.5;
        let PosMouvementZ = 30
        
        const movingGround1 = new MovingGround("MovingGround1", 20, PosMouvementY, PosMouvementZ, 6, 1, 6, 28, PosMouvementY, PosMouvementZ, 0.045 ,this.scene);
        listes[1].push(movingGround1);
        listes[7].push(movingGround1);

        const movingGround2 = new MovingGround("MovingGround2", 40, PosMouvementY, PosMouvementZ, 6, 1, 6, 32, PosMouvementY, PosMouvementZ, 0.045 ,this.scene);
        listes[1].push(movingGround2);
        listes[7].push(movingGround2);

        //Créer un sol
        const groundE18 = new Ground("GroundE18",51, -4, 30, 19, 1, 13,this.scene);
        listes[1].push(groundE18);

        //Créer un sol
        const groundE19 = new Ground("GroundE19",51, -4, 34, 9.5, 1, 40,this.scene);
        listes[1].push(groundE19);

        //créer un mur cassable
        const murLvl2 = new BreakableWall("MurLvl2",51, -1.5, 20, 9.5, 4, 2, this.scene);
        listes[6].push(murLvl2);

        const monster1 = new Monster("Monster1","Panda", 53, -4, 32, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
        listes[0].push(monster1);

        const monster2 = new Monster("Monster2","Panda", 53, -4, 30, 1, 1, 1, player.playerSpeed*3, 2, this.scene);
        listes[0].push(monster2);

        const monster4 = new Monster("Monster4","Panda", 50, -4, 19, 2, 2, 2, player.playerSpeed*3, 3, this.scene);
        listes[0].push(monster4);



        const movingGround3 = new MovingGround("MovingGround3", 64, -4.3, 50, 6, 1, 8, 57, -4.3, 50, 0.03 ,this.scene);
        listes[1].push(movingGround3);
        listes[7].push(movingGround3);

        const movingGround4 = new MovingGround("MovingGround4", 70, -4.5, 50, 7, 1, 8, 70, 2.5, 50, 0.03 ,this.scene);
        listes[1].push(movingGround4);
        listes[7].push(movingGround4);

        const movingGround5 = new MovingGround("MovingGround5", 77, 2.5, 50, 7, 1, 8, 77, -4.5, 50, 0.03 ,this.scene);
        listes[1].push(movingGround5);
        listes[7].push(movingGround5);

        const movingGround6 = new MovingGround("MovingGround6", 84, -4.5, 50, 7, 1, 8, 84, 2.5, 50, 0.03 ,this.scene);
        listes[1].push(movingGround6);
        listes[7].push(movingGround6);

        const monster3 = new Monster("Monster3","Panda", 84, 0, 50, 1, 1, 1, player.playerSpeed*2, 2, this.scene);
        listes[0].push(monster3);
        monster3.chercheJoueur = Monster.prototype.flyingChercheJoueur;
        monster3.mesh.instancedBuffers.color = new BABYLON.Color3(1,0.5,0);

        //créer un mur cassable
        const murLvl3 = new BreakableWall("MurLvl3",51, -3, 40, 9.5, 2, 2, this.scene);
        listes[6].push(murLvl3);

        const murLvl4 = new BreakableWall("MurLvl4",51, -3, 43, 9.5, 2, 2, this.scene);
        listes[6].push(murLvl4);

        
    }
}

// Export du constructeur de niveau
export default Lvl1;
