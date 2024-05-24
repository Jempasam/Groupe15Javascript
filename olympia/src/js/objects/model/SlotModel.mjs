import { GameObject } from "../world/GameObject.mjs"
import { ModelKey } from "../world/ModelHolder.mjs"

/**
 * @typedef {import("../world/TaggedDict.mjs").Tag} Tag
 */

/**
 * Donne des tags à un objet, en supportantle fait que l'objet ai déjà le tag.
 * Utilise un compteur pour savoir combien de fois un tag a été donné.
 * Si le tag est supprimée après avoir été donné alors qu'il est déjà donné, alors il n'est pas complétement supprimé.
 * @param {GameObject} obj 
 * @param {Tag[]} tags 
 */
export function giveTag(obj, ...tags){
    const slots=obj.getOrSet(SLOTS,()=>new SlotModel())
    for(const tag of tags){
        let count=slots.counters[tag] ?? (obj.tags.includes(tag)?1:0)
        count++
        slots.counters[tag]=count
        obj.addTag(tag)
    }
}

/**
 * Supprime des tags à un objet, en supportant le fait que l'objet ai déjà le tag.
 * Utilise un compteur pour savoir combien de fois un tag a été donné.
 * Si le tag est supprimée après avoir été donné alors qu'il est déjà donné, alors il n'est pas complétement supprimé.
 * @param {GameObject} obj 
 * @param  {Tag[]} tags 
 */
export function removeTag(obj, ...tags){
    const slots=obj.getOrSet(SLOTS,()=>new SlotModel())
    for(const tag of tags){
        let count=slots.counters[tag] ?? 0
        if(count<=0)continue
        count--
        slots.counters[tag]=count
        if(count<=0){
            delete slots.counters[tag]
            obj.removeTag(tag)
        }
    }
}

/**
 * Donne des tags comme giveTag.
 * Donne des tags à un objet, en les associant à un slot.
 * Si des tags sont déjà associés au slot, alors ils sont remplacés.
 * @param {GameObject} obj 
 * @param {Tag[]} tags 
 * @param {string=} slot 
 */
export function giveEquip(obj, tags, slot=undefined){
    if(slot!=null){
        const slots=obj.getOrSet(SLOTS,()=>new SlotModel())
        const previous=slots.slots[slot]
        if(previous){
            removeTag(obj,...previous)
        }
        slots.slots[slot]=tags
        if(tags.length==0)delete slots.slots[slot]
        if(tags.length>0)giveTag(obj,...tags)
    }
    else giveTag(obj,...tags)
}

/**
 * Supprime des tags comme removeTag.
 * Supprime des tags à un objet, en les associant à un slot.
 * @param {GameObject} obj
 * @param {string} slot
 */
export function removeEquip(obj, slot){
    if(slot!=null){
        const slots=obj.getOrSet(SLOTS,()=>new SlotModel())
        const previous=slots.slots[slot]
        if(previous){
            removeTag(obj,...previous)
            delete slots.slots[slot]
        }
    }
}

export class SlotModel{
    /** @type {{[key:string]:Tag[]}} */
    slots={}

    /** @type {{[key:Tag]:number}} */
    counters={}
}

/** @type {ModelKey<SlotModel>} */
export const SLOTS=new ModelKey("slots")