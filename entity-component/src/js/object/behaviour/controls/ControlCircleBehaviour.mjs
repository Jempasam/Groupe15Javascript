import { eatKeyPress, isKeyPressed } from "../../../controls/Keyboard.mjs";
import { Behaviour } from "../Behaviour.mjs";

export class ControlCircleBehaviour extends Behaviour{

    /**
     * @param {Array<string>} keyset The set used to controls the movement
     * @param {number} speed The speed
     * @param {[number,number,number]} center the movement center
     * 
     */
    constructor(keyset,speed, center){
        super()
        this.keyset=keyset
        this.speed=speed
        this.center=center
    }

    /** @override */
    init(world, objects){
    }

    /** @override */
    tick(world, objects){
        // Move
        let forward=0
        let side=0
        if(isKeyPressed(this.keyset[0])) side+=-1
        if(isKeyPressed(this.keyset[1])) side+=1
        if(isKeyPressed(this.keyset[2])) forward+=1
        if(isKeyPressed(this.keyset[3])) forward+=-1
        let d=Math.sqrt(side*side+forward*forward)
        if(d){
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