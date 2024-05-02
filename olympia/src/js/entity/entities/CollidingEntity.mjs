



import { Entity } from "../Entity.mjs";
import { EntityListHandler } from "../EntityListHandler.mjs";
import { PhysicalEntity, SimpleMeshEntity } from "./PhysicalEntity.mjs";

class CollidingELHClass extends EntityListHandler{
    
    on_tick(world){
        const entities=Array.from(world.of(this))
        for(let a=0; a<entities.length; a++){
            for(let b=a+1; b<entities.length; b++){
                const entity_a=entities[a].get_hitbox()
                const entity_b=entities[b].get_hitbox()
                if(entity_a.intersectsMesh(entity_b)){
                    entity_a.onCollision(entity_b)
                    entity_b.onCollision(entity_a)
                }
            }
        }
    }
}

export const CollidingELH = new CollidingELHClass()

export class CollidingEntity extends PhysicalEntity{

    get_lists(){
        return [CollidingELH]
    }

    onCollision(other){ }
}