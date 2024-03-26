import { isKeyPressed } from "../../controls/Keyboard.mjs"
import { Puissance4 } from "../../field/Puissance4.mjs"



export class Controler{

    static NONE={dx:0, dy:0, isDirection:false}

    static UP={dx:0, dy:-1, isDirection:true}
    static DOWN={dx:0, dy:1, isDirection:true}
    static LEFT={dx:-1, dy:0, isDirection:true}
    static RIGHT={dx:1, dy:0, isDirection:true}

    static MOVE={dx:0, dy:0, isDirection:false}
    static ACTION={dx:0, dy:0, isDirection:false}

    static{
        // Next
        this.UP.next=this.RIGHT; this.DOWN.next=this.LEFT;
        this.LEFT.next=this.UP; this.RIGHT.next=this.DOWN

        // Previous
        this.UP.previous=this.LEFT; this.DOWN.previous=this.RIGHT;
        this.LEFT.previous=this.DOWN; this.RIGHT.previous=this.UP
    }

    static ofDirection(dx,dy){
        if(dx==0 && dy==0)return Controler.NONE
        if(dx==0){
            if(dy>0)return Controler.DOWN
            return Controler.UP
        }
        if(dx>0)return Controler.RIGHT
        return Controler.LEFT
    }

    /**
     * Get current action with a given direction and position
     * @param {number} dx 
     * @param {number} dy 
     * @param {number} x 
     * @param {number} y 
     * @returns {Array<Controler.UP|Controler.DOWN|Controler.LEFT|Controler.RIGHT|Controler.ACTION>}
     */
    getCurrentAction(field,dx,dy,x,y){
        return []
    }

    /**
     * 
     * @param {Puissance4} field 
     * @param {number} dx 
     * @param {number} dy 
     * @param {number} x 
     * @param {number} y 
     * @param {function(Controler.UP|Controler.DOWN|Controler.LEFT|Controler.RIGHT|Controler.ACTION):void} callback 
     */
    onAction(field,dx,dy,x,y,callback){
        const actions=this.getCurrentAction(field,dx,dy,x,y)
        for(const a of actions){
            callback(a)
        }
    }

    /**
     * Get the team of the controler
     * @returns {string?}
     */
    get team(){
        return null
    }
}

class ArrowControler extends Controler{
    getCurrentAction(field,dx,dy,x,y){
        if(isKeyPressed("ArrowUp"))return [Controler.UP,Controler.MOVE]
        if(isKeyPressed("ArrowDown"))return [Controler.DOWN,Controler.MOVE]
        if(isKeyPressed("ArrowLeft"))return [Controler.LEFT,Controler.MOVE]
        if(isKeyPressed("ArrowRight"))return [Controler.RIGHT,Controler.MOVE]
        if(isKeyPressed("RShift"))return [Controler.ACTION]
        return []
    }

    get team(){ return null }
}
export const ARROW_CONTROLER=new ArrowControler()

class PlayerControler extends Controler{

    constructor(team, leftKey, rightKey, spawnKey){
        super()
        this._team=team
        this.leftKey=leftKey
        this.rightKey=rightKey
        this.spawnKey=spawnKey
    }

    getCurrentAction(field,dx,dy,x,y){
        let direction=Controler.ofDirection(dx,dy)
        if(direction==Controler.NONE)direction=Controler.UP
        if(isKeyPressed(this.leftKey) && isKeyPressed(this.rightKey))return [Controler.MOVE]
        if(isKeyPressed(this.leftKey))return [direction.previous,Controler.MOVE]
        if(isKeyPressed(this.rightKey))return [direction.next,Controler.MOVE]
        if(isKeyPressed(this.spawnKey))return [Controler.ACTION, direction.previous.previous, Controler.MOVE]
        return []
    }
    
    get team(){ return this._team }
}
export const RED_CONTROLER=new PlayerControler("red","KeyQ","KeyE","KeyW")
export const BLUE_CONTROLER=new PlayerControler("blue","KeyU","KeyO","KeyI")
export const YELLOW_CONTROLER=new PlayerControler("yellow","KeyR","KeyY","KeyT")
export const GREEN_CONTROLER=new PlayerControler("green","KeyV","KeyN","KeyB")
export const PLAYER_CONTROLERS=[RED_CONTROLER,BLUE_CONTROLER,YELLOW_CONTROLER,GREEN_CONTROLER]

export class WanderingControler extends Controler{

    constructor(){
        super()
        this.direction=Controler.UP
        this.isMoving=false
        this.time=Math.random()*6
    }

    getCurrentAction(field,dx,dy,x,y){
        let ret=[]
        this.time--
        if(this.time<=0){
            this.time=Math.random()*6
            this.isMoving=Math.random()>0.5
            this.direction=[Controler.UP,Controler.DOWN,Controler.LEFT,Controler.RIGHT,Controler.NONE][Math.floor(Math.random()*4)]
        }
        if(this.direction.isDirection)ret.push(this.direction)
        if(this.isMoving)ret.push(Controler.MOVE)
        if(Math.random()>0.9)ret.push(Controler.ACTION)
        return ret
    }

    get team(){ return "purple" }
}

export const ALL_CONTROLERS_FACTORIES=[()=>ARROW_CONTROLER,...PLAYER_CONTROLERS.map(c=>()=>c),()=>new WanderingControler()]