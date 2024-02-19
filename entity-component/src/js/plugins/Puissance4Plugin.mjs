import { BoxShape, CircleShape } from "../collision/Shape.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs";
import { MovementBehaviour } from "../object/behaviour/MovementBehaviour.mjs";
import { ShapeBehaviour } from "../object/behaviour/ShapeBehaviour.mjs";
import { CollisionBehaviour } from "../object/behaviour/collision/CollisionBehaviour.mjs";
import { WorldLimitBehaviour } from "../object/behaviour/collision/WorldLimitBehaviour.mjs";
import { ControlDashBehaviour } from "../object/behaviour/controls/ControlDashBehaviour.mjs";
import { ControlJumpBehaviour } from "../object/behaviour/controls/ControlJumpBehaviour.mjs";
import { ControlMoveBehaviour } from "../object/behaviour/controls/ControlMoveBehaviour.mjs";
import { ControlSizeBehaviour } from "../object/behaviour/controls/ControlSizeBehaviour copy.mjs";
import { AspirationBehaviour } from "../object/behaviour/force/AspirationBehaviour.mjs";
import { DepthFrictionBehaviour } from "../object/behaviour/force/friction/DepthFrictionBehaviour.mjs";
import { DirectionnalFrictionBehaviour } from "../object/behaviour/force/friction/DirectionnalFrictionBehaviour.mjs";
import { FrictionBehaviour } from "../object/behaviour/force/friction/FrictionBehaviour.mjs";
import { GravityBehaviour } from "../object/behaviour/force/GravityBehaviour.mjs";
import { PushCollisionBehaviour } from "../object/behaviour/force/PushCollisionBehaviour.mjs";
import { Plugin } from "../object/plugin/Plugin.mjs";
import { ConnectionBehaviour } from "../object/behaviour/puissance4/ConnectionBehaviour.mjs";
import { DShape, DShapeDef } from "../display/Display.mjs";

// -- DISPLAY SHAPE -- //
/** @type {DShape} */
let shape={
    defaultColor(){
        return [255,0,0]
    },
    defaultShape(){
        return DShapeDef.BOX
    },
    id: 0
}

/** @type {DShape} */
let coin_shape={
    defaultColor(){
        return [0,255,0]
    },
    defaultShape(){
        return DShapeDef.SPHERE
    },
    id: 1
}

/** @type {DShape} */
let shape3={
    defaultColor(){
        return [0,0,255]
    },
    defaultShape(){
        return DShapeDef.BOX
    },
    id: 2
}


// -- TAGS -- //
let counter=23452

/* Un object physique */
const PHYSICAL = counter++

/* Un type de mouvement d'objet physique */
const MOVING = counter++
const SLIDING = counter++
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

const BLUE_COIN=counter++

// -- COULEUR DES OBJETS -- //
let GREEN=[0,255,0,1]
let RED=[255,0,0,1]
let BLUE=[0,0,255,1]
let YELLOW=[255,255,0,1]
let CYAN=[0,255,255,1]


export class Puissance4Plugin extends Plugin{

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
        world.addBehav([GROUND],new ShapeBehaviour(new BoxShape(0,0,0,1000,400,1000)))

        world.addBehav([MOVING],new MovementBehaviour(0.90))
        world.addBehav([MOVING],new PushCollisionBehaviour(1))
        world.addBehav([MOVING],new DepthFrictionBehaviour(80))
        world.addBehav([MOVING],new DirectionnalFrictionBehaviour(0.5))
        world.addBehav([MOVING],new GravityBehaviour(0,10,0))

        world.addBehav([SLIDING],new MovementBehaviour(1.0))
        world.addBehav([SLIDING],new PushCollisionBehaviour(1))
        world.addBehav([SLIDING],new DepthFrictionBehaviour(80))
        world.addBehav([SLIDING],new DirectionnalFrictionBehaviour(0.9))
        world.addBehav([SLIDING],new GravityBehaviour(0,10,0))

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

        world.addBehav([BLUE_COIN],new ShapeBehaviour(new CircleShape(0,0,0,50)))
        world.addBehav([BLUE_COIN],new ConnectionBehaviour(80))

        // -- AJOUT DES OBJETS -- //
        world.addObj([GROUND,PHYSICAL,FIXED],{x:5000,y:5000,z:5000,size:10_000})

        this.player=world.addObj([SQUARE,PHYSICAL,MOVING,CONTROL],{x:1000, y:7000, z:7000, size:500, dshape:shape})
    }


    /** @override */
    logicTick(parent,drawable,world){
        if(eatKeyPress("KeyU")){
            world.addObj([BLUE_COIN,PHYSICAL,SLIDING],{
                x:this.player.x+600,
                y:this.player.y,
                z:this.player.z,
                size:600,
                color: BLUE,
                dshape:coin_shape
            })
        }
    }


    /** @override */
    drawTick(parent,drawable,world){
    }

}