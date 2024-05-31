import { MusicBehaviour, SOUND, SOUND_BANK } from "../objects/behaviour/MusicBehaviour.mjs"
import { ON_JUMP } from "../objects/behaviour/controls/PlayerJumpBehaviour.mjs"
import { ON_COLLECT } from "../objects/behaviour/generic/CollectableBehaviour.mjs"
import { ON_SHOOT } from "../objects/behaviour/invocation/ShootBehaviour.mjs"
import { ON_INVOCATION } from "../objects/behaviour/invocation/invocations.mjs"
import { ON_DEATH, ON_LIVE_CHANGE } from "../objects/behaviour/life/LivingBehaviour.mjs"
import { giveTag } from "../objects/model/SlotModel.mjs"
import { World } from "../objects/world/World.mjs"
import { loadSounds, play } from "../ressources/SoundBank.mjs"
import { Level } from "./Level.mjs"
import { ON_EXPLODE, ON_SUMMON_DROPLET } from "./objectpacks/FightPack.mjs"

export class BaseLevel extends Level{


    /**
     * @param {World} world
     * @param {import("./objectpacks/BasicPack.mjs").BasicPack} pack
     */
    init(world,pack){
        const sounds=world.model.get(SOUND_BANK); if(!sounds)return

        // Sound observers
        world.observers(ON_LIVE_CHANGE).addAuto((w,offset)=>{
            if(offset<0)play(sounds.TCHI)
            if(offset>0)play(sounds.GUITARE)
        })

        world.observers(ON_DEATH).addAuto((w,dead)=>{
            if(dead.tags.includes(pack.player.player.id))play(sounds.GUITARE2)
            if(dead.tags.includes(pack.living.damage_junk.id))play(sounds.CROCK)
            if(dead.tags.includes(pack.living.damage_cloud.id))play(sounds.POURH)
        })

        world.observers(ON_JUMP).addAuto((w,jump)=>play(sounds.TOP))

        world.observers(ON_SHOOT).addAuto((w,{shooter})=>{
            if(shooter.tags.includes(pack.player.player.id)) play(sounds.SWORD)
        })

        world.observers(ON_COLLECT).addAuto((w,collectable)=>play(sounds.POP))

        world.observers(ON_EXPLODE).addAuto((w,collectable)=>play(sounds.BOMB))

        world.observers(ON_INVOCATION).addAuto((w)=>play(sounds.POP))

        // Music Behaviours
        /**
         * 
         * @param {string} name 
         * @param {import("../objects/world/TaggedDict.mjs").Tag} tag 
         * @param {AudioBuffer} sound 
         */
        function setSound(name, tag, sound){
            // @ts-ignore
            pack.objects[name].tags.push(tag)
            const modelbefore=pack.objects[name].models ?? (()=>[])
            // @ts-ignore
            pack.objects[name].models= ()=> [...modelbefore(),[SOUND,sound]]
        }
        
        setSound('#x', pack.sound.music_near.id, sounds.LAVA)

        for(const key in pack.objects){
            if([">","<","^","v"].includes(key[0]))setSound(key, pack.sound.music_near.id, sounds.FROT)
        }

        setSound("'a", pack.sound.music_ultra_far.id, sounds.CITY)

        setSound("+g", pack.sound.music.id, sounds.LIQUIDE)

        setSound("%b", pack.sound.music.id, sounds.HARD_KEYBOARD_SURFER)

        // Music on Spawn
        world.observers(ON_INVOCATION).addAuto((w,{invocation})=>{
            // Firebird
            if(invocation.tags.includes(pack.monster.firebird_phases.id)){
                invocation.set(SOUND,sounds.LIMBO)
                giveTag(invocation,pack.sound.music_far.id)
            }
            // Sphinx
            // Firebird
            if(invocation.tags.includes(pack.monster.sphinx_phases.id)){
                invocation.set(SOUND,sounds.ASH_PLANKS)
                giveTag(invocation,pack.sound.music_far.id)
            }
        })
    }

}