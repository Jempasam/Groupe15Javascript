import { Size, Vector2, Vector3 } from "../../../../../babylonjs/core/index.js";
import { MessageManager } from "../../messages/MessageManager.mjs";
import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";
import { PlayerBehaviour } from "../../objects/behaviour/controls/PlayerBehaviour.mjs";
import { PlayerDashBehaviour } from "../../objects/behaviour/controls/PlayerDashBehaviour.mjs";
import { PlayerJumpBehaviour } from "../../objects/behaviour/controls/PlayerJumpBehaviour.mjs";
import { ShootBehaviour } from "../../objects/behaviour/invocation/ShootBehaviour.mjs";
import { behaviourCollectable, behaviourInfiniteEquipper } from "../../objects/behaviour/generic/CollectableBehaviour.mjs";
import { EmitterBehaviour } from "../../objects/behaviour/particle/EmitterBehaviour.mjs";
import { EquipperBehaviour } from "../../objects/behaviour/slot/EquipperBehaviour.mjs";
import { BehaviourEntry, World } from "../../objects/world/World.mjs";
import { FightPack } from "./FightPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { Level, LevelContext } from "../../levels/Level.mjs";
import { HintBehaviour } from "../../objects/behaviour/interaction/HintBehaviour.mjs";
import { CameraLikeBehaviour } from "../../objects/behaviour/controls/CameraLikeBehaviour.mjs";
import { CameraBehaviour } from "../../objects/behaviour/CameraBehaviour.mjs";
import { InventoryBehaviour } from "../../objects/behaviour/InventoryBehaviour.mjs";
import { giveTag } from "../../objects/model/SlotModel.mjs";
import { ElementPack } from "./ElementPack.mjs";
import { behaviourEach } from "../../objects/behaviour/generic/EachBehaviour.mjs";
import { TRANSFORM, TransformModel } from "../../objects/model/TransformModel.mjs";
import { PATH, PathModel } from "../../objects/model/PathModel.mjs";
import { MOVEMENT, accelerate } from "../../objects/model/MovementModel.mjs";
import { PathNoFallBehaviour } from "../../objects/behaviour/controls/PathNoFallBehaviour.mjs"

/**
 * Un pack de behaviours de base de joueur et de ses pouvoirs
 */
export class PlayerPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {ElementPack} element
     */
    constructor(world,element){
        super(world)
        this._element=element
        this._fight=element._fight
        this._living=this._fight._living
        this._models=this._fight._models
        this._particle=this._living._particle
        this._physic=this._particle._physic
        this._effect=this._fight._effect
        this._registerNames()
    }

    player=this.empty()

    // Controls
    move=this.behav(new PlayerBehaviour(["KeyA","KeyW","KeyD","KeyS"],0.03,0.1))

    dash=this.behav(()=>new PlayerDashBehaviour("ShiftLeft", 0.4, 40, 1, this._particle.CLOUD()))

    jump=this.behav(()=>new PlayerJumpBehaviour("Space", 0.3, 1, this._particle.WIND()))

    attack=this.behav(()=>new ShootBehaviour("KeyE", 
        { tags:this._fight.SMALL_SLASH(), size:new Vector3(1,0.5,1) }, 
        { strength:.03, reloading_time: 40, shoot_count: 1, cadency: 20, knockback: 0.1 },
    ))

    shoot=this.behav(
        ()=>new ShootBehaviour("KeyE",
            { tags:this._fight.FIREBALL(), size: new Vector3(1,0.6,1) },
            { strength:0.2, reloading_time: 40, shoot_count: 1, cadency: 20, knockback: 0.3 },
        ),
        ()=>new EmitterBehaviour(this._particle.FIRE(), new Vector3(1.2,1.2,1.2), 10),
        ()=>this._models.flame.entries[0].behaviour
    )

    bomb=this.behav(
        ()=>new ShootBehaviour("KeyE", 
            { tags:this._fight.BOMB(), size: new Vector3(.8,.8,.8) },
            { strength:0.1, reloading_time: 40, shoot_count: 1, cadency: 20, knockback: 0.3 }
        )
    )
    
    pingpong=this.behav(()=>new ShootBehaviour("KeyE", 
        { tags:this._fight.PINGPONG(), size: new Vector3(1,1,1) },
        { strength:0.03, reloading_time: 40, shoot_count: 2, cadency: 20, knockback: 0.1 }
    ))


    // Equipper
    jump_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.jump.id],{slot:"jump"}),
        new HintBehaviour("Sautez avec la touche Espace!","unlock"),
    )
    dash_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.dash.id],{slot:"dash"}),
        new HintBehaviour("Dashez avec la touche Shift!","unlock"),
    )
    attack_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.attack.id],{slot:"attack"}),
        new HintBehaviour("Attaquez avec la touche E!","unlock"),
    )
    shoot_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.shoot.id],{slot:"attack"}),
        new HintBehaviour("Tirez avec la touche E!","unlock"),
    )
    bomb_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.bomb.id],{slot:"attack"}),
        new HintBehaviour("Lancez une bombe avec la touche E!","unlock"),
    )
    pingpong_equipper=this.behav( tags(()=>this.player.id),
        ()=>new EquipperBehaviour([this.pingpong.id],{slot:"attack"}),
        new HintBehaviour("Tapez avec la raquette avec la touche E!","unlock"),
    )

    // Packs
    LIVING_PLAYER= this.lazy(()=>[...this._living.LIVING(), this.player.id])

    CLASSIC_PLAYER= this.lazy(()=>[...this._physic.PHYSIC_FALLING(), ...this.LIVING_PLAYER(), this.move.id, this._living.respawn.id])

    JUMP_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.jump_equipper.id, this._particle.wind_emitter.id])
    DASH_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.dash_equipper.id, this._particle.cloud_emitter.id])
    ATTACK_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.attack_equipper.id, this._particle.slash_emitter.id])
    SHOOT_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.shoot_equipper.id, this._particle.fire_emitter.id])
    BOMB_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.bomb_equipper.id, this._models.bomb.id])
    PINGPONG_EQUIPPER= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.pingpong_equipper.id, this._models.pingpong.id])
    

    // Potion
    potion_slow_falling= this.behav( tags(()=>this.player.id), ()=>behaviourInfiniteEquipper(this._effect.SLOW_FALLING()) )
    potion_tornado= this.behav( tags(()=>this.player.id), ()=>behaviourInfiniteEquipper(this._effect.PROPULSED()) )
    potion_propulsed= this.behav( tags(()=>this.player.id), ()=>behaviourInfiniteEquipper(this._effect.INFINITE_JUMP()) )
    potion_smalling= this.behav( tags(()=>this.player.id), ()=>behaviourInfiniteEquipper(this._effect.SMALLER()) )
    potion_growing= this.behav( tags(()=>this.player.id), ()=>behaviourInfiniteEquipper(this._effect.BIGGER()) )

    POTION_SLOW_FALLING= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_slow_falling.id, this._models.potion.id, this._models.balloon.id])
    POTION_TORNADO= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_tornado.id, this._models.potion.id, this._models.wind.id])
    POTION_PROPULSED= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_propulsed.id, this._models.potion.id, this._particle.wind_emitter.id])
    POTION_SMALLING= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_smalling.id, this._models.potion.id, this._models.bonnet.id])
    POTION_GROWING= this.lazy(()=>[...this._physic.STATIC_GHOST(), this.potion_growing.id, this._models.potion.id, this._models.bonnet.id])
    
    // Hints
    hint_upgrade=this.behav( tags(()=>this.player.id),
        new HintBehaviour("Vous pouvez débloquer des améliorations grâce aux artefactes dorés!","hint")
    )

    hint_movable=this.behav( tags(()=>this.player.id),
        new HintBehaviour("Ces caisses peuvent être déplacées, peut être qu'elles peuvent vous être utile.","hint")
    )

    hint_damage=this.behav( tags(()=>this.player.id),
        new HintBehaviour("Attention aux dégats! Si vous fumez, il ne faut plus vous faire toucher.","hint")
    )

    // Camera
    camera_movement=this.behav( tags(()=>this.player.id), new CameraLikeBehaviour())
    camera=this.behav( tags(()=>this.player.id), new CameraBehaviour())

    /*inventory=this.behav(
        ()=>new InventoryBehaviour({
            "attack":{name:"Attaque", image:"🗡️", tags:[this.attack.id], slot:"attack"},
            "shoot":{name:"Tir", image:"🔫", tags:[this.shoot.id], slot:"attack"},
            "bomb":{name:"Bombe", image:"💣", tags:[this.bomb.id], slot:"attack"},
            "pingpong":{name:"Raquette", image:"🏓", tags:[this.pingpong.id], slot:"attack"},

            "potion_no":{name:"Rien", image:"🚫", tags:[], slot:"potion"},
            "potion_slow_falling":{name:"Chûte lente", image:"🎈", tags:this._effect.SLOW_FALLING(), slot:"potion"},
            "potion_tornado":{name:"Propulsion", image:"🌪️", tags:this._effect.PROPULSED(), slot:"potion"},
            "potion_propulsed":{name:"Sauts infinis", image:"🧦", tags:[...this._effect.INFINITE_JUMP(),this.jump.id], slot:"potion"},
            "potion_smalling":{name:"Petit", image:"🐭", tags:this._effect.SMALLER(), slot:"potion"},
            "potion_growing":{name:"Grand", image:"🐻‍❄️", tags:this._effect.BIGGER(), slot:"potion"},
            "potion_burning":{name:"Burning", image:"🔥", tags:this._effect.BURNING(), slot:"potion"},

            "element_fire":{name:"Feu", image:"🔥", tags:[this._element.element_flame.id], slot:"element"},
            "element_water":{name:"Eau", image:"💧", tags:[this._element.element_water.id], slot:"element"},
            "element_air":{name:"Air", image:"💨", tags:[this._element.element_air.id], slot:"element"},
        })
    )*/

    /**
     * 
     * @param {LevelContext} context 
     * @param {()=>Level} level_factory 
     */
    createLevelChange(context, level_factory){
        return this.behav(tags(()=>this.player.id), ()=>behaviourCollectable({},()=>(context.switchTo(level_factory()),true)))
    }
}