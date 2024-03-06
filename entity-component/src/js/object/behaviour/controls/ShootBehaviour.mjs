import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ShootBehaviour extends Behaviour{

    /**
     * @param {string} key Shooting key
     * @param {Array<import("../../GameObject.mjs").Tag>} tags Projectile Tags
     * @param {object} data Projectile Data
     */
    constructor(key,tags,data){
        super()
        this.key=key
        this.tags=tags
        this.data=data
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Move
        if(isKeyPressed(this.key)){
            forward*=this.speed/d
            side*=this.speed/d

            for(let object of objects){
                let vx=this.center[0]-object.transform.x
                let vy=this.center[1]-object.transform.y
                let vz=this.center[2]-object.transform.z
                let length=Math.sqrt(vx**2+vy**2+vz**2)
                vx/=length
                vy/=length
                vz/=length
                object.dx+=vz*this.speed*side
                object.dy+=vy*this.speed*side
                object.dz+=-vx*this.speed*side

                object.dx+=vx*this.speed*forward
                object.dy+=vy*this.speed*forward
                object.dz+=vz*this.speed*forward
            }
        }
    }

    /** @override */
    finish(world, objects){
    }

    
}