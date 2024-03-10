import { EditorSpawnable } from "../../editor/Editor.mjs";
import { BrokablePlatformItem } from "../../items/BrokablePlatformItem.mjs";
import { MovingItem } from "../../items/MovingItem.mjs";
import { PistonItem } from "../../items/PistonItem.mjs";
import { PlatformItem } from "../../items/PlatformItem.mjs";
import { PlayerItem } from "../../items/PlayerItem.mjs";
import { RollerItem } from "../../items/RollerItem.mjs";
import { SlippyItem } from "../../items/SlippyItem.mjs";
import { StaticCoinItem } from "../../items/StaticCoinItem.mjs";
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

    /* Coins */
    red_static: new EditorSpawnable(
        "Pièce Rouge Statique",
        "Une pièce rouge qui ne bouge pas",
        ()=>new StaticCoinItem("red")
    ),
    blue_static: new EditorSpawnable(
        "Pièce Bleue Statique",
        "Une pièce bleue qui ne bouge pas",
        ()=>new StaticCoinItem("blue")
    ),

    red_falling: new EditorSpawnable(
        "Pièce Tombante Rouge",
        "Une pièce rouge qui tombe.",
        ()=>new MovingItem(new StaticCoinItem("red"),0,1)
    ),
    blue_falling: new EditorSpawnable(
        "Pièce Tombante Bleue",
        "Une pièce bleue qui tombe.",
        ()=>new MovingItem(new StaticCoinItem("blue"),0,1)
    ),
    
    /* Players */
    player_red: new EditorSpawnable(
        "Joueur Rouge",
        "Un joueur rouge",
        ()=>new PlayerItem("red", BASE_COLLECTION.red_falling.factory, "KeyA","KeyD","KeyS")
    ),
    player_blue: new EditorSpawnable(
        "Joueur Bleu",
        "Un joueur bleu",
        ()=>new PlayerItem("blue", BASE_COLLECTION.blue_falling.factory, "KeyU","KeyO","KeyI")
    ),
    player_red_slippy: new EditorSpawnable(
        "Joueur Rouge Glissant",
        "Un joueur rouge qui glisse",
        ()=>new PlayerItem("red", ()=>new SlippyItem(new StaticCoinItem("red"), 0, 1), "KeyA","KeyD","KeyS")
    ),
    player_blue_slippy: new EditorSpawnable(
        "Joueur Bleu Glissant",
        "Un joueur bleu qui glisse",
        ()=>new PlayerItem("blue", ()=>new SlippyItem(new StaticCoinItem("blue"), 0, 1), "KeyU","KeyO","KeyI")
    ),
}