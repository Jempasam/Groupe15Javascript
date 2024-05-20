import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { MessageManager } from "../../messages/MessageManager.mjs";
import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";
import { PlayerBehaviour } from "../../objects/behaviour/controls/PlayerBehaviour.mjs";
import { PlayerDashBehaviour } from "../../objects/behaviour/controls/PlayerDashBehaviour.mjs";
import { PlayerJumpBehaviour } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { PlayerShootBehaviour } from "../../objects/behaviour/controls/PlayerShootBehaviour.mjs";
import { behaviourCollectable } from "../../objects/behaviour/generic/CollectableBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour } from "../../objects/behaviour/slot/EquipperBehaviour.mjs";
import { BehaviourEntry, World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { Level, LevelContext } from "../../levels/Level.mjs";



/**
 * Un pack de behaviours de base de joueur et de ses pouvoirs
 */
export class PlayerPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {FightPack} fight
     * @param {MessageManager=} messages
     */
    constructor(world,fight,messages){
        super(world)
        this._fight=fight
        this._living=fight._living
        this._models=fight._models
        this._particle=this._living._particle
        this._physic=this._particle._physic
        this._messages=messages
        this._effect=fight._effect
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
            strength:0.2, reloading_time: 40, size: new Vector3(1,0.6,1), shoot_count: 1, cadency: 20, knockback: 0.3
        }),
        ()=>new EmitterBehaviour(this._particle.FIRE(), new Vector3(1.2,1.2,1.2), 10),
        ()=>this._models.flame.entries[0].behaviour
    )

    bomb=this.behav(
        ()=>new PlayerShootBehaviour("KeyE", this._fight.BOMB(), {
            strength:0.1, reloading_time: 40, size: new Vector3(.8,.8,.8), shoot_count: 1, cadency: 20, knockback: 0.3
        })
    )
    
    pingpong=this.behav(()=>new PlayerShootBehaviour("KeyE", this._fight.PINGPONG(), {
        strength:0.03, reloading_time: 40, size: new Vector3(1,1,1), shoot_count: 2, cadency: 20, knockback: 0.1
    }))


    // Equipper
    jump_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.jump.id],{slot:"jump"}))
    dash_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.dash.id],{slot:"dash"}))
    attack_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.attack.id],{slot:"attack"}))
    shoot_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.shoot.id],{slot:"attack"}))
    bomb_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.bomb.id],{slot:"attack"}))
    pingpong_equipper=this.behav(tags(()=>this.player.id), ()=>new EquipperBehaviour([this.pingpong.id],{slot:"attack"}))

    // Packs
    LIVING_PLAYER= this.lazy(()=>[...this._living.LIVING(), this.player.id])

    CLASSIC_PLAYER= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this.LIVING_PLAYER(), this.move.id, this._living.respawn.id])

    #opt_hint(msg){
        if(this._messages) return [
            this.behav(tags(()=>this.player.id),()=>behaviourCollectable({},(_,collecter)=>{
                this._messages?.send(msg,6000,"unlock")
                return true
            })).id
        ]
        else return []
    }

    JUMP_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.jump_equipper.id, this._particle.wind_emitter.id, ...this.#opt_hint("Sautez avec la touche Espace!")])
    DASH_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.dash_equipper.id, this._particle.cloud_emitter.id, ...this.#opt_hint("Dashez avec la touche Shift!")])
    ATTACK_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.attack_equipper.id, this._particle.slash_emitter.id, ...this.#opt_hint("Attaquez avec la touche E!")])
    SHOOT_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.shoot_equipper.id, this._particle.fire_emitter.id, ...this.#opt_hint("Tirez avec la touche E!")])
    BOMB_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.bomb_equipper.id, this._models.bomb.id, ...this.#opt_hint("Lancez une bombe avec la touche E!")])
    PINGPONG_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.pingpong_equipper.id, this._models.pingpong.id, ...this.#opt_hint("Tapez avec la raquette avec la touche E!")])
    

    // Potion
    potion_slow_falling=this.behav( tags(()=>this.player.id), behaviourCollectable({use_count:Number.MAX_SAFE_INTEGER}, (_,o) => (o.addTag(this._effect.slow_falling.id),true) ))
    potion_tornado=this.behav( tags(()=>this.player.id), behaviourCollectable({use_count:Number.MAX_SAFE_INTEGER}, (_,o) => (o.addTag(this._effect.in_tornado.id),true) ))
    potion_propulsed=this.behav( tags(()=>this.player.id), behaviourCollectable({use_count:Number.MAX_SAFE_INTEGER}, (_,o) => (o.addTag(this._effect.propulsed.id),true) ))

    POTION_SLOW_FALLING= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_slow_falling.id, this._models.potion.id, this._models.balloon.id])
    POTION_TORNADO= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_tornado.id, this._models.potion.id, this._models.wind.id])
    POTION_PROPULSED= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_propulsed.id, this._models.potion.id, this._particle.wind_emitter.id])
    
    // Functions
    /**
     * Crée un behaviour d'indice
     * @param {MessageManager} message 
     * @param {string} text
     */
    createHint(message,text){
        return this.behav(tags(()=>this.player.id),()=>behaviourCollectable({},(_,collecter)=>{
            message.send(text,6000,"hint")
            return true
        }))
    }

    /**
     * 
     * @param {LevelContext} context 
     * @param {()=>Level} level_factory 
     */
    createLevelChange(context, level_factory){
        return this.behav(tags(()=>this.player.id), ()=>behaviourCollectable({},()=>(context.switchTo(level_factory()),true)))
    }
}