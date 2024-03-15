import { BubbleItem } from "../../items/BubbleItem.mjs"
import { CandyItem } from "../../items/CandyItem.mjs"
import { CoinItem } from "../../items/CoinItem.mjs"
import { MeteorItem } from "../../items/MeteorItem.mjs"
import { MovingItem } from "../../items/MovingItem.mjs"
import { PairItem } from "../../items/PairItem.mjs"
import { SlippyItem } from "../../items/SlippyItem.mjs"
import { SnakeItem } from "../../items/SnakeItem.mjs"

/**
 * Une usine à pièces glissantes
 */
export const SLIPPY_FACTORY= (team)=>new SlippyItem(new CoinItem(team), 0, 1)

/**
 * Une usine à pièces qui tombent
 */
export const FALLING_FACTORY= (team)=>new MovingItem(new CoinItem(team), 0, 1)

/**
 * Un constructeur d'usines à pièce qui tombent, dont 1 pièce sur 3 est une météorite.
 */
export function NEW_METEOR_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%3==1)return new MeteorItem(new CoinItem(team), 0, 1)
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

/**
 * Un constructeur d'usines à pièce qui tombent, mais 1 fois sur trois elle crée une bulle tombante
 */
export function NEW_BUBBLE_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%3==1)return new MovingItem(new BubbleItem(), 0, 1)
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

/**
 * Un constructeur d'usines à pièce qui tombent, dont 1 pièce sur 3 est un serpent-pièce.
 */
export function NEW_SNAKE_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%3==1)return new SnakeItem(new CoinItem(team), 0, 1)
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

/**
 * Un constructeur d'usines à pièce qui tombent, dont 1 pièce sur 2 est un double bonbon candy crush.
 */
export function NEW_CANDY_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%2==1){
            let [dx,dy]=randomDirection()
            return new MovingItem(new PairItem(CandyItem.random(),CandyItem.random(),dx,dy), 0, 1)
        }
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

/**
 * Un constructeur d'usines à pièce qui tombent, dont 1 pièce sur 2 est une double pièce bicolore
 */
export function NEW_BICOLOR_FACTORY(){
    let data={i:0}
    return function(team){
        let i = data.i = data.i + 1
        if(i%2==1){
            let adverse
            switch(team){
                case "red": adverse="blue"; break
                case "blue": adverse="red"; break
                case "green": adverse="yellow"; break
                case "yellow": adverse="green"; break
                default: adverse="red"
            }
            let [dx,dy]=randomDirection()
            return new MovingItem(new PairItem(new CoinItem(team),new CoinItem(adverse),dx,dy), 0, 1)
        }
        else return new MovingItem(new CoinItem(team), 0, 1)
    }
}

export const WILD_CANDY_FACTORY=createRandomFactory(CandyItem.random)


// Helpers
function randomDirection(){
    if(Math.random()>0.5){
        if(Math.random()>0.5) return [0,1]
        else return [0,-1]
    }
    else{
        if(Math.random()>0.5) return [1,0]
        else return [-1,0]
    }
}

function createRandomFactory(seeded_factory){
    return function(team){
        if(Math.random()>0.5){
            let [dx,dy]=randomDirection()
            return new MovingItem(new PairItem(seeded_factory(Math.random()*10000),seeded_factory(Math.random()*10000),dx,dy), 0, 1)
        }
        else return new MovingItem(seeded_factory(Math.random()*10000), 0, 1)
    }
}