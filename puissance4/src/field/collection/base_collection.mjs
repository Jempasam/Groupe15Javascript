import { EditorSpawnable } from "../../editor/Editor.mjs";
import { BrokablePlatformItem } from "../../items/BrokablePlatformItem.mjs";
import { MovingItem } from "../../items/MovingItem.mjs";
import { PlatformItem } from "../../items/PlatformItem.mjs";
import { PlayerItem } from "../../items/PlayerItem.mjs";
import { RollerItem } from "../../items/RollerItem.mjs";
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
}