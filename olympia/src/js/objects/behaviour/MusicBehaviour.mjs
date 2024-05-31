import { ObjectQuery, World } from "../world/World.mjs";
import { Behaviour } from "./Behaviour.mjs";
import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { TRANSFORM } from "../model/TransformModel.mjs";
import { ModelKey } from "../world/ModelHolder.mjs";
import { audioContext, loadSounds, play } from "../../ressources/SoundBank.mjs";


export class MusicBehaviour extends Behaviour{

    constructor(max_distance=20, max_volume=1){
        super()
        this.max_distance=max_distance
        this.max_volume=max_volume
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        for(const obj of objects){
            obj.apply(SOUND, sound=>{
                const volume=audioContext.createGain()
                volume.gain.value=0
                const pan=audioContext.createStereoPanner()
                volume.connect(pan)
                obj.set(SOUND_INFO,{node:play(sound, true, [volume,pan]),volume,pan})
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
                obj.apply2(TRANSFORM,SOUND_INFO, (objtf,sound)=>{
                    const offset=objtf.position.subtract(center)
                    const distance=offset.length()
                    offset.normalize()
                    console.log(distance)

                    // Volume
                    if(distance>this.max_distance*1.5){
                        sound.volume.gain.value=0
                    }
                    else{
                        sound.volume.gain.value=Math.max(0,1-distance/this.max_distance)*this.max_volume
                    }

                    // Pan
                    sound.pan.pan.value=-offset.x
                })
            }
        }
    }
    /** @override @type {Behaviour['init']} */
    finish(world,objects){
        for(const obj of objects){
            obj.apply(SOUND_INFO, sound=>{
                sound.node.stop()
                sound.node.disconnect()
            })
            obj.remove(SOUND_INFO)
        }
    }

    get order() { return 1 }


}


/** @type {ModelKey<AudioBuffer>} */
export const SOUND=new ModelKey("sound")

/** @type {ModelKey<Awaited<ReturnType<loadSounds>>>} */
export const SOUND_BANK=new ModelKey("sound_bank")

/** @type {ModelKey<{node:AudioBufferSourceNode, volume:GainNode, pan:StereoPannerNode}>} */
export const SOUND_INFO=new ModelKey("sound_info")