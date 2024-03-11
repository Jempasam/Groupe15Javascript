import { EditorSpawnable } from "../../editor/Editor.mjs";
import { BrokablePlatformItem } from "../../items/BrokablePlatformItem.mjs";
import { MovingItem } from "../../items/MovingItem.mjs";
import { PipeItem } from "../../items/PipeItem.mjs";
import { PistonItem } from "../../items/PistonItem.mjs";
import { PlatformItem } from "../../items/PlatformItem.mjs";
import { PlayerItem } from "../../items/PlayerItem.mjs";
import { RollerItem } from "../../items/RollerItem.mjs";
import { SlippyItem } from "../../items/SlippyItem.mjs";
import { CoinItem } from "../../items/CoinItem.mjs";
import { WindItem } from "../../items/WindItem.mjs";
import { MeteorItem } from "../../items/MeteorItem.mjs";


const SLIPPY_FACTORY= (team)=>new SlippyItem(new CoinItem(team), 0, 1)
const FALLING_FACTORY= (team)=>new MovingItem(new CoinItem(team), 0, 1)
function NEW_METEOR_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%3==1)return new MeteorItem(new CoinItem(team), 0, 1)
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

const RED_KEYS=["KeyQ","KeyE","KeyW"]
const BLUE_KEYS=["KeyU","KeyO","KeyI"]
const GREEN_KEYS=["KeyR","KeyY","KeyT"]
const YELLOW_KEYS=["KeyV","KeyN","KeyB"]


/**
 * @type {Object<string,EditorSpawnable>}
 */
export const BASE_COLLECTION={
    /* Ventilator */
    ventilator: new EditorSpawnable(
        "Ventilateur",
        "Repousse les objets à droite et à gauche",
        10,
        ()=>new WindItem()
    ),

    /* Platforms */
    platform: new EditorSpawnable(
        "Plateforme",
        "Plateforme immobile",
        5,
        ()=>new PlatformItem()
    ),
    brokable: new EditorSpawnable(
        "Plateforme cassable",
        "Plateforme qui se casse après un certain nombre de passages",
        10,
        ()=>new BrokablePlatformItem()
    ),

    /* Rollers */
    roller_left: new EditorSpawnable(
        "Rouleau Gauche",
        "Rouleau déplace les unité au dessus vers la gauche",
        10,
        ()=>new RollerItem(-1)
    ),
    roller_right: new EditorSpawnable(
        "Rouleau Droite",
        "Rouleau déplace les unité au dessus vers la droite",
        10,
        ()=>new RollerItem(1)
    ),

    /* Pistons */
    piston_top: new EditorSpawnable(
        "Piston Haut",
        "Un piston qui projette les objets vers le haut",
        10,
        ()=>new PistonItem(0,-1)
    ),
    piston_bottom: new EditorSpawnable(
        "Piston Bas",
        "Un piston qui projette les objets vers le bas",
        10,
        ()=>new PistonItem(0,1)
    ),
    piston_left: new EditorSpawnable(
        "Piston Gauche",
        "Un piston qui projette les objets vers la gauche",
        10,
        ()=>new PistonItem(-1,0)
    ),
    piston_right: new EditorSpawnable(
        "Piston Droite",
        "Un piston qui projette les objets vers la droite",
        10,
        ()=>new PistonItem(1,0)
    ),

    /* Pipes */
    pipe_top: new EditorSpawnable(
        "Tuyau Haut",
        "Un tuyau qui projette les objets vers le haut",
        10,
        ()=>new PipeItem(0,-1)
    ),
    pipe_bottom: new EditorSpawnable(
        "Tuyau Bas",
        "Un tuyau qui projette les objets vers le bas",
        10,
        ()=>new PipeItem(0,1)
    ),
    pipe_left: new EditorSpawnable(
        "Tuyau Gauche",
        "Un tuyau qui projette les objets vers la gauche",
        10,
        ()=>new PipeItem(-1,0)
    ),
    pipe_right: new EditorSpawnable(
        "Tuyau Droite",
        "Un tuyau qui projette les objets vers la droite",
        10,
        ()=>new PipeItem(1,0)
    ),
    ...per_team("red","Rouge",RED_KEYS),
    ...per_team("blue","Bleu",BLUE_KEYS),
    ...per_team("green","Vert",GREEN_KEYS),
    ...per_team("yellow","Jaune",YELLOW_KEYS),
}
function per_team(team,team_txt,keys){
    return {
        [`coin_${team}`]: new EditorSpawnable(
            `Pièce ${team_txt}`,
            `Une pièce ${team_txt}`,
            10,
            ()=>new CoinItem(team)
        ),
        [`coin_${team}_falling`]: new EditorSpawnable(
            `Pièce Tombante ${team_txt}`,
            `Une pièce ${team_txt} qui tombe`,
            10,
            ()=>new MovingItem(new CoinItem(team), 0, 1)
        ),
        [`player_${team}`]: new EditorSpawnable(
            `Joueur ${team_txt}`,
            `Un joueur ${team_txt}`,
            10,
            ()=>new PlayerItem(team, FALLING_FACTORY, ...keys)
        ),
        [`player_${team}_meteor`]: new EditorSpawnable(
            `Joueur ${team_txt} Météore`,
            `Un joueur ${team_txt} dont un jeton sur trois casse le truc en dessous`,
            10,
            ()=>new PlayerItem(team, NEW_METEOR_FACTORY(), ...keys)
        ),
        [`player_${team}_slippy`]: new EditorSpawnable(
            `Joueur ${team_txt} Glissant`,
            `Un joueur ${team_txt} qui glisse`,
            10,
            ()=>new PlayerItem(team, SLIPPY_FACTORY, ...keys)
        ),
    }
}