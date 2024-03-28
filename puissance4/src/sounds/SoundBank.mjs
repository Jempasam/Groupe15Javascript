
function createSound(url, volume=0.1){
    const ret=new Audio(import.meta.resolve("./../../sounds/"+url))
    ret.volume=Math.min(1,volume)
    ret.play()
    return ret
}

export class Sounds{
    static CROCK= createSound("crock.wav")
    static ITCHIK= createSound("itchik.wav",0.03)
    static POP= createSound("pop.wav")
    static TCHI= createSound("tchi.wav")
    static TOP= createSound("top.wav",0.3)
    static POURH= createSound("pourh.wav")
    static VENT= createSound("vent.wav",0.05)
    static SWORD= createSound("sword.wav",0.05)
    static DRAGON= createSound("dragon.wav",0.05)
    static GUITARE= createSound("guitare.ogg",0.05)
    static GUITARE2= createSound("guitare_grave.ogg",0.15)
    static BOMB= createSound("bomb.wav",0.05)
    static CROUNCH= createSound("crounch.wav",0.05)
    static CLICK= createSound("click.mp3",0.05)
}