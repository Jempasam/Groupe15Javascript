import { do_team_with } from "../../model/TeamModel.mjs";
import { GameObject } from "../../world/GameObject.mjs";
import { ModelKey } from "../../world/ModelHolder.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { ON_COLLISION } from "../collision/SimpleCollisionBehaviour.mjs";

/**
 * @enum {number}
 */
export const ContactTarget={
    EVERYONE:0,
    ONLY_ENNEMIES:1,
    ONLY_ALLIES:2,
    NOT_ENNEMIES:3,
    NOT_ALLIES:4,
}

export class OnContactBehaviour extends Behaviour{

    /**
     * @param {object} options
     * @param {number=} options.reload_time
     * @param {ContactTarget=} options.target
     */
    constructor({reload_time=20, target=ContactTarget.EVERYONE}={}){
        super()
        this.reload_time=reload_time
        this.contact_target=target
    }

    

    /** @override@type {Behaviour['init']} */
    init(world, objects, filter, ...rest){
        for(const obj of objects){
            obj.getOrSet([ON_CONTACT,this.uid], ()=>({reload_time:0}))
            obj.observers(ON_COLLISION).add(this.uid, (_,{object})=>{
                let data=obj.get([ON_CONTACT,this.uid]); if(!data)return
                if(data.reload_time>0)return
                if(filter && !filter.match(object))return

                let do_contact=false
                switch(this.contact_target){
                    case ContactTarget.EVERYONE:
                        do_contact=true; break
                    case ContactTarget.ONLY_ENNEMIES:
                        do_contact=!do_team_with(obj, object, true); break
                    case ContactTarget.ONLY_ALLIES:
                        do_contact=do_team_with(obj, object, false); break
                    case ContactTarget.NOT_ENNEMIES:
                        do_contact=do_team_with(obj, object, true); break
                    case ContactTarget.NOT_ALLIES:
                        do_contact=!do_team_with(obj, object, false); break
                }

                if(!do_contact)return
                this.on_contact(obj, object, world, objects, filter, ...rest)
                data.reload_time=this.reload_time
            })
        }
    }

    /**
     * @param {GameObject} self
     * @param {GameObject} target
     * @param {World} world
     * @param {...ObjectQuery} objects 
     */
    on_contact(self, target, world, ...objects){
        throw new Error("Undefined contact methodmethod")
    }

    /** @override @type {Behaviour['tick']} */
    tick(world, objects){
        for(const obj of objects){
            let data=obj.get([ON_CONTACT,this.uid]); if(!data)return
            if(data.reload_time>0)data.reload_time--
        }
    }

    /** @override @type {Behaviour['finish']} */
    finish(world, objects){
        for(const obj of objects){
            obj.remove([ON_CONTACT,this.uid])
            obj.observers(ON_COLLISION).remove(this.uid)
        }
    }
}

/** @type {ModelKey<{reload_time:number}>} */
const ON_CONTACT=new ModelKey("on_contact")

/**
 * Crée un behaviour qui réagit à un contact entre l'objet et un autre objet.
 * @param {ConstructorParameters<typeof OnContactBehaviour>[0]} options
 * @param {OnContactBehaviour['on_contact']} action
 */
export function behaviourOnContact(options,action){
    let ret=new OnContactBehaviour(options)
    ret.on_contact=action
    return ret
}