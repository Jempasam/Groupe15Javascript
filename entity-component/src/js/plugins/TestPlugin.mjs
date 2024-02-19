import { BoxShape, CircleShape } from "../collision/Shape.mjs";
import { isKeyPressed } from "../controls/Keyboard.mjs";
import { MovementBehaviour } from "../object/behaviour/MovementBehaviour.mjs";
import { ShapeBehaviour } from "../object/behaviour/ShapeBehaviour.mjs";
import { CollisionBehaviour } from "../object/behaviour/collision/CollisionBehaviour.mjs";
import { WorldLimitBehaviour } from "../object/behaviour/collision/WorldLimitBehaviour.mjs";
import { ControlDashBehaviour } from "../object/behaviour/controls/ControlDashBehaviour.mjs";
import { ControlJumpBehaviour } from "../object/behaviour/controls/ControlJumpBehaviour.mjs";
import { ControlMoveBehaviour } from "../object/behaviour/controls/ControlMoveBehaviour.mjs";
import { ControlSizeBehaviour } from "../object/behaviour/controls/ControlSizeBehaviour copy.mjs";
import { AspirationBehaviour } from "../object/behaviour/force/AspirationBehaviour.mjs";
import { FrictionBehaviour } from "../object/behaviour/force/friction/FrictionBehaviour.mjs";
import { GravityBehaviour } from "../object/behaviour/force/GravityBehaviour.mjs";
import { PushCollisionBehaviour } from "../object/behaviour/force/PushCollisionBehaviour.mjs";
import { Plugin } from "../object/plugin/Plugin.mjs";

// -- TAGS -- //
let counter=62342

/* Un object physique */
const PHYSICAL = counter++

/* Un type de mouvement d'objet physique */
const MOVING = counter++
const FIXED = counter++
const BOUNCING = counter++

/* L'objet aspire les objets physiques */
const ASPIRATOR = counter++

/* Une forme d'objet physique */
const CIRCLE=counter++
const SQUARE=counter++
const WALL=counter++
const GROUND=counter++

/* Un objet controlable par le clavier*/
const CONTROL=counter++


export class TestPlugin extends Plugin{

    /**
     * @override 
     * @returns {[number,number,number]}
     * */
    get minimum_size(){ return [10_000,10_000,10_000] }


    /** @override */
    init(parent,drawable,world){
        // -- AJOUT DES BEHAVIOURS -- //
        world.addBehav([CIRCLE],new ShapeBehaviour(new CircleShape(0,0,0,1)))
        world.addBehav([SQUARE],new ShapeBehaviour(new BoxShape(0,0,0,100,100,100)))
        world.addBehav([WALL],new ShapeBehaviour(new BoxShape(0,0,0,1000,100,100)))
        world.addBehav([GROUND],new ShapeBehaviour(new BoxShape(0,0,0,1000,200,1000)))

        world.addBehav([MOVING],new MovementBehaviour(0.98))
        world.addBehav([MOVING],new PushCollisionBehaviour(0.2))
        world.addBehav([MOVING],new FrictionBehaviour(0.96))
        world.addBehav([MOVING],new GravityBehaviour(0,10,0))

        world.addBehav([BOUNCING],new MovementBehaviour(0.99))
        world.addBehav([BOUNCING],new PushCollisionBehaviour(0.2))
        world.addBehav([BOUNCING],new GravityBehaviour(0,8,0))

        world.addBehav([FIXED],new MovementBehaviour(0))

        world.addBehav([PHYSICAL],new WorldLimitBehaviour(0.1))
        world.addBehav([PHYSICAL],new CollisionBehaviour())

        world.addBehav([CONTROL],new ControlMoveBehaviour(10))
        world.addBehav([CONTROL],new ControlJumpBehaviour(200,2))
        world.addBehav([CONTROL],new ControlDashBehaviour(200,100))
        world.addBehav([CONTROL],new ControlSizeBehaviour())

        world.addBehav([ASPIRATOR,PHYSICAL],new AspirationBehaviour(1))


        // -- AJOUT DES EVENTS -- //
        parent.onclick=function(e){
            let x=(e.x-parent.clientLeft)/parent.clientWidth*world.width
            let y=(e.y-parent.clientTop)/parent.clientHeight*world.height
            if(e.shiftKey){
                world.addObj([PHYSICAL, BOUNCING, CIRCLE],{x:x, y:y, z:2500, size:800, color:[255,255,0,1]})
            }
            else if(e.ctrlKey){
                world.addObj([PHYSICAL, FIXED, GROUND],{x:x, y:y, z:2500, size:6000, color:[255,0,255,1]})
            }
            else if(e.altKey){
                world.addObj([PHYSICAL, CIRCLE, MOVING, CONTROL],{x:x, y:y, z:2500, size:1000, color:[255,0,0,1]})
            }
            else{
                world.addObj([PHYSICAL, SQUARE, MOVING],{x:x, y:y, z:2500, size:1000, color:[0,255,0,1]})
            }
        }
    }


    /** @override */
    logicTick(parent,drawable,world){
        if(isKeyPressed("KeyU")){
            let x=world.width/2 + Math.random()*100
            let z=world.depth/2 + Math.random()*100
            let dx=Math.random()*1000-500
            let dz=Math.random()*1000-500
            world.addObj([PHYSICAL, CIRCLE, MOVING],{
                x:x, y:world.height*0.9, z:z,
                dx:dx, dy:-500, dz:dz,
                size:800,
                color:[255,200,200,1]
            })
        }
    }


    /** @override */
    drawTick(parent,drawable,world){
    }

}