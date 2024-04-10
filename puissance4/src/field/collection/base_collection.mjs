import { BrokablePlatformItem } from "../../items/BrokablePlatformItem.mjs";
import { MovingItem } from "../../items/MovingItem.mjs";
import { PipeItem } from "../../items/PipeItem.mjs";
import { PistonItem } from "../../items/PistonItem.mjs";
import { PlatformItem, WallItem } from "../../items/PlatformItem.mjs";
import { PlayerItem } from "../../items/PlayerItem.mjs";
import { RollerItem } from "../../items/RollerItem.mjs";
import { CoinItem } from "../../items/CoinItem.mjs";
import { WindItem } from "../../items/WindItem.mjs";
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
import { FALLING_FACTORY, NEW_BICOLOR_FACTORY, NEW_BUBBLE_FACTORY, NEW_CANDY_FACTORY, NEW_METEOR_FACTORY, NEW_SNAKE_FACTORY, NEW_TETRIS_FACTORY, SLIPPY_FACTORY, WILD_CANDY_FACTORY, WILD_TETRIS_FACTORY } from "./base_factories.mjs";
import { BubbleItem } from "../../items/BubbleItem.mjs";
import { LynelItem } from "../../items/LynelItem.mjs";
import { OctorokItem } from "../../items/OctorokItem.mjs";
import { TetrisItem } from "../../items/TetrisItem.mjs";
import { ALL_CONTROLERS, WanderingControler } from "../../items/controler/Controlers.mjs";
import { MouseItem } from "../../items/MouseItem.mjs";
import { roundGet } from "../../../../samlib/Array.mjs";
import { MasterhandItem } from "../../items/MasterhandItem.mjs";
import { ItemSpawnable } from "../field/ItemSpawnable.mjs";
import { ItemModifier } from "../field/ItemModifier.mjs";
import { ItemCollection } from "../field/ItemField.mjs";


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
const vTEAMS_NAMES=["Rouge","Bleu","Jaune","Vert"]

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
 * @type {Object<string,ItemSpawnable>}
 */
export const BASE_SPAWNABLE={
    /* Ventilator */
    ventilator: new ItemSpawnable(
        "Ventilateur",
        "Repousse les objets à droite et à gauche",
        10,
        ()=>new WindItem()
    ),

    /* Platforms */
    platform: new ItemSpawnable(
        "Plateforme",
        "Plateforme immobile",
        5,
        ()=>new PlatformItem()
    ),
    brokable: new ItemSpawnable(
        "Plateforme cassable",
        "Plateforme qui se casse après un certain nombre de passages",
        10,
        ()=>new BrokablePlatformItem()
    ),

    /* Rollers */
    roller: new ItemSpawnable(
        "Rouleau",
        "Rouleau déplace les unité au dessus vers la droite ou la gauche",
        10,
        v=>new RollerItem(v%2*2-1)
    ),

    /* SNAKE */
    snake: new ItemSpawnable(
        "Serpent Controllable",
        "Un serpent controllable avec les flèches de direction. Il peut manger les objects comestibles.",
        10,
        v=>new SnakeItem(new PlatformItem(), ...vDIRECTIONS[v%4], roundGet(ALL_CONTROLERS,Math.floor(v/4)).factory()),
        v=>roundGet(ALL_CONTROLERS,Math.floor(v/4)).name
    ),
    fruit: new ItemSpawnable(
        "Fruit",
        "Un fruit que les serpents peuvent manger. Ils sont fragiles et se cassent facilement.",
        10,
        ()=> new FruitItem()
    ),
    fruit_spawner: new ItemSpawnable(
        "Générateur de Fruit",
        "Un générateur qui fait apparaitres des fruits au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(60,()=>new FruitItem())
    ),

    /* ZELDA */
    link: new ItemSpawnable(
        "Link",
        "Un personnage contrôlable avec les flèches de direction. Il peut attaquer les objets en face de lui en avançant vers eux.",
        10,
        v=>new LinkItem(null, roundGet(ALL_CONTROLERS,v).factory()),
        v=>roundGet(ALL_CONTROLERS,v).name
    ),
    moblin: new ItemSpawnable(
        "Moblin",
        "Un ennemi qui se déplace aléatoirement et change de direction lorsqu'il rencontre un obstacle en le frappant.",
        10,
        ()=>new MoblinItem(null)
    ),
    octorok: new ItemSpawnable(
        "Octorok",
        "Un ennemi qui se déplace aléatoirement et lance des projectiles dans les 4 directions. Il n'attaque pas en se déplaçant.",
        10,
        ()=>new OctorokItem(()=>new BubbleItem())
    ),
    octorok_explosif: new ItemSpawnable(
        "Octorok Explosif",
        "Un ennemi qui se déplace aléatoirement et lance des projectiles bombes dans les 4 directions. Il n'attaque pas en se déplaçant.",
        10,
        ()=>new OctorokItem(()=>new TNTItem())
    ),
    lynel: new ItemSpawnable(
        "Lynel",
        "Un ennemi puissant qui se déplace, attaque, change de direction, attrape des items, saute, et en lance au hasard.",
        10,
        v=>new LynelItem(null,v%6+1),
        v=> (v%6+1)+" Vies"
    ),
    explosive_moblin: new ItemSpawnable(
        "Moblin Explosif",
        "Un moblin qui fait tomber une bombe une fois mort.",
        10,
        ()=>new MoblinItem(new TNTItem())
    ),
    wall: new ItemSpawnable(
        "Mur",
        "Un mur indestructible.",
        10,
        ()=>new WallItem()
    ),

    /* BONHOMMES */
    goomba_platform: new ItemSpawnable(
        "Goomba Plateforme",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte une plateforme qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new PlatformItem())
    ),

    goomba_fruit: new ItemSpawnable(
        "Goomba Goomba",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte un goomba qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new GoombaItem())
    ),

    aero_goomba: new ItemSpawnable(
        "Aero Goomba",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte un ventilateur qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new WindItem())
    ),

    goomba_explosif: new ItemSpawnable(
        "Goomba Explosif",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il porte une bombe qu'il fait tomber si on l'écrase.",
        10,
        ()=>new GoombaItem(new TNTItem())
    ),

    /* PACMAN */
    pacman: new ItemSpawnable(
        "Pacman",
        "Un pacman contrôlable avec les touches directionelles.",
        10,
        (v)=>new PacmanItem(0,-1,roundGet(ALL_CONTROLERS,v).factory()),
    ),

    /* MOUSE */
    mouse: new ItemSpawnable(
        "Pointeur de souris",
        "Une souris folle qui se déplace aléatoirement et intéragit avec l'environnement.",
        10,
        (v)=>new MouseItem()
    ),

    /* MASTER HAND */
    master_hand: new ItemSpawnable(
        "Master Hand",
        "Un Concepteur de niveau plutôt approximatif, il reste le temps de finir son travail et vous laisse jouer tranquille.",
        10,
        v=>{
            switch(v%4){
                case 0: return new MasterhandItem(3,3)
                case 1: return new MasterhandItem(3,0)
                case 2: return new MasterhandItem(6,0)
                default: return new MasterhandItem(20,10)
            }
        },
        v=>{
            switch(v%4){
                case 0: return "Master Hand"
                case 1: return "Faster Hand"
                case 2: return "Super Faster Hand"
                default: return "Elder Hand"
            }
        }
    ),

    /* BOCAL */
    bocal_tnt: new ItemSpawnable(
        "Bocal à bombe",
        "Un bocal fragile qui contient une bombe.",
        10,
        ()=>new BocalItem(new TNTItem())
    ),
    bocal_goomba: new ItemSpawnable(
        "Bocal à Goomba",
        "Un bocal fragile qui contient un goomba.",
        10,
        ()=>new BocalItem(new GoombaItem())
    ),
    bocal_moblin: new ItemSpawnable(
        "Bocal à Moblin",
        "Un bocal fragile qui contient un moblin.",
        10,
        ()=>new BocalItem(new MoblinItem())
    ),
    bocal_serpent: new ItemSpawnable(
        "Bocal à Serpent Explosif",
        "Un bocal fragile qui contient un serpent explosif.",
        10,
        ()=>new BocalItem(new SnakeItem(new TNTItem(), Math.random()>.5?1:-1, 0, new WanderingControler(),1))
    ),
    

    /* SPAWNERS */
    gravel_spawner: new ItemSpawnable(
        "Générateur de Gravier",
        "Un générateur qui fait apparaitre du terrain qui chute au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(100,()=>new FallingPlatformItem())
    ),
    bubble_spawner: new ItemSpawnable(
        "Générateur de Bulles",
        "Un generateur qui fait apparaitre des bulles qui explose après un petit moement.",
        10,
        ()=>new SpawnerItem(100,()=>new BubbleItem())
    ),
    candy_spawner: new ItemSpawnable(
        "Générateur de Bonbons",
        "Un générateur qui fait apparaître des bonbons et des paires de bonbons au hasard. Les bonbons disparaissent quand associés par 4.",
        10,
        ()=>new SpawnerItem(100,WILD_CANDY_FACTORY)
    ),
    tetris_spawner: new ItemSpawnable(
        "Générateur de Tetris",
        "Un générateur qui fait apparaître des blocs de tetris. Les blocs disparaissent lorsqu'ils occupent une ligne entière.",
        10,
        ()=>new SpawnerItem(100,WILD_TETRIS_FACTORY)
    ),

    snake_spawner: new ItemSpawnable(
        "Générateur de Serpent",
        "Un générateur qui fait apparaitre des serpents au hasard sur le terrain.",
        10,
        v=> new SpawnerItem(200,()=>new SnakeItem(new PlatformItem(), ...vDIRECTIONS[v%4], new WanderingControler(),1))
    ),
    moblin_spawner: new ItemSpawnable(
        "Générateur de Moblin",
        "Un générateur qui fait apparaitre des moblins au hasard sur le terrain.",
        10,
        ()=> new SpawnerItem(100,()=>new MoblinItem())
    ),

    piston: new ItemSpawnable(
            `Piston`,
            `Un piston qui projette les objets dans une direction`,
            10,
            v=>new PistonItem(...vDIRECTIONS[v%4])
    ),

    pipe: new ItemSpawnable(
        `Tuyau`,
        `Un tuyau qui transporte les objets et les aspire à son entrée`,
        10,
        v=>new PipeItem(...vDIRECTIONS[v%4])
    ),

    shooting_pipe: new ItemSpawnable(
        `Tuyau Canon`,
        `Un tuyau qui transporte les objets, les aspire à son entrée et les projette à la sortie.`,
        10,
        v=>new ShootingPipeItem(...vDIRECTIONS[v%4])
    ),

    coin: new ItemSpawnable(
        `Pièce`,
        `Une pièce`,
        10,
        v=>new CoinItem(vTEAMS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    coin_falling: new ItemSpawnable(
        `Pièce Tombante`,
        `Une pièce qui tombe.`,
        10,
        v=>new MovingItem(new CoinItem(vTEAMS[v%4]), 0, 1),
        v=>vTEAMS_NAMES[v%4]
    ),
    tetris: new ItemSpawnable(
        "Bloc de Tetris",
        "Un bloc de tetris qui disparaissent lorsqu'ils occupent une ligne entière.",
        10,
        v=>new TetrisItem(vTEAMS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player: new ItemSpawnable(
        `Joueur`,
        `Un joueur.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], FALLING_FACTORY, ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_bubble: new ItemSpawnable(
        `Joueur Bulle`,
        `Un joueur qui une fois sur tois envoie une bulle qui disparait après un petit moment.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_BUBBLE_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_candy: new ItemSpawnable(
        `Joueur Bonbon`,
        `Un joueur qui lance un double et triple bonbons une fois sur deux. Les bonbon disparaissent quand associés par 4.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_CANDY_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_tetris: new ItemSpawnable(
        `Joueur Tetris`,
        `Un joueur qui lance des blocs de tetris  une fois sur deux. Les blocs disparaissent lorsqu'il sont alignés sur une ligne.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_TETRIS_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_bicolor: new ItemSpawnable(
        `Joueur Bicolore`,
        `Un joueur qui lance une double pièce bicolore une fois sur deux.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_BICOLOR_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_meteor: new ItemSpawnable(
        `Joueur Météore`,
        `Un joueur dont un jeton sur trois casse le truc en dessous.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_METEOR_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_slippy: new ItemSpawnable(
        `Joueur Glissant`,
        `Un joueur qui glisse.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], SLIPPY_FACTORY, ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
    player_snake: new ItemSpawnable(
        `Joueur Serpent`,
        `Un joueur qui lance des serpents une fois sur trois.`,
        10,
        v=>new PlayerItem(vTEAMS[v%4], NEW_SNAKE_FACTORY(), ...vKEYS[v%4]),
        v=>vTEAMS_NAMES[v%4]
    ),
}

/**
 * @type {Object<string,ItemModifier>}
 */
export const BASE_MODIFIERS={
    /* Bocal */
    bocal: new ItemModifier(
        "Bocal",
        "L'objet est dans un bocal, il est libéré lorsque le bocal est cassé.",
        10,
        item=>new BocalItem(item),
    ),

    /* Snake */
    snake: new ItemModifier(
        "Serpent Controllable",
        "Un serpent controllable avec les flèches de direction. Il peut manger les objects comestibles. Il laisse tomber l'objet à sa mort.",
        10,
        (it,v) => new SnakeItem(it, ...vDIRECTIONS[v%4], roundGet(ALL_CONTROLERS,Math.floor(v/4)).factory()),
        v => roundGet(ALL_CONTROLERS,Math.floor(v/4)).name
    ),

    /* Falling */
    falling: new ItemModifier(
        "Tombant",
        "L'objet tombent vers le bas.",
        10,
        (it,v) => new MovingItem(it, 0, 1),
    ),

    /* Goomba */
    goomba: new ItemModifier(
        "Goomba",
        "Un goomba qui se balade et tombe si il n'y a pas de sol. Il laisse tomber l'objet à sa mort.",
        10,
        item=>new GoombaItem(item),
    ),

    /* Moblin */
    moblin: new ItemModifier(
        "Moblin",
        "Un ennemi qui se déplace aléatoirement et change de direction lorsqu'il rencontre un obstacle en le frappant. Il laisse tomber l'objet à sa mort.",
        10,
        item=>new MoblinItem(item),
    ),
}

export const BASE_COLLECTION=new ItemCollection(BASE_SPAWNABLE, BASE_MODIFIERS)