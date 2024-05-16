import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { PlayerBehaviour } from "../../objects/behaviour/controls/PlayerBehaviour.mjs";
import { PlayerDashBehaviour } from "../../objects/behaviour/controls/PlayerDashBehaviour.mjs";
import { PlayerJumpBehaviour } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { PlayerShootBehaviour } from "../../objects/behaviour/controls/PlayerShootBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour } from "../../objects/behaviour/slot/EquipperBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";



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
        this._models=fight._models
        this._particle=this._living._particle
        this._physic=this._particle._physic
    }

    player=this.empty()

    // Controls
    move=this.behav(new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1))

    dash=this.behav(()=>new PlayerDashBehaviour("ShiftLeft", 0.4, 40, 1, this._particle.CLOUD()))

    jump=this.behav(()=>new PlayerJumpBehaviour("Space", 0.3, 1, this._particle.WIND()))

    attack=this.behav(()=>new PlayerShootBehaviour("KeyE", this._fight.SMALL_SLASH(), {
        strength:.03, reloading_time: 40, size: new Vector3(1,0.5,1), shoot_count: 1, cadency: 20, knockback: 0.1
    }))

    shoot=this.behav(
        ()=>new PlayerShootBehaviour("KeyE", this._fight.FIREBALL(), {
            strength:0.2, reloading_time: 40, size: new Vector3(1.5,0.8,1.5), shoot_count: 1, cadency: 20, knockback: 0.3
        }),
        ()=>new EmitterBehaviour(this._particle.FIRE(), new Vector3(1.2,1.2,1.2), 10),
    )

    // Equipper
    jump_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.jump.id],{slot:"jump"}))
    dash_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.dash.id],{slot:"dash"}))
    attack_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.attack.id],{slot:"attack"}))
    shoot_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.shoot.id],{slot:"attack"}))

    // Packs
    LIVING_PLAYER= this.lazy(()=>[...this._living.LIVING(), this.player.id])

    JUMP_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.jump_equipper.id, this._particle.wind_emitter.id])
    DASH_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.dash_equipper.id, this._particle.cloud_emitter.id])
    ATTACK_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.attack_equipper.id, this._particle.slash_emitter.id])
    SHOOT_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.shoot_equipper.id, this._particle.fire_emitter.id])
}