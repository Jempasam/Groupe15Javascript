import { MeshBehaviour } from "../../objects/behaviour/MeshBehaviour.mjs";
import { ElectronicBehaviour, ON_POWERED } from "../../objects/behaviour/electronics/ElectronicBehaviours.mjs";
import { behaviourObserve } from "../../objects/behaviour/generic/ObserveBehaviour.mjs";
import { ON_HITTED } from "../../objects/behaviour/life/ProjectileBehaviour.mjs";
import { PathShadowBehaviour } from "../../objects/behaviour/path/PathShadowBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { ModelPack } from "./ModelPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";
import { PhysicPack } from "./PhysicPack.mjs";


/**
 * Un pack de behaviours de modèles de base
 */
export class ElectronicPack extends ObjectPack{

    /**
     * 
     * @param {World} world
     * @param {ModelPack} model 
     * @param {PhysicPack} physic
     */
    constructor(world,model,physic){
        super(world)
        this._model=model
        this._physic=physic
        this._registerNames()
    }

    powerable=this.empty()

    general_electronic=this.behav(tags(()=>this.powerable.id), ()=>new ElectronicBehaviour(
        [this._model.led_off.id],
        [this._model.led_on.id], 20,
        [this._model.led_dead.id], 20,
        4
    ))

    repeater=this.behav(tags(()=>this.powerable.id), ()=>new ElectronicBehaviour(
        [this._model.button_off.id],
        [this._model.button_on.id], 20,
        [this._model.button_dead.id], 20,
        4
    ))

    REPEATER=this.lazy(()=>[...this._physic.STATIC(), this.powerable.id, this.repeater.id])

}