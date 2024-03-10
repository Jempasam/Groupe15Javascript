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

export const BASE_COLLECTION={
    /* Ventilator */
    ventilator: new EditorSpawnable(
        "Ventilateur",
        "Repousse les objets à droite et à gauche",
        ()=>new WindItem()
    ),

    /* Platforms */
    platform: new EditorSpawnable(
        "Plateforme",
        "Plateforme immobile",
        ()=>new PlatformItem()
    ),
    brokable: new EditorSpawnable(
        "Plateforme cassable",
        "Plateforme qui se casse après un certain nombre de passages",
        ()=>new BrokablePlatformItem()
    ),

    /* Rollers */
    roller_left: new EditorSpawnable(
        "Rouleau Gauche",
        "Rouleau déplace les unité au dessus vers la gauche",
        ()=>new RollerItem(-1)
    ),
    roller_right: new EditorSpawnable(
        "Rouleau Droite",
        "Rouleau déplace les unité au dessus vers la droite",
        ()=>new RollerItem(1)
    ),

    /* Pistons */
    piston_top: new EditorSpawnable(
        "Piston Haut",
        "Un piston qui projette les objets vers le haut",
        ()=>new PistonItem(0,-1)
    ),
    piston_bottom: new EditorSpawnable(
        "Piston Bas",
        "Un piston qui projette les objets vers le bas",
        ()=>new PistonItem(0,1)
    ),
    piston_left: new EditorSpawnable(
        "Piston Gauche",
        "Un piston qui projette les objets vers la gauche",
        ()=>new PistonItem(-1,0)
    ),
    piston_right: new EditorSpawnable(
        "Piston Droite",
        "Un piston qui projette les objets vers la droite",
        ()=>new PistonItem(1,0)
    ),

    /* Pipes */
    pipe_top: new EditorSpawnable(
        "Tuyau Haut",
        "Un tuyau qui projette les objets vers le haut",
        ()=>new PipeItem(0,-1)
    ),
    pipe_bottom: new EditorSpawnable(
        "Tuyau Bas",
        "Un tuyau qui projette les objets vers le bas",
        ()=>new PipeItem(0,1)
    ),
    pipe_left: new EditorSpawnable(
        "Tuyau Gauche",
        "Un tuyau qui projette les objets vers la gauche",
        ()=>new PipeItem(-1,0)
    ),
    pipe_right: new EditorSpawnable(
        "Tuyau Droite",
        "Un tuyau qui projette les objets vers la droite",
        ()=>new PipeItem(1,0)
    ),

    /* Coins */
    red_static: new EditorSpawnable(
        "Pièce Rouge Statique",
        "Une pièce rouge qui ne bouge pas",
        ()=>new CoinItem("red")
    ),
    blue_static: new EditorSpawnable(
        "Pièce Bleue Statique",
        "Une pièce bleue qui ne bouge pas",
        ()=>new CoinItem("blue")
    ),

    red_falling: new EditorSpawnable(
        "Pièce Tombante Rouge",
        "Une pièce rouge qui tombe.",
        ()=>new MovingItem(new CoinItem("red"),0,1)
    ),
    blue_falling: new EditorSpawnable(
        "Pièce Tombante Bleue",
        "Une pièce bleue qui tombe.",
        ()=>new MovingItem(new CoinItem("blue"),0,1)
    ),
    
    /* Players */
    player_red: new EditorSpawnable(
        "Joueur Rouge",
        "Un joueur rouge",
        ()=>new PlayerItem("red", FALLING_FACTORY, ...RED_KEYS)
    ),
    player_blue: new EditorSpawnable(
        "Joueur Bleu",
        "Un joueur bleu",
        ()=>new PlayerItem("blue", FALLING_FACTORY, ...BLUE_KEYS)
    ),
    player_red_slippy: new EditorSpawnable(
        "Joueur Rouge Glissant",
        "Un joueur rouge qui glisse",
        ()=>new PlayerItem("red", SLIPPY_FACTORY, ...RED_KEYS)
    ),
    player_blue_slippy: new EditorSpawnable(
        "Joueur Bleu Glissant",
        "Un joueur bleu qui glisse",
        ()=>new PlayerItem("blue", SLIPPY_FACTORY, ...BLUE_KEYS)
    ),
    

    /* Other Players */
    player_green: new EditorSpawnable(
        "Joueur Vert",
        "Un joueur vert",
        ()=>new PlayerItem("green", FALLING_FACTORY, ...GREEN_KEYS)
    ),
    player_yellow: new EditorSpawnable(
        "Joueur Jaune",
        "Un joueur jaune",
        ()=>new PlayerItem("yellow", FALLING_FACTORY, ...YELLOW_KEYS)
    ),
    player_green_slippy: new EditorSpawnable(
        "Joueur Vert Glissant",
        "Un joueur vert qui glisse",
        ()=>new PlayerItem("green", SLIPPY_FACTORY, ...GREEN_KEYS)
    ),
    player_yellow_slippy: new EditorSpawnable(
        "Joueur Jaune Glissant",
        "Un joueur jaune qui glisse",
        ()=>new PlayerItem("yellow", SLIPPY_FACTORY, ...YELLOW_KEYS)
    ),
}

const SLIPPY_FACTORY= (team)=>new SlippyItem(new CoinItem(team), 0, 1)
const FALLING_FACTORY= (team)=>new MovingItem(new CoinItem(team), 0, 1)

const RED_KEYS=["KeyQ","KeyE","KeyW"]
const BLUE_KEYS=["KeyU","KeyO","KeyI"]
const GREEN_KEYS=["KeyR","KeyY","KeyT"]
const YELLOW_KEYS=["KeyV","KeyN","KeyB"]