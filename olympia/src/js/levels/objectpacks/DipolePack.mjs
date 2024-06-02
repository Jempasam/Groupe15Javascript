import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";
import { ElectronicBehaviour, ON_POWERED } from "../../objects/behaviour/electronics/ElectronicBehaviours.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_HITTED } from "../../objects/behaviour/life/ProjectileBehaviour.mjs";
import { PathShadowBehaviour } from "../../objects/behaviour/path/PathShadowBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ElectronicPack } from "./ElectronicPack.mjs";
import { FightPack } from "./FightPack.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PhysicPack } from "./PhysicPack.mjs";
import { SoilPack } from "./SoilPack.mjs";


/**
 * Un pack de behaviours de modèles de base
 */
export class DipolePack extends ObjectPack{

    /**
     * 
     * @param {World} world
     * @param {FightPack} fight 
     * @param {SoilPack} soil
     * @param {ElectronicPack} electronic
     */
    constructor(world,fight,soil,electronic){
        super(world)
        this._elec=electronic
        this._fight=fight
        this._soil=soil
        this._living=soil._living
        this._physic=soil._physic
        this._models=soil._particle._models
        this._registerNames()
    }

    // Doors
    openable_door=this.behav(tags(()=>this._elec.powerable.id),()=>new ElectronicBehaviour(
        [this._models.led_off.id],
        [this._soil.elevator4.id, this._models.led_on.id], 80,
        [this._soil.delevator4.id, this._models.led_dead.id], 80,
        4
    ))

    // Button
    button=this.behav(()=>behaviourObserve(ON_HITTED,(obj,{hitted,hitter})=>{
        hitted.observers(ON_POWERED).notify({powered:hitted,powerer:hitter})
    }))

    OPENABLE_DOOR=this.lazy(()=>[...this._physic.MOVING_FRICTION(), this.openable_door.id, this._elec.powerable.id])
    BUTTON=this.lazy(()=>[...this._physic.STATIC(), this._living.hitable.id, this.button.id, this._elec.repeater.id])
    REPEATER=this.lazy(()=>this._elec.REPEATER())


}