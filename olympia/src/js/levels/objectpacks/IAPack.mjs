import { Vector3 } from "../../../../../babylonjs/core/index.js";
import { FOLLOW, FOLLOW_RELATIVE, STAY, TargetChainBehaviour } from "../../objects/behaviour/controls/TargetChainBehaviour.mjs";
import { World } from "../../objects/world/World.mjs";
import { LivingPack } from "./LivingPack.mjs";
import { ObjectPack, tags } from "./ObjectPack.mjs";



/**
 * Un pack de behaviours de base de mouvement de monstres
 */
export class IAPack extends ObjectPack{

    /**
     * @param {World} world
     * @param {LivingPack} living
     */
    constructor(world,living){
        super(world)
        this._living=living
    }

    follow_slow=this.behav(tags(()=>this._living.living.id),new TargetChainBehaviour(10,[
        [FOLLOW(), 0.01, 0.04, 5]
    ]))

    follow_fast=this.behav(tags(()=>this._living.living.id),new TargetChainBehaviour(20,[
        [FOLLOW(), 0.01, 0.15, 5]
    ]))

    rotate_around=this.behav(tags(()=>this._living.living.id),new TargetChainBehaviour(15,[
        [FOLLOW_RELATIVE(new Vector3(1,0,-4)), 0.01, 0.06, 5]
    ]))

    rotate_and_jump=this.behav(tags(()=>this._living.living.id),new TargetChainBehaviour(15,[
        [FOLLOW_RELATIVE(new Vector3(2,0,-4)), 0.01, 0.1, 20,  9],
        {random:[[STAY,0,0,22],[STAY,0,0,45],[STAY,0,0,61]]},
        [FOLLOW_RELATIVE(new Vector3(-2,0,4)), 0.02, 0.3, 60],

        [FOLLOW_RELATIVE(new Vector3(-2,0,-4)), 0.01, 0.1, 20,  9],
        {random:[[STAY,0,0,22],[STAY,0,0,45],[STAY,0,0,61]]},
        [FOLLOW_RELATIVE(new Vector3(-2,0,4)), 0.02, 0.3, 60],
    ]))

    fly_and_attack=this.behav(tags(()=>this._living.living.id),new TargetChainBehaviour(20,[
        {random:[ [FOLLOW_RELATIVE(new Vector3(2,5,-3)), 0.01, 0.1, 20,  18], [FOLLOW_RELATIVE(new Vector3(-2,5,-3)), 0.01, 0.1, 20,  18] ]},
        {random:[ [FOLLOW_RELATIVE(new Vector3(2,3,-2)), 0.01, 0.1, 20,  1], [FOLLOW_RELATIVE(new Vector3(-2,3,-2)), 0.01, 0.1, 20,  2] ]},
        {random:[ [FOLLOW_RELATIVE(new Vector3(2,3,-2)), 0.01, 0.1, 20,  2], [FOLLOW_RELATIVE(new Vector3(-2,3,-2)), 0.01, 0.1, 20,  3] ]},
        {random:[ [FOLLOW_RELATIVE(new Vector3(2,3,-2)), 0.01, 0.1, 20,  1], [FOLLOW_RELATIVE(new Vector3(-2,3,-2)), 0.01, 0.1, 20,  2] ]},
        [FOLLOW(), 0.02, 0.3, 100],
    ]))

}