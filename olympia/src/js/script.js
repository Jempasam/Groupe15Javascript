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
let listeBreakableWalls = [];
let listes;
let decor;
let nbLevel = -1;


var createScene = function() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black;
    const camY = 10;
    const camZ = 10;

    //créer une camera qui regarde en 0,0,0
    camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, camY, camZ), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    //créer une lumière
    const light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 5,6));

    //créer un joueur
    player = new Player("Player",0, 0, 0, 1, 1, 1, 0.008, 0.2, scene);
    //player = scene.player;
    camera.lockedTarget = player.mesh;
    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls];
    //appeler le niveau
    decor = new LvlTest(player, listes);
    

    definitEcouteurs();

    return scene;
}
let sceneToRender = createScene();

function definitEcouteurs() { 
    // Ecouteur sur le clavier pour bouger le monstre
    window.addEventListener('keydown', function(evt) {
        keyState[evt.code] = true;
    }, true);
    window.addEventListener('keyup', function(evt) {
        delete keyState[evt.code];
    }, true);
    window.addEventListener('keydown', function(evt) {
        if (evt.code != 'F12') {
            evt.preventDefault();
        }
    });
    //detecter un clic gauche
    window.addEventListener("click", function(evt){
        player.attaquer();
    });
    
}

//déplacer le joueur
function movePlayer(){
    //let listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls];
    player.move(keyState, listes);
    detectLvlWarp();
    camera.position.x = player.mesh.position.x;
    
}

//detecter la collision entre le joueur et un LvLWarp
function detectLvlWarp(){
    listeLvlWarps.forEach(lvlWarp => {
        if (player.mesh.intersectsMesh(lvlWarp.mesh, false)){
            nbLevel = lvlWarp.nbLevel;
            console.log("lvlWarp");
            console.log(nbLevel);
            changeLevel();
        }
    });
}

//changer de niveau
function changeLevel(){
    //supprimer les anciens éléments
    listeMonstres.forEach(monstre => {
        monstre.mesh.dispose();
        monstre = null;
    });
    listeMonstres = [];
    listeGrounds.forEach(ground => {
        ground.mesh.dispose();
        ground = null;
    });
    listeGrounds = [];
    listeWalls.forEach(wall => {
        wall.mesh.dispose();
        wall = null;
    });
    listeWalls = [];
    listeKillZones.forEach(killZone => {
        killZone.mesh.dispose();
        killZone = null;
    });
    listeKillZones = [];
    listeWarpZones.forEach(warpZone => {
        warpZone.mesh.dispose();
        warpZone = null;
    });
    listeWarpZones = [];
    listeLvlWarps.forEach(lvlWarp => {
        lvlWarp.mesh.dispose();
        lvlWarp = null;
    });
    listeLvlWarps = [];
    listeBreakableWalls.forEach(breakableWall => {
        breakableWall.mesh.dispose();
        breakableWall = null;
    });
    listeBreakableWalls = [];

    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls];
    //supprimer le décor
    //changer de niveau
    if (nbLevel == -1){
        decor = new LvlTest(player, listes);
    }
    if (nbLevel == 0){
        
        decor = new LvlAccueil(player, listes);
    }
}


//boucle de rendu
engine.runRenderLoop(function () {
    sceneToRender.render();
    movePlayer();
    //faire chercher le joueur par les monstres
    listeMonstres.forEach(monstre => {
        monstre.chercheJoueur(player, listeMonstres, listeGrounds);
        //si le monstre touche un sol, arrete de tomber
        /*monstre.mesh.onCollideObservable.add((collidedMesh)=>{
            let touche = collidedMesh;
            monstre.auSol(touche);
        })*/
    });
    //detecter si on tape un breakableWall
    listeBreakableWalls.forEach(breakableWall => {
        breakableWall.detectAttack(listeBreakableWalls);
    }
    );
    //afficher les pv actuels du joueur
    document.getElementById("pv").innerHTML = "PV: " + player.pv;


});
