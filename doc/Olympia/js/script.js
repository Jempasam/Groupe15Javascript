import { Player } from "./entities/player.js";
import { Monster } from "./entities/monsters.js";
import { Ground } from "./entities/grounds.js";
import { Wall } from "./entities/walls.js";
import { killZone } from "./entities/killZones.js";
import { warpZone } from "./entities/warpZones.js";
import { lvlWarp } from "./entities/lvlWarp.js";
import { LvlTest } from "./levels/lvlTest.js";
import { LvlAccueil } from "./levels/lvlAccueil.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let keyState = {};
let scene;

let camera;
let player;
let listeMonstres = [];
let listeGrounds = [];
let listeWalls = [];
let listeKillZones = [];
let listeWarpZones = [];
let listeLvlWarps = [];

let nbLevel = -1;


var createScene = function() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black;
    const camY = 15;
    const camZ = 10;

    //créer une camera qui regarde en 0,0,0
    camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, camY, camZ), scene);
    
    camera.attachControl(canvas, true);

    //créer une lumière
    const light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 5,6));

    //créer un joueur
    player = new Player("Player",0, 0, 0, 1, 1, 1, 0.005, 0.1, scene);
    //player = scene.player;
    camera.lockedTarget = player.mesh;
    let listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps];
    //appeler le niveau
    let test = new LvlTest(player, listes);
    

    definitEcouteurs();

    return scene;
}
let sceneToRender = createScene();

function definitEcouteurs() { 
    // Ecouteur sur le clavier pour bouger le monstre
    window.addEventListener('keydown', function(evt) {
        keyState[evt.key] = true;
    }, true);
    window.addEventListener('keyup', function(evt) {
        delete keyState[evt.key];
    }, true);
    window.addEventListener('keydown', function(evt) {
        if (evt.key != 'F12') {
            evt.preventDefault();
        }
    });
}

//déplacer le joueur
function movePlayer(){
    player.move(keyState, listeMonstres);
    camera.position.x = player.mesh.position.x;
    
}

//collisions avec tout les objets
player.mesh.onCollideObservable.add((collidedMesh)=>{
    let touche = collidedMesh;
    //console.log(touche.name);
    if (touche.name.includes("lvlWarp")) {
        nbLevel = touche.nbLevel;
        //enlever les monstres
        listeMonstres.forEach(monstre => {
            monstre.mesh.dispose();
        });
        listeMonstres = [];
        //enlever les sols
        listeGrounds.forEach(ground => {
            ground.mesh.dispose();
        });
        listeGrounds = [];
        //enlever les murs
        listeWalls.forEach(wall => {
            wall.mesh.dispose();
        });
        listeWalls = [];
        //enlever les killZones
        listeKillZones.forEach(killZone => {
            killZone.mesh.dispose();
        });
        listeKillZones = [];
        //enlever les warpZones
        listeWarpZones.forEach(warpZone => {
            warpZone.mesh.dispose();
        });
        listeWarpZones = [];
        //enlever les lvlWarps
        listeLvlWarps.forEach(lvlWarp => {
            lvlWarp.mesh.dispose();
        });
        listeLvlWarps = [];
        let listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps];
        let test;
        switch (nbLevel) {
            case -1:
                test = new LvlTest(player, listes);
                break;
            case 0:
                test = new LvlAccueil(player, listes);
                break;
            default:
                break;
        }
        console.log(nbLevel);


    } else {
        player.collisionCheck(touche, listeMonstres); 
    }
});



//boucle de rendu
engine.runRenderLoop(function () {
    sceneToRender.render();
    movePlayer();
    //faire chercher le joueur par les monstres
    listeMonstres.forEach(monstre => {
        monstre.chercheJoueur(player);
        monstre.collisionCheck(player, listeMonstres);
        //si le monstre touche un sol, arrete de tomber
        monstre.mesh.onCollideObservable.add((collidedMesh)=>{
            let touche = collidedMesh;
            monstre.auSol(touche);
        })
        monstre.move();
    });


});

