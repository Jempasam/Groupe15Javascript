import { Vector3 } from "../../../../../../babylonjs/core/index.js";
import { LIVING } from "../../model/LivingModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { generateParticle } from "../particle/SimpleParticleBehaviour.mjs";


export class ParticleLivingBehaviour extends Behaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} tags 
     * @param {Vector3} size 
     */
    constructor(tags,size){
        super()
        this.tags=tags
        this.size=size
    }
    
    init(){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world,objects){
        for(const obj of objects){
            obj.apply2(LIVING, TRANSFORM, (living,transform)=>{
                if(living.life==1){
                    if(world.age%10==0)generateParticle(world,transform,this.tags,this.size.clone())
                }
            })
        }
    }

    finish(){ }
}