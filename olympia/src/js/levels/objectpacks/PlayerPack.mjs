import { PlayerBehaviour } from "../../objects/behaviour/controls/PlayerBehaviour.mjs";
import { PlayerDashBehaviour } from "../../objects/behaviour/controls/PlayerDashBehaviour.mjs";
import { PlayerJumpBehaviour } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { ObjectPack } from "./ObjectPack.mjs";



/**
 * Un pack de behaviours de base de joueur et de ses pouvoirs
 */
export class PlayerPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {FightPack} fight
     */
    constructor(world,fight){
        super(world)
        this._fight=fight
        this._living=fight._living
        this._particle=this._living._particle
    }

    player=this.empty()

    move=this.behav(new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1))
    move2=this.behav(new PlayerBehaviour(["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"],0.03,0.1))

    dash=this.behav(()=>new PlayerDashBehaviour("ShiftLeft", 0.4, 40, 1, this._particle.CLOUD()))
    dash2=this.behav(()=>new PlayerDashBehaviour("ShiftRight", 0.4, 40, 1, this._particle.CLOUD()))

    jump=this.behav(()=>new PlayerJumpBehaviour("Space", 0.3, 1, this._particle.WIND()))
    jump2=this.behav(()=>new PlayerJumpBehaviour("ControlRight", 0.3, 1, this._particle.WIND()))

    LIVING_PLAYER= this.lazy(()=>[...this._fight.LIVING_FRIENDLY(), this.player.id])

}