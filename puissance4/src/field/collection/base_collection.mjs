import { EditorSpawnable } from "../../editor/Editor.mjs";
import { BrokablePlatformItem } from "../../items/BrokablePlatformItem.mjs";
import { MovingItem } from "../../items/MovingItem.mjs";
import { PipeItem } from "../../items/PipeItem.mjs";
import { PistonItem } from "../../items/PistonItem.mjs";
import { PlatformItem, WallItem } from "../../items/PlatformItem.mjs";
import { PlayerItem } from "../../items/PlayerItem.mjs";
import { RollerItem } from "../../items/RollerItem.mjs";
import { SlippyItem } from "../../items/SlippyItem.mjs";
import { CoinItem } from "../../items/CoinItem.mjs";
import { WindItem } from "../../items/WindItem.mjs";
import { MeteorItem } from "../../items/MeteorItem.mjs";
import { SnakeItem } from "../../items/SnakeItem.mjs";
import { FruitItem } from "../../items/FruitItem.mjs";
import { SpawnerItem } from "../../items/SpawnerItem.mjs";
import { FallingPlatformItem } from "../../items/FallingPlatformItem.mjs";
import { GoombaItem } from "../../items/GoombaItem.mjs";
import { ShootingPipeItem } from "../../items/ShootingPipe.mjs";
import { TNTItem } from "../../items/TNTItem.mjs";
import { BocalItem } from "../../items/BocalItem.mjs";
import { LinkItem } from "../../items/LinkItem.mjs";
import { MoblinItem } from "../../items/MoblinItem.mjs";
import { PacmanItem } from "../../items/PacmanItem.mjs";
import { CandyItem } from "../../items/CandyItem.mjs";
import { FALLING_FACTORY, NEW_BICOLOR_FACTORY, NEW_BUBBLE_FACTORY, NEW_CANDY_FACTORY, NEW_METEOR_FACTORY, NEW_SNAKE_FACTORY, SLIPPY_FACTORY, WILD_CANDY_FACTORY } from "./base_factories.mjs";
import { BubbleItem } from "../../items/BubbleItem.mjs";


const RED_KEYS=["KeyQ","KeyE","KeyW"]
const BLUE_KEYS=["KeyU","KeyO","KeyI"]
const GREEN_KEYS=["KeyR","KeyY","KeyT"]
const YELLOW_KEYS=["KeyV","KeyN","KeyB"]

const DIRECTIONS={
    "top": ["Haut",0,-1],
    "bottom": ["Bas",0,1],
    "left": ["Gauche",-1,0],
    "right": ["Droite",1,0],
}

function transform(obj,callback){
    let ret={}
    for(let [key,value] of Object.entries(obj)){
        const [nkey,nvalue]=callback(key,value)
        ret[nkey]=nvalue
    }
    return ret
}

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

    /* SNAKE */
    snake: new EditorSpawnable(
        "Serpent Controllable",
        "Un serpent controllable avec les flèches de direction. Il peut manger les pièces fixes pour grandir.",
        10,
        ()=>new SnakeItem(new PlatformItem(), 0, 1, ["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"])
    ),
    fruit: new EditorSpawnable(
        "Fruit",
        "Un fruit que les serpents peuvent manger. Ils sont fragiles et se cassent facilement.",
        10,
        ()=> new FruitItem()
    ),
    fruit_spawner: new EditorSpawnable(
        "Générateur de Fruit",
        "Un générateur qui fait apparaitres des fruits au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(60,()=>new FruitItem())
    ),

    /* ZELDA */
    link: new EditorSpawnable(
        "Link",
        "Un personnage contrôlable avec les flèches de direction. Il peut attaquer les objets en face de lui en avançant vers eux.",
        10,
        ()=>new LinkItem(null, ["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"])
    ),
    moblin: new EditorSpawnable(
        "Moblin",
        "Un ennemi qui se déplace aléatoirement et change de direction lorsqu'il rencontre un obstacle en le frappant.",
        10,
        ()=>new MoblinItem(null)
    ),
    explosive_moblin: new EditorSpawnable(
        "Moblin Explosif",
        "Un moblin qui fait tomber une bombe une fois mort.",
        10,
        ()=>new MoblinItem(new TNTItem())
    ),
    wall: new EditorSpawnable(
        "Mur",
        "Un mur indestructible.",
        10,
        ()=>new WallItem()
    ),

    /* BONHOMMES */
    goomba_platform: new EditorSpawnable(
        "Goomba Plateforme",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte une plateforme qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new PlatformItem())
    ),

    goomba_fruit: new EditorSpawnable(
        "Goomba Goomba",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte un goomba qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new GoombaItem())
    ),

    aero_goomba: new EditorSpawnable(
        "Aero Goomba",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte un ventilateur qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new WindItem())
    ),

    goomba_explosif: new EditorSpawnable(
        "Goomba Explosif",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte une bombe qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new TNTItem())
    ),

    /* PACMAN */
    pacman: new EditorSpawnable(
        "Pacman",
        "Un pacman contrôlable avec les touches directionelles.",
        10,
        ()=>new PacmanItem(0,-1,["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"])
    ),

    /* BOCAL */
    bocal_tnt: new EditorSpawnable(
        "Bocal à bombe",
        "Un bocal fragile qui contient une bombe.",
        10,
        ()=>new BocalItem(new TNTItem())
    ),
    bocal_goomba: new EditorSpawnable(
        "Bocal à Goomba",
        "Un bocal fragile qui contient un goomba.",
        10,
        ()=>new BocalItem(new GoombaItem())
    ),
    bocal_moblin: new EditorSpawnable(
        "Bocal à Moblin",
        "Un bocal fragile qui contient un moblin.",
        10,
        ()=>new BocalItem(new MoblinItem())
    ),
    bocal_serpent: new EditorSpawnable(
        "Bocal à Serpent Explosif",
        "Un bocal fragile qui contient un serpent explosif.",
        10,
        ()=>new BocalItem(new SnakeItem(new TNTItem(), Math.random()>.5?1:-1, 0))
    ),
    

    /* SPAWNERS */
    gravel_spawner: new EditorSpawnable(
        "Générateur de Gravier",
        "Un générateur qui fait apparaitre du terrain qui chute au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(100,()=>new FallingPlatformItem())
    ),
    bubble_spawner: new EditorSpawnable(
        "Générateur de Bulles",
        "Un generateur qui fait apparaitre des bulles qui explose après un petit moement.",
        10,
        ()=>new SpawnerItem(100,()=>new BubbleItem())
    ),
    candy_spawner: new EditorSpawnable(
        "Générateur de Bonbons",
        "Un générateur qui fait apparaître des bonbons et des paires de bonbons au hasard. Les bonbons disparaissent quand associés par 4.",
        10,
        ()=>new SpawnerItem(100,WILD_CANDY_FACTORY)
    ),

    snake_spawner: new EditorSpawnable(
        "Générateur de Serpent",
        "Un générateur qui fait apparaitre des serpents au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(200,()=>new SnakeItem(new PlatformItem(), 0, 1))
    ),
    moblin_spawner: new EditorSpawnable(
        "Générateur de Moblin",
        "Un générateur qui fait apparaitre des moblins au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(100,()=>new MoblinItem())
    ),

    /* Pistons */
    ...transform(DIRECTIONS,(name,[txt,x,y])=>{
        return [ `piston_${name}`, new EditorSpawnable(
            `Piston ${txt}`,
            `Un piston qui projette les objets vers le ${txt}`,
            10,
            ()=>new PistonItem(x,y)
        )]
    }),

    /* Pipes */
    ...transform(DIRECTIONS,(name,[txt,x,y])=>{
        return [ `pipe_${name}`, new EditorSpawnable(
            `Tuyau ${txt}`,
            `Un tuyau qui transporte les objets vers le ${txt}`,
            10,
            ()=>new PipeItem(x,y)
        )]
    }),
    
    ...transform(DIRECTIONS,(name,[txt,x,y])=>{
        return [ `shooting_pipe_${name}`, new EditorSpawnable(
            `Tuyau Canon ${txt}`,
            `Un tuyau qui transporte les objets vers le ${txt} et les projette à la sortie.`,
            10,
            ()=>new ShootingPipeItem(x,y)
        )]
    }),

    ...per_team("red","Rouge",RED_KEYS),
    ...per_team("blue","Bleu",BLUE_KEYS),
    ...per_team("green","Vert",GREEN_KEYS),
    ...per_team("yellow","Jaune",YELLOW_KEYS),
}
String.fromCharCode()
function per_team(team,team_txt,keys){
    const control_txt=`Contrôlé avec ${keys[0]}, ${keys[1]} et ${keys[2]}.`
    return {
        [`coin_${team}`]: new EditorSpawnable(
            `Pièce ${team_txt}`,
            `Une pièce ${team_txt}`,
            10,
            ()=>new CoinItem(team)
        ),
        [`coin_${team}_falling`]: new EditorSpawnable(
            `Pièce Tombante ${team_txt}`,
            `Une pièce ${team_txt} qui tombe.`,
            10,
            ()=>new MovingItem(new CoinItem(team), 0, 1)
        ),
        [`player_${team}`]: new EditorSpawnable(
            `Joueur ${team_txt}`,
            `Un joueur ${team_txt}.${control_txt}`,
            10,
            ()=>new PlayerItem(team, FALLING_FACTORY, ...keys)
        ),
        [`player_${team}_bubble`]: new EditorSpawnable(
            `Joueur ${team_txt} Bulle`,
            `Un joueur ${team_txt} qui une fois sur tois envoie une bulle qui disparait après un petit moment.${control_txt}`,
            10,
            ()=>new PlayerItem(team, NEW_BUBBLE_FACTORY(), ...keys)
        ),
        [`player_${team}_candy`]: new EditorSpawnable(
            `Joueur ${team_txt} Bonbon`,
            `Un joueur ${team_txt} qui lance un double bonbon une fois sur deux. Les bonbon disparaissent quand associés par 4.${control_txt}`,
            10,
            ()=>new PlayerItem(team, NEW_CANDY_FACTORY(), ...keys)
        ),
        [`player_${team}_bicolor`]: new EditorSpawnable(
            `Joueur ${team_txt} Bicolore`,
            `Un joueur ${team_txt} qui lance une double pièce bicolore une fois sur deux.${control_txt}`,
            10,
            ()=>new PlayerItem(team, NEW_BICOLOR_FACTORY(), ...keys)
        ),
        [`player_${team}_meteor`]: new EditorSpawnable(
            `Joueur ${team_txt} Météore`,
            `Un joueur ${team_txt} dont un jeton sur trois casse le truc en dessous.${control_txt}`,
            10,
            ()=>new PlayerItem(team, NEW_METEOR_FACTORY(), ...keys)
        ),
        [`player_${team}_slippy`]: new EditorSpawnable(
            `Joueur ${team_txt} Glissant`,
            `Un joueur ${team_txt} qui glisse.${control_txt}`,
            10,
            ()=>new PlayerItem(team, SLIPPY_FACTORY, ...keys)
        ),
        [`player_${team}_snake`]: new EditorSpawnable(
            `Joueur ${team_txt} Serpent`,
            `Un joueur ${team_txt} qui lance des serpents une fois sur trois.${control_txt}`,
            10,
            ()=>new PlayerItem(team, NEW_SNAKE_FACTORY(), ...keys)
        ),
    }
}