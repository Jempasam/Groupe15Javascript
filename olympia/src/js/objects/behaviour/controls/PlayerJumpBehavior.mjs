import { MOVEMENT, MovementModel, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { Vector3 } from "../../../../../../babylonjs/index.js";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { isKeyPressed} from "../../../controls/Keyboard.mjs"
import { ObserverGroup } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";
import { ModelKey } from "../../world/GameObject.mjs";

export class PlayerJumpBehaviour extends Behaviour{

    /**
     * 
     * @param {string} key 
     * @param {number} strength 
     * @param {number} jump_count 
     */
    constructor(key, strength, jump_count){
        super()
        this.key=key
        this.strength=strength
        this.jump_count=jump_count
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects){
        this.eventid=ObserverGroup.generateName()
        for(const obj of objects){
            obj.getOrSet(JUMP,()=>new JumpModel())
            obj.observers(ON_COLLISION).add(this.eventid, (self,{hitbox,object,self_hitbox})=>{
                if(self_hitbox.position.y-self_hitbox.scaling.y/3 > hitbox.position.y+hitbox.scaling.y/2){
                    obj.apply(JUMP, jump=>jump.remaining_jump=this.jump_count)
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(const obj of objects){
            const jump=obj.get(JUMP); if(!jump)continue
            if(jump.cooldown<=0){
                if(isKeyPressed(this.key) && jump.remaining_jump>0){
                    console.log("jump")
                    obj.apply(MOVEMENT, move=>{
                        move.inertia.y+=this.strength
                    })
                    jump.cooldown=14
                    jump.remaining_jump--
                }
            }
            else jump.cooldown--
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world,objects){
        for(const obj of objects){
            if(this.eventid) obj.observers(ON_COLLISION).remove(this.eventid)
            obj.remove(JUMP)
        }
    }
}

export class JumpModel{
    cooldown=0
    remaining_jump=0
}

/** @type {ModelKey<JumpModel>} */
export const JUMP=new ModelKey("jump")