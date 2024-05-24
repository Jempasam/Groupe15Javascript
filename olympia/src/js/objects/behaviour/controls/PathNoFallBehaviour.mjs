import { isKeyPressed } from "../../../controls/Keyboard.mjs";
import { MOVEMENT, accelerate, accelerateX, accelerateZ } from "../../model/MovementModel.mjs";
import { ObjectQuery, World } from "../../world/World.mjs";
import { Behaviour } from "../Behaviour.mjs";
import { PATH, PathModel } from "../../model/PathModel.mjs"
import { TRANSFORM, TransformModel } from "../../model/TransformModel.mjs"
import { Vector3 } from "../../../../../../babylonjs/core/index.js";


/**
 * Fait esquiver le vide. Lorsque l'objet s'apprête à tomber dans le vide, il est repousser.
 * Nécessite un carte de chemin et donc un PathBehaviour sur les objets du terrain.
 */
export class PathNoFallBehaviour extends Behaviour{

    /**
     * @param {object} options
     * @param {number=} options.acceleration
     * @param {number=} options.max_speed
     * @param {number=} options.distance_to_border
     * @param {import("../../world/TaggedDict.mjs").Tag[]=} options.indicator
     */
    constructor(options={}){
        super()
        this.acceleration=options.acceleration ?? 0.05
        this.max_speed=options.max_speed ?? 0.3
        this.distance_to_border=options.distance_to_border ?? 0.8
        this.indicator=options.indicator
    }

    init(world, objects){ }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        const path=world.model.get(PATH); if(!path)return
        const right= Vector3.One()
        const forward= Vector3.One()
        const pt1= Vector3.One()
        const pt2= Vector3.One()
        const direction= Vector3.One()
        for(const obj of objects){
            let tf=obj.get(TRANSFORM); if(!tf)continue
            let mv=obj.get(MOVEMENT); if(!mv)continue

            // Get directions vectors
            mv.inertia .normalizeToRef(forward) .scaleInPlace(this.distance_to_border)
            right .set(-forward.z,forward.y,forward.x) .scaleInPlace(this.distance_to_border)
            
            // Test points
            const isInVoid = (direction)=>{
                pt1.copyFrom(tf.position) .addInPlace(direction)
                pt2.copyFrom(pt1)
                pt1.addInPlaceFromFloats(0, -tf.scale.y*1.5, 0)
                const ret=path.getBetween(pt1,pt2)==PathModel.EMPTY
                if(ret && this.indicator) world.add(this.indicator, new TransformModel({position:pt2, scale:new Vector3(.1,.1,.1)}))
                return ret
            }
            
            direction.copyFrom(forward)
            const airForward=isInVoid(direction)

            direction.copyFrom(forward).subtractInPlace(right)
            const airRight=isInVoid(direction)

            direction.copyFrom(forward).addInPlace(right)
            const airLeft=isInVoid(direction)

            direction.copyFrom(forward).scaleInPlace(-1)
            const airBehind=isInVoid(direction)

            // Accelerate
            const push= (dx,dz)=>{
                accelerate(mv.inertia, dx*this.acceleration, 0, dz*this.acceleration, Math.abs(dx)*this.max_speed, 0, Math.abs(dz)*this.max_speed)
            }

            if(airBehind){}
            else if(airForward){
                forward.normalize().scaleInPlace(-1)
                push(forward.x,forward.z)
            }
            else{
                if(airRight){
                    if(!airLeft){
                        right.normalize()
                        push(right.x,right.z)
                    }
                }
                else if(airLeft){
                    right.normalize().scaleInPlace(-1)
                    push(right.x,right.z)
                }
            }
        }

    }

    finish(){ }
}