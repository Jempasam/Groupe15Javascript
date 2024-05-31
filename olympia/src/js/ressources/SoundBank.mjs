
export const audioContext=new AudioContext()


async function createSound(url, volume=0.1){
    /*const ret=new Audio(import.meta.resolve("./../../../sounds/"+url))
    ret.volume=Math.min(1,volume)
    ret.play()
    ret.pause()
    return ret*/

    const response = await fetch(import.meta.resolve("./../../../sounds/"+url));
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}


/**
 * @returns 
 */
export async function loadSounds(){

    return {
        // Sound Effects
        CROCK: await createSound("crock.wav"),
        ITCHIK: await createSound("itchik.wav",0.03),
        POP: await createSound("pop.wav"),
        TCHI: await createSound("tchi.wav"),
        TOP: await createSound("top.wav",0.3),
        POURH: await createSound("pourh.wav"),
        VENT: await createSound("vent.wav",0.05),
        SWORD: await createSound("sword.wav",0.05),
        DRAGON: await createSound("dragon.wav",0.05),
        GUITARE: await createSound("guitare.ogg",0.05),
        GUITARE2: await createSound("guitare_grave.ogg",0.15),
        BOMB: await createSound("bomb.wav",0.05),
        CROUNCH: await createSound("crounch.wav",0.05),
        CLICK: await createSound("click.mp3",0.05),
        CITY: await createSound("city.mp3",0.05),
        FROT: await createSound("frot.mp3",0.05),
        LAVA: await createSound("lava.mp3",0.05),
        WALK: await createSound("walk.mp3",0.05),
        LIQUIDE: await createSound("liquide.wav",0.05),

        // Music
        ASH_PLANKS: await createSound("music/ash-planks.mp3"),
        LIMBO: await createSound("music/limbo.mp3"),
    }
}

/**
 * Play a sound
 * @param {AudioBuffer} buffer
 * @param {boolean=} loop
 * @param {[AudioNode,AudioNode]=} decorator
 * @return {AudioBufferSourceNode}
 */
export function play(buffer, loop=false, decorator=undefined){
    const source= audioContext.createBufferSource();
    source.buffer=buffer

    if(decorator){
        source.connect(decorator[0])
        decorator[1].connect(audioContext.destination)
    }
    else source.connect(audioContext.destination)

    if(loop)source.loop=true
    source.start()
    if(!loop)source.onended=()=>source.disconnect()
    return source
}