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
import { FALLING_FACTORY, NEW_BICOLOR_FACTORY, NEW_BUBBLE_FACTORY, NEW_CANDY_FACTORY, NEW_METEOR_FACTORY, NEW_SNAKE_FACTORY, NEW_TETRIS_FACTORY, SLIPPY_FACTORY, WILD_CANDY_FACTORY, WILD_TETRIS_FACTORY } from "./base_factories.mjs";
import { BubbleItem } from "../../items/BubbleItem.mjs";
import { LynelItem } from "../../items/LynelItem.mjs";
import { OctorokItem } from "../../items/OctorokItem.mjs";
import { TetrisItem } from "../../items/TetrisItem.mjs";
import { ALL_CONTROLERS_FACTORIES, WanderingControler } from "../../items/controler/Controlers.mjs";
import { MouseItem } from "../../items/MouseItem.mjs";


const DIRECTIONS={
    "top": ["Haut",0,-1],
    "bottom": ["Bas",0,1],
    "left": ["Gauche",-1,0],
    "right": ["Droite",1,0],
}

/** @type {Array<[number,number]>} */
const vDIRECTIONS=[[0,-1],[1,0],[0,1],[-1,0]]

/** @type {Array<string>} */
const vTEAMS=["red","blue","yellow","green"]

/** @type {Array<[string,string,string]>} */
const vKEYS=[["KeyQ","KeyE","KeyW"], ["KeyU","KeyO","KeyI"], ["KeyR","KeyY","KeyT"], ["KeyV","KeyN","KeyB"]]

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
    roller: new EditorSpawnable(
        "Rouleau",
        "Rouleau déplace les unité au dessus vers la droite ou la gauche",
        10,
        v=>new RollerItem(v%2*2-1)
    ),

    /* SNAKE */
    snake: new EditorSpawnable(
        "Serpent Controllable",
        "Un serpent controllable avec les flèches de direction. Il peut manger les objects comestibles.",
        10,
        v=>new SnakeItem(new PlatformItem(), ...vDIRECTIONS[v%4], ALL_CONTROLERS_FACTORIES[Math.floor(v/4)%ALL_CONTROLERS_FACTORIES.length]())
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
        (v)=>new LinkItem(null, ALL_CONTROLERS_FACTORIES[v%ALL_CONTROLERS_FACTORIES.length]())
    ),
    moblin: new EditorSpawnable(
        "Moblin",
        "Un ennemi qui se déplace aléatoirement et change de direction lorsqu'il rencontre un obstacle en le frappant.",
        10,
        ()=>new MoblinItem(null)
    ),
    octorok: new EditorSpawnable(
        "Octorok",
        "Un ennemi qui se déplace aléatoirement et lance des projectiles dans les 4 directions. Il n'attaque pas en se déplaçant.",
        10,
        ()=>new OctorokItem(()=>new BubbleItem())
    ),
    octorok_explosif: new EditorSpawnable(
        "Octorok Explosif",
        "Un ennemi qui se déplace aléatoirement et lance des projectiles bombes dans les 4 directions. Il n'attaque pas en se déplaçant.",
        10,
        ()=>new OctorokItem(()=>new TNTItem())
    ),
    lynel: new EditorSpawnable(
        "Lynel",
        "Un ennemi puissant qui se déplace, attaque, change de direction, attrape des items, saute, et en lance au hasard.",
        10,
        v=>new LynelItem(null,v%6+1)
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
        (v)=>new PacmanItem(0,-1,ALL_CONTROLERS_FACTORIES[v%ALL_CONTROLERS_FACTORIES.length]())
    ),

    /* MOUSE */
    mouse: new EditorSpawnable(
        "Pointeur de souris",
        "Une souris folle qui se déplace aléatoirement et intéragit avec l'environnement.",
        10,
        (v)=>new MouseItem()
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
        ()=>new BocalItem(new SnakeItem(new TNTItem(), Math.random()>.5?1:-1, 0, new WanderingControler(),1))
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
    tetris_spawner: new EditorSpawnable(
        "Générateur de Tetris",
        "Un générateur qui fait apparaître des blocs de tetris. Les blocs disparaissent lorsqu'ils occupent une ligne entière.",
        10,
        ()=>new SpawnerItem(100,WILD_TETRIS_FACTORY)
    ),

    snake_spawner: new EditorSpawnable(
        "Générateur de Serpent",
        "Un générateur qui fait apparaitre des serpents au hasard sur le terrain.",
        10,
        v=> new SpawnerItem(200,()=>new SnakeItem(new PlatformItem(), ...vDIRECTIONS[v%4], new WanderingControler(),1))
    ),
    moblin_spawner: new EditorSpawnable(
        "Générateur de Moblin",
        "Un générateur qui fait apparaitre des moblins au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(100,()=>new MoblinItem())
    ),

    piston: new EditorSpawnable(
            `Piston`,
            `Un piston qui projette les objets dans une direction`,
            10,
            v=>new PistonItem(...vDIRECTIONS[v%4])
    ),

    pipe: new EditorSpawnable(
        `Tuyau`,
        `Un tuyau qui transporte les objets et les aspire à son entrée`,
        10,
        v=>new PipeItem(...vDIRECTIONS[v%4])
    ),

    shooting_pipe: new EditorSpawnable(
        `Tuyau Canon`,
        `Un tuyau qui transporte les objets, les aspire à son entrée et les projette à la sortie.`,
        10,
        v=>new ShootingPipeItem(...vDIRECTIONS[v%4])
    ),

    coin: new EditorSpawnable(
        `Pièce`,
        `Une pièce`,
        10,
        v=>new CoinItem(vTEAMS[v%4])
    ),
    coin_falling: new EditorSpawnable(
        `Pièce Tombante`,
        `Une pièce qui tombe.`,
        10,
        v=>new MovingItem(new CoinItem(vTEAMS[v%4]), 0, 1)
    ),
    tetris: new EditorSpawnable(
        "Bloc de Tetris",
        "Un bloc de tetris qui disparaissent lorsqu'ils occupent une ligne entière.",
        10,
        v=>new TetrisItem(vTEAMS[v%4])
    ),
    player: new EditorSpawnable(
        `Joueur`,
        `Un joueur.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], FALLING_FACTORY, ...vKEYS[v%4])
    ),
    player_bubble: new EditorSpawnable(
        `Joueur Bulle`,
        `Un joueur qui une fois sur tois envoie une bulle qui disparait après un petit moment.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_BUBBLE_FACTORY(), ...vKEYS[v%4])
    ),
    player_candy: new EditorSpawnable(
        `Joueur Bonbon`,
        `Un joueur qui lance un double et triple bonbons une fois sur deux. Les bonbon disparaissent quand associés par 4.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_CANDY_FACTORY(), ...vKEYS[v%4])
    ),
    player_tetris: new EditorSpawnable(
        `Joueur Tetris`,
        `Un joueur qui lance des blocs de tetris  une fois sur deux. Les blocs disparaissent lorsqu'il sont alignés sur une ligne.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_TETRIS_FACTORY(), ...vKEYS[v%4])
    ),
    player_bicolor: new EditorSpawnable(
        `Joueur Bicolore`,
        `Un joueur qui lance une double pièce bicolore une fois sur deux.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_BICOLOR_FACTORY(), ...vKEYS[v%4])
    ),
    player_meteor: new EditorSpawnable(
        `Joueur Météore`,
        `Un joueur dont un jeton sur trois casse le truc en dessous.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_METEOR_FACTORY(), ...vKEYS[v%4])
    ),
    player_slippy: new EditorSpawnable(
        `Joueur Glissant`,
        `Un joueur qui glisse.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], SLIPPY_FACTORY, ...vKEYS[v%4])
    ),
    player_snake: new EditorSpawnable(
        `Joueur Serpent`,
        `Un joueur qui lance des serpents une fois sur trois.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_SNAKE_FACTORY(), ...vKEYS[v%4])
    ),
}
