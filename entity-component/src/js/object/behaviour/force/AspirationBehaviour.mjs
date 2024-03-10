import { Behaviour } from "../Behaviour.mjs";

export class AspirationBehaviour extends Behaviour{

    /** @type {number} */
    aspiration=0

    /**
     * 
     * @param {number=} aspiration
     */
    constructor(aspiration){
        super()
        this.aspiration=aspiration || 1
    }

    /** @override */
    init(world, objects){}

    /** @override */
    tick(world, aspirators, aspireds){
        for(let aspirator of aspirators){
            for(let aspired of aspireds){
                let dx=aspired.transform.x-aspirator.transform.x
                let dy=aspired.transform.y-aspirator.transform.y
                let d=Math.sqrt(dx*dx+dy*dy)
                if(d>0){
                    dx/=d
                    dy/=d
                    aspired.dx-=dx*this.aspiration
                    aspired.dy-=dy*this.aspiration
                }
            }
        }
    }

    /** @override */
    finish(world, objects){ }

    
}