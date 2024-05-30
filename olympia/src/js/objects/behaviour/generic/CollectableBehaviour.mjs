import { ObserverKey } from "../../../../../../samlib/observers/ObserverGroup.mjs"
import { giveEquip } from "../../model/SlotModel.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { GameObject } from "../../world/GameObject.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { Behaviour } from "../Behaviour.mjs"
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs"


export class CollectableBehaviour extends Behaviour{

    /**
     * @param {object} options
     * @param {number=} options.reload_time Le temps entre deux collections.
     * @param {number=} options.use_count Le nombre de fois que l'objet peut être collecté.
     */
    constructor({reload_time=20, use_count=1}={}){
        super()
        this.reload_time=reload_time
        this.use_count=use_count
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     * @param {ObjectQuery} targets
     */
    init(world, objects, targets, ...rest){
        for(const obj of objects){
            obj.getOrSet([COLLECTABLE,this.uid],()=>({equippedTime:0,reloading:0,remaining_use:this.use_count}))
            obj.observers(ON_COLLISION).add(this.uid,(_,{object})=>{
                obj.apply([COLLECTABLE,this.uid], it=>{
                    if(it.equippedTime!=0 || it.reloading!=0 || (targets && !targets.match(object)))return
                    if(this.on_collection(obj,object,it,world,objects.all(),targets.all(),...rest.map(a=>a.all()))){
                        it.equippedTime=it.remaining_use!=1 ? 10 : 20
                        obj.observers(ON_COLLECT).notify({collecter:object, equipper:this})
                        object.observers(ON_COLLECTED).notify({collectable:obj, equipper:this})
                    }
                })
            })
        }
    }

    /**
     * 
     * @param {GameObject} collectable
     * @param {GameObject} collecter
     * @param {CollectableData} data
     * @param {World} world
     * @param {...ObjectQuery} queries
     * @returns {boolean}
     */
    on_collection(collectable, collecter, data, world, ...queries){
        throw new Error("Undefined on_collection method")
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        for(let obj of objects){
            obj.apply([COLLECTABLE,this.uid], it=>{
                if(it.equippedTime==1){
                    obj.kill()
                }
                if(it.equippedTime>0){
                    it.equippedTime--
                    obj.apply(TRANSFORM, it=>it.scale.scaleInPlace(0.9))
                }

                if(it.equippedTime==1){
                    it.remaining_use--
                    if(it.remaining_use==0) obj.kill()
                    else{
                        it.reloading=this.reload_time
                    }
                }
                if(it.equippedTime<0){
                    it.equippedTime++
                    obj.apply(TRANSFORM, it=>it.scale.scaleInPlace(1/.9))
                }
                if(it.equippedTime>0){
                    it.equippedTime--
                    obj.apply(TRANSFORM, it=>it.scale.scaleInPlace(.9))
                }
                if(it.reloading==1){
                    it.equippedTime=-10
                }
                if(it.reloading>0){
                    it.reloading--
                }
            })
        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([COLLECTABLE,this.uid])
            obj.observers(ON_COLLISION).remove(this.uid)
        }
    }
}

/**
 * @param {ConstructorParameters<typeof CollectableBehaviour>[0]} options
 * @param {CollectableBehaviour['on_collection']} collecter
 */
export function behaviourCollectable(options,collecter){
    let ret=new CollectableBehaviour(options)
    ret.on_collection=collecter
    return ret
}

/**
 * @param {import("../../world/TaggedDict.mjs").Tag[]} tags
 * @param {string=} slot
 */
export function behaviourInfiniteEquipper(tags,slot){
    return behaviourCollectable({use_count:Infinity},(_,o)=>(giveEquip(o,tags,slot),true))
}

/** @typedef {{equippedTime:number, remaining_use:number, reloading:number}} CollectableData */
/** @type {ModelKey<CollectableData>} */
export const COLLECTABLE=new ModelKey("collectable")

/** @type {ObserverKey<{collecter:GameObject, equipper:CollectableBehaviour}>} */
export const ON_COLLECT=new ObserverKey("on_collect")

/** @type {ObserverKey<{collectable:GameObject, equipper:CollectableBehaviour}>} */
export const ON_COLLECTED=new ObserverKey("on_collected")