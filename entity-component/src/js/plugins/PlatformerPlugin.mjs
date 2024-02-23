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
import * as Tags from "../object/tags.mjs";

// -- COULEUR DES OBJETS -- //
let GREEN=[0,255,0,1]
let RED=[255,0,0,1]
let BLUE=[0,0,255,1]
let YELLOW=[255,255,0,1]
let CYAN=[0,255,255,1]


export class PlatformerPlugin extends Plugin{

    /**
     * @override 
     * @returns {[number,number,number]}
     * */
    get minimum_size(){ return [10_000,10_000,10_000] }


    /** @override */
    init(parent,drawable,world){
        // -- AJOUT DES BEHAVIOURS -- //
        world.addBehav([Tags.CIRCLE],new ShapeBehaviour(new CircleShape(0,0,0,1)))
        world.addBehav([Tags.SQUARE],new ShapeBehaviour(new BoxShape(0,0,0,100,100,100)))
        world.addBehav([Tags.WALL],new ShapeBehaviour(new BoxShape(0,0,0,1000,100,100)))
        world.addBehav([Tags.GROUND],new ShapeBehaviour(new BoxShape(0,0,0,1000,400,1000)))

        world.addBehav([Tags.MOVING],new MovementBehaviour(0.90))
        world.addBehav([Tags.MOVING],new PushCollisionBehaviour(1))
        world.addBehav([Tags.MOVING],new DepthFrictionBehaviour(80))
        world.addBehav([Tags.MOVING],new DirectionnalFrictionBehaviour(0.5))
        world.addBehav([Tags.MOVING],new GravityBehaviour(0,10,0))

        world.addBehav([Tags.SLIDING],new MovementBehaviour(1.0))
        world.addBehav([Tags.SLIDING],new PushCollisionBehaviour(1))
        world.addBehav([Tags.SLIDING],new DepthFrictionBehaviour(80))
        world.addBehav([Tags.SLIDING],new DirectionnalFrictionBehaviour(0.9))
        world.addBehav([Tags.SLIDING],new GravityBehaviour(0,10,0))

        world.addBehav([Tags.BOUNCING],new MovementBehaviour(0.99))
        world.addBehav([Tags.BOUNCING],new PushCollisionBehaviour(0.2))
        world.addBehav([Tags.BOUNCING],new GravityBehaviour(0,8,0))

        world.addBehav([Tags.FIXED],new MovementBehaviour(0))

        world.addBehav([Tags.PHYSICAL],new WorldLimitBehaviour(0.1))
        world.addBehav([Tags.PHYSICAL],new CollisionBehaviour())

        world.addBehav([Tags.CONTROL],new ControlMoveBehaviour(10))
        world.addBehav([Tags.CONTROL],new ControlJumpBehaviour(200,2))
        world.addBehav([Tags.CONTROL],new ControlDashBehaviour(200,100))
        world.addBehav([Tags.CONTROL],new ControlSizeBehaviour())

        world.addBehav([Tags.ASPIRATOR,Tags.PHYSICAL],new AspirationBehaviour(1))

        // -- AJOUT DES OBJETS -- //
        let typeWall=[Tags.WALL,Tags.PHYSICAL,Tags.FIXED]
        world.addObj(typeWall,{x:5000,y:11000,z:5000,size:10_000,color:GREEN})
        world.addObj(typeWall,{x:7000,y:9000,z:7000,size:6000,color:GREEN})
        world.addObj(typeWall,{x:8000,y:7500,z:8000,size:4000,color:GREEN})

        world.addObj(typeWall,{x:1000,y:8000,z:1000,size:2000,color:RED})
        world.addObj(typeWall,{x:3000,y:5000,z:5000,size:2000,color:RED})
        world.addObj(typeWall,{x:6000,y:4000,z:5000,size:2000,color:RED})
        world.addObj(typeWall,{x:3000,y:3000,z:5000,size:2000,color:RED})

        this.player=world.addObj([Tags.SQUARE,Tags.PHYSICAL,Tags.MOVING,Tags.CONTROL],{x:1000,y:7000,z:7000,size:500,color:YELLOW})

    }


    /** @override */
    logicTick(parent,drawable,world){
    }


    /** @override */
    drawTick(parent,drawable,world){
    }

}