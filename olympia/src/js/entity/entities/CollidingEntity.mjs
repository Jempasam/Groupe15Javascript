



import { Entity } from "../Entity.mjs";
import { EntityListHandler } from "../EntityListHandler.mjs";
import { PhysicalEntity, SimpleMeshEntity } from "./PhysicalEntity.mjs";

class CollidingELHClass extends EntityListHandler{

    on_tick(world){
        if(!world.scene)return
        for(let entity of world.of(this)){
            if(!entity.placeMesh)return
            entity.placeMesh(world,world.scene)
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