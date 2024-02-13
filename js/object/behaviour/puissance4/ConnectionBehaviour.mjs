import { Behaviour } from "../Behaviour.mjs";

export class ConnectionBehaviour extends Behaviour{

    /**
     * 
     * @param {number=} powering_time
     */
    constructor(powering_time=40){
        super()
        this.powering_time=powering_time
    }

    /** @override */
    init(world, objects){
        for(let object of objects){
            /** @type {any}*/
            let connection=object.ConnectionBehaviour={}
            connection.powering=0
            connection.team=this
            object.observers("on_collision").add("ConnectionBehaviour", (v,obj1,obj2) => {
                let connec2=obj2["ConnectionBehaviour"]

                // Trigger connection search on collision
                if(connec2 && connec2.team===this && connec2.powering===0 && connection.powering===0){
                    if(connection.no){
                        connection.no=false
                        return;
                    }
                    connec2.no=true
                    connection.angle={
                        x:obj2.x-obj1.x,
                        y:obj2.y-obj1.y,
                        z:obj2.z-obj1.z
                    }
                    connection.distance=Math.sqrt(
                        connection.angle.x**2 +
                        connection.angle.y**2 + 
                        connection.angle.z**2
                    )
                }
            })
        }
    }

    /**
     * Find a coin at a position
     */
    findAt(objects, position, maxdistance){
        for(let object of objects){
            let connec=object["ConnectionBehaviour"]
            let distance=Math.sqrt(
                (position.x-object.x)**2 +
                (position.y-object.y)**2 +
                (position.z-object.z)**2
            )
            if(distance<maxdistance){
                return object
            }
        }
        return null
    }

    /**
     * Count coins in a direction starting at a position
     */
    alignInDirection(objects, position, direction, maxdistance){
        let aligned=[]
        let distance=0
        let pos={
            x:position.x+direction.x,
            y:position.y+direction.y,
            z:position.z+direction.z
        }
        for(let i=1; true; i++){
            let object=this.findAt(objects, pos, maxdistance)
            if(object){
                let connec=object.ConnectionBehaviour
                aligned.push(object)
                pos.x=object.x+direction.x
                pos.y=object.y+direction.y
                pos.z=object.z+direction.z
            }
            else{
                break
            }
        }
        return aligned
    }

    /** @override */
    tick(world, objects){
        for(let object of objects){
            let connec=object.ConnectionBehaviour
            let time=connec.powering
            
            // Try to connect to other coins
            if(connec.angle){
                let aligned=this.alignInDirection(objects, object, connec.angle, connec.distance/2)
                connec.angle.x*=-1
                connec.angle.y*=-1
                connec.angle.z*=-1
                aligned.push(object)
                aligned=aligned.concat(this.alignInDirection(objects, object, connec.angle, connec.distance/2))
                delete connec.angle
                for(let coin of aligned){
                    if(aligned.length>3){
                        coin.color=[255,0,0,1]
                    }
                    else coin.ConnectionBehaviour.powering=this.powering_time
                }
            }

            // Powering color
            if(time>0){
                connec.powering--
                if(!connec.oldcolor){
                    connec.oldcolor=object.color
                    
                }
                object.color=[255,255,255,1]
            }
            else{
                if(connec.oldcolor){
                    object.color=connec.oldcolor
                    delete connec.oldcolor
                }
            }
        }
    }


    /** @override */
    finish(world, objects){
        for(let object of objects){
            delete object["ConnectionBehaviour"]
            object.observers("on_collision").remove("ConnectionBehaviour")
        }
    }

    
}