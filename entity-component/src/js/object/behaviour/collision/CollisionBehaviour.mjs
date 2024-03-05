import { AABB, spherePenetrationSphere } from "../../../collision/AABB.mjs";
import { CircleShape } from "../../../collision/Shape.mjs";
import { collide } from "../../../collision/bound/Bound.mjs";
import { Transform } from "../../../transform/Transform.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class CollisionBehaviour extends Behaviour{

    constructor(){
        super()
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Colliding objects
        let colliders=Array.from(objects)

        let obj1_transform=Transform.identity()
        let relative_transform=Transform.identity()
        for(let i=0;i<colliders.length;i++){
            let obj1=colliders[i]
            obj1_transform.copy(obj1.transform)
            obj1_transform.inverse()
            for(let j=i+1;j<colliders.length;j++){
                let obj2=colliders[j]
                relative_transform.copy(obj1_transform)
                relative_transform.compose(obj2.transform)
                
                let collision=collide(obj1.bound, relative_transform, obj2.bound)
                
                if(collision){
                    let [aborder,bborder,anormal,bnormal]=collision
                    let v=[
                        (-anormal[0]+bnormal[0]),
                        (-anormal[1]+bnormal[1]),
                        (-anormal[2]+bnormal[2])
                    ]
                    relative_transform.copy(obj1.transform)
                    relative_transform.x=0
                    relative_transform.y=0
                    relative_transform.z=0
                    relative_transform.apply(v)
                    console.log(v)

                    // Calculate collision depth vector
                    obj1.observers("on_collision").notify(v, obj1, obj2)
                    obj2.observers("on_collision").notify([-v[0],-v[1],-v[2]], obj2, obj1)
                }
            }
        }
    }


    /** @override */
    finish(world, objects){
    }

    
}