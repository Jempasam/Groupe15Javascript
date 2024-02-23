import { Player } from "./entities/player.js";
import { LvlTest } from "./levels/lvlTest.js";
import { LvlAccueil } from "./levels/lvlAccueil.js";
import { Lvl1} from "./levels/lvl1.js";

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
let listeMoveGrounds = [];
let listeUnlocker = [];
let listes;
let decor;
let nbLevel = -1;


var createScene = function() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black;
    const camY = 10;
    const camZ = -10;

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
    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker];
    //appeler le niveau
    changeLevel();
    

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
    //let listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker];
    player.move(keyState, listes);
    detectLvlWarp();
    
    //si on est dans le niveau d'accueil, la camera suit le joueur en z
    switch (nbLevel){
        case 0:
            camera.position.x = player.mesh.position.x;
            camera.position.z = 10;
            break;

        case 1:
            camera.position.x = player.mesh.position.x;
            camera.position.z = player.mesh.position.z + 15;
            camera.position.y = player.mesh.position.y + 10;
            break

        default:
            camera.position.x = player.mesh.position.x;
            camera.position.z = 10;
            break;
    }
    
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
    listeMoveGrounds.forEach(moveGround => {
        moveGround.mesh.dispose();
        moveGround = null;
    });
    listeMoveGrounds = [];
    listeUnlocker.forEach(unlocker => {
        unlocker.mesh.dispose();
        unlocker = null;
    });
    listeUnlocker = [];

    listes = [listeMonstres, listeGrounds, listeWalls, listeKillZones, listeWarpZones, listeLvlWarps, listeBreakableWalls, listeMoveGrounds, listeUnlocker];
    //supprimer le décor
    //changer de niveau
    if (nbLevel == -1){
        decor = new LvlTest(player, listes);
    }
    if (nbLevel == 0){
        
        decor = new LvlAccueil(player, listes);
    }
    if (nbLevel == 1){

        decor = new Lvl1(player,listes);
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
    listeMoveGrounds.forEach(moveGround => {
        moveGround.move();
    });
    //afficher les pv actuels du joueur
    document.getElementById("pv").innerHTML = "PV: " + player.pv;


});
