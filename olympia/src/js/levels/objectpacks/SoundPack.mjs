import { MusicBehaviour } from "../../objects/behaviour/MusicBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PlayerPack } from "./PlayerPack.mjs";


/**
 * Un pack de behaviours de base pour la gestion des sons et de la musique
 */
export class SoundPack extends ObjectPack {

    /**
     * @param {World} world
     * @param {PlayerPack} player
     */
    constructor(world, player) {
        super(world)
        this._player = player
        this._registerNames()
    }

    // Movements
    music = this.behav(tags(() => this._player.player.id), new MusicBehaviour())
}