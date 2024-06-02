import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs";
import { giveTag, removeTag } from "../../model/SlotModel.mjs";
import { TRANSFORM } from "../../model/TransformModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ElectronicBehaviour extends Behaviour{

    /**
     * @param {import("../../world/TaggedDict.mjs").Tag[]} off
     * @param {import("../../world/TaggedDict.mjs").Tag[]} on
     * @param {number} on_time
     * @param {import("../../world/TaggedDict.mjs").Tag[]} dead
     * @param {number} dead_time
     * @param {number=} range
     */
    constructor(off,on,on_time,dead,dead_time,range=5){
        super()
        this.off=off
        this.on=on
        this.on_time=on_time
        this.dead=dead
        this.dead_time=dead_time
        this.range=range
    }

    /** @override @type {Behaviour['init']} */
    init(world, objects, ignitables){
        console.log("init", this.uid, objects.collect().map(it=>it.id), ignitables.collect().map(it=>it.id))
        for(let obj of objects){
            obj.getOrSet([ELECTRONIC,this.uid],()=>new ElectronicModel())
            giveTag(obj, ...this.off)
            obj.observers(ON_POWERED).add(this.uid,(_,{powered: ignited,powerer: igniter})=>{
                ignited.apply([ELECTRONIC,this.uid], electronic=>{
                    // if the object is not already ignited, ignit it and other objects in range
                    if(electronic.ignition_time==0){
                        electronic.ignition_time=this.on_time
                        removeTag(ignited, ...this.off)
                        giveTag(ignited, ...this.on)
                    }
                })
            })
        }
    }

    /** @override @type {Behaviour['tick']} */
    tick(world, objects, ignitables){
        for(let obj of objects){
            obj.apply([ELECTRONIC,this.uid], electronic=>{
                if(electronic.ignition_time>0){
                    electronic.ignition_time-=1
                    if(electronic.ignition_time==Math.floor(this.on_time*0.75)){

                        // Ignite other objects in range
                        obj.apply(TRANSFORM, electronic_tf=>{
                            for(const o of ignitables){
                                if(o===obj)continue
                                o.apply(TRANSFORM, transform=>{
                                    const distance=electronic_tf.position.subtract(transform.position).length()
                                    if(distance<this.range){
                                        o.observers(ON_POWERED).notify({powered: o, powerer: obj})
                                    }
                                })
                            }
                        })

                    }
                    if(electronic.ignition_time==0){
                        removeTag(obj, ...this.on)
                        giveTag(obj, ...this.dead)
                        electronic.ignition_time=-this.dead_time
                    }
                }
                else if(electronic.ignition_time<0){
                    electronic.ignition_time+=1
                    if(electronic.ignition_time==0){
                        removeTag(obj, ...this.dead)
                        giveTag(obj, ...this.off)
                    }
                }
            })
        }
    }

    /** @override @type {Behaviour['finish']} */
    finish(world, objects){
        for(let obj of objects){
            obj.apply([ELECTRONIC,this.uid], electronic=>{
                if(electronic.ignition_time<0)removeTag(obj, ...this.dead)
                else if(electronic.ignition_time>0)removeTag(obj, ...this.on)
                else removeTag(obj, ...this.off)
            })
            obj.remove([ELECTRONIC,this.uid])
            obj.observers(ON_POWERED).remove(this.uid)
        }
    }
}

export class ElectronicModel{
    ignition_time=0
}

/** @type {ModelKey<ElectronicModel>} */
export const ELECTRONIC=new ModelKey("electronic")


/** @type {ObserverKey<{powered:GameObject, powerer:GameObject}>} */
export const ON_POWERED=new ObserverKey("on_powered")