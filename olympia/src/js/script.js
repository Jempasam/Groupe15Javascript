import { UniversalCamera } from "../../../babylonjs/core/Cameras/universalCamera.js";
import { Engine } from "../../../babylonjs/core/Engines/engine.js";
import { Color3 } from "../../../babylonjs/core/Maths/math.color.js";
import { Vector3 } from "../../../babylonjs/core/Maths/math.vector.js";
import { SceneOptimizer, SceneOptimizerOptions } from "../../../babylonjs/core/Misc/sceneOptimizer.js";
import { Scene } from "../../../babylonjs/core/scene.js";
import { adom, create } from "../../../samlib/DOM.mjs";
import { GameMenu } from "../../../samlib/gui/GameMenu.mjs";
import { HubLevel } from "./levels/HubLevel.mjs";
import { LevelContext } from "./levels/Level.mjs";
import { MessageManager } from "./messages/MessageManager.mjs";
import { CAMERA } from "./objects/behaviour/CameraBehaviour.mjs";
import { DOCUMENT } from "./objects/behaviour/InventoryBehaviour.mjs";
import { SOUND_BANK } from "./objects/behaviour/MusicBehaviour.mjs";
import { MESSAGE } from "./objects/behaviour/interaction/HintBehaviour.mjs";
import { SCENE } from "./objects/model/MeshModel.mjs";
import { World } from "./objects/world/World.mjs";
import { loadModels } from "./ressources/Models.mjs";
import { loadSounds } from "./ressources/SoundBank.mjs";

/** Récupère et crée la fenêtre de jeu */
const gameElement = document.getElementById("olympia");
if(!gameElement){
    window.alert("Impossible de trouver l'élément pour y insérer le jeu!")
    throw new Error("Impossible de trouver l'élément pour y insérer le jeu!")
}
gameElement.innerHTML=""
const canvas=adom/*html*/`<canvas width=800 height=500></canvas>`
const infoJoueur=create("div.olympia-messages")
export const message= new MessageManager(infoJoueur)
gameElement.appendChild(canvas)
gameElement.appendChild(infoJoueur)

const engine = new Engine(canvas, true);
engine.displayLoadingUI()

let scene;
let world=new World()
world.persistent_model.set(DOCUMENT,gameElement)
let levelContext
let pause = false;

let camera;



async function createScene() {
    scene = new Scene(engine);
    SceneOptimizer.OptimizeAsync(scene, new SceneOptimizerOptions(60))
    //scene.debugLayer.show();
    scene.clearColor = Color3.Black();
    world.persistent_model.set(SCENE,scene)
    world.persistent_model.set(MESSAGE,message)
    world.models=await loadModels(scene)
    world.persistent_model.set(SOUND_BANK,await loadSounds())
    const camY = 10;
    const camZ = -10;

    // Créer une camera qui regarde en 0,0,0
    camera = new UniversalCamera("camera", new Vector3(0, camY, camZ), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);
    world.persistent_model.set(CAMERA,camera)

    levelContext=new LevelContext(world,{camera})

    // Créer une lumière

    return scene;
}

async function main(){
    let sceneToRender = await createScene();

    window.addEventListener('keydown', function(evt) {
        if (evt.code == "KeyP"){
            pause = !pause;
            if (pause){
                message.send("PAUSE", MessageManager.FOREVER, "pause");
            }
            else{
                message.clear("pause");
            }
        }
    });

    engine.hideLoadingUI()

    // Menu
    const game_menu=new GameMenu()
    game_menu.onplay=()=>{
        console.log("Play")
        // Boucle de tick
        setInterval(function(){
            if (!pause){
                world.tick()
                levelContext.tick()
            }
        }, 30);

        //boucle de rendu
        engine.runRenderLoop(function () {
            sceneToRender.render();
        });
        levelContext.switchTo(new HubLevel())
        game_menu.remove()
        engine.resize()
    }
    gameElement?.append(game_menu)
    
    
}
main()