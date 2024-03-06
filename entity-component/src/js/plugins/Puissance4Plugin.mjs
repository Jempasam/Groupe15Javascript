import { BoxShape, CircleShape } from "../collision/Shape.mjs";
import { eatKeyPress, isKeyPressed } from "../controls/Keyboard.mjs";
import { MovementBehaviour } from "../object/behaviour/MovementBehaviour.mjs";
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
import { BOX_BOUND } from "../collision/bound/BoxBound.mjs";
import { Transform, transform } from "../transform/Transform.mjs";
import { SPHERE_BOUND } from "../collision/bound/SphereBound.mjs";
import "babylonjs";
import { ControlCircleBehaviour } from "../object/behaviour/controls/ControlCircleBehaviour.mjs";
import { PHYSICAL } from "../object/tags.mjs";
import { ControlRotationBehaviour } from "../object/behaviour/controls/ControlRotationBehaviour.mjs";

// -- TAGS -- //
let counter=6343

/* Un type de mouvement d'objet physique */
const MOVING = counter++
const SLIDING = counter++
const FIXED = counter++
const BOUNCING = counter++

/* L'objet aspire les objets physiques */
const ASPIRATOR = counter++

const CONTROL=counter++

const BLUE_COIN=counter++

// -- COULEUR DES OBJETS -- //
let GREEN=[0,255,0,1]
let RED=[255,0,0,1]
let BLUE=[0,0,255,1]
let YELLOW=[255,255,0,1]
let CYAN=[0,255,255,1]

/** {@type {DShape}} */
let green_box={
    defaultColor: () => GREEN,
    defaultShape: () => DShapeDef.BOX,
    id: 1
}

/** {@type {DShape}} */
let blue_coin={
    defaultColor: () => BLUE,
    defaultShape: () => DShapeDef.SPHERE,
    id: 2
}

let red_box={
    defaultColor: () => RED,
    defaultShape: () => DShapeDef.BOX,
    id: 3
}

export class Puissance4Plugin extends Plugin{

    /**
     * @override 
     * @returns {[number,number,number]}
     * */
    get minimum_size(){ return [10_000,10_000,10_000] }


    /** @override */
    init(parent,drawable,world){
        // -- AJOUT DES BEHAVIOURS -- //
        world.addBehav([MOVING],new MovementBehaviour(0.90))
        world.addBehav([MOVING],new PushCollisionBehaviour(1))
        world.addBehav([MOVING],new DepthFrictionBehaviour(80))
        world.addBehav([MOVING],new DirectionnalFrictionBehaviour(0.5))
        world.addBehav([MOVING],new GravityBehaviour(0,0,6))

        world.addBehav([SLIDING],new MovementBehaviour(0.98))
        world.addBehav([SLIDING],new PushCollisionBehaviour(1))
        world.addBehav([SLIDING],new DepthFrictionBehaviour(80))
        world.addBehav([SLIDING],new DirectionnalFrictionBehaviour(0.9))
        world.addBehav([SLIDING],new GravityBehaviour(0,0,6))

        world.addBehav([BOUNCING],new MovementBehaviour(0.99))
        world.addBehav([BOUNCING],new PushCollisionBehaviour(0.2))
        world.addBehav([BOUNCING],new GravityBehaviour(0,8,8))

        world.addBehav([FIXED],new MovementBehaviour(0))

        world.addBehav([PHYSICAL],new WorldLimitBehaviour(0.1))
        world.addBehav([PHYSICAL],new CollisionBehaviour())

        //world.addBehav([CONTROL],new ControlMoveBehaviour(10))
        //world.addBehav([CONTROL],new ControlJumpBehaviour(200,2))
        //world.addBehav([CONTROL],new ControlDashBehaviour(200,100))
        //world.addBehav([CONTROL],new ControlSizeBehaviour())
        world.addBehav([CONTROL],new ControlRotationBehaviour({"KeyA":[0,0,0.1]}))
        world.addBehav([ASPIRATOR,PHYSICAL],new AspirationBehaviour(1))

        world.addBehav([BLUE_COIN],new ConnectionBehaviour(80))

        // -- AJOUT DES OBJETS -- //
        this.player=world.addObj([PHYSICAL,MOVING,CONTROL],{transform: transform(2000, 1000, 8000, 500), bound:BOX_BOUND, dshape:red_box})

        world.addObj([PHYSICAL,FIXED],{transform: transform(0, 0, 9000, 10_000, 10_000, 1000), bound:BOX_BOUND, dshape: green_box})
        //world.addObj([PHYSICAL,FIXED],{transform: transform(0, 8000, 0, 3_000, 1000, 3_000), bound:BOX_BOUND, dshape: green_box})
        //world.addObj([PHYSICAL,FIXED],{transform: transform(5000, 7000, 0, 3_000, 1000, 3_000), bound:BOX_BOUND, dshape: green_box})

    }


    /** @override */
    logicTick(parent,drawable,world){
        if(eatKeyPress("KeyU")){
            world.addObj([PHYSICAL,SLIDING],{
                transform: transform(
                    this.player.transform.x+600,
                    this.player.transform.y,
                    this.player.transform.z,
                    600
                ),
                bound: SPHERE_BOUND,
                dshape:blue_coin
            })
        }
    }


    /** @override */
    drawTick(parent,drawable,world){
    }

}