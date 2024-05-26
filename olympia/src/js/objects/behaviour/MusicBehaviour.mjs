import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { TRANSFORM } from "../model/TransformModel.mjs";
import { ModelKey } from "../world/ModelHolder.mjs";


export class MusicBehaviour extends Behaviour{

    constructor(max_distance=20){
        super()
        this.max_distance=max_distance
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.apply(SOUND, sound=>{
                sound.loop=true
                sound.play()
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} players
     */
    tick(world, objects, players){
        if(players){
            // Get center of players
            let center=Vector3.Zero()
            let count=0;
            for(const player of players){
                player.apply(TRANSFORM, tf=>{
                    center.addInPlace(tf.position)
                    count++
                })
            }
            center.scale(1/count)

            for(const obj of objects){
                obj.apply2(TRANSFORM,SOUND, (objtf,sound)=>{
                    const distance=objtf.position.subtract(center).length()
                    if(distance>this.max_distance)sound.volume=0
                    else sound.volume=1-distance/this.max_distance
                })
            }
        }
    }
    /** @override @type {Behaviour['init']} */
    finish(world,objects){
        for(const obj of objects){
            obj.apply(SOUND, sound=>{
                sound.pause()
            })
        }
    }

    get order() { return 1 }


}

/** @type {ModelKey<HTMLAudioElement>} */
export const SOUND=new ModelKey("sound")