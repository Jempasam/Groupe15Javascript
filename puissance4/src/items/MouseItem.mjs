import { MOVING } from "../../../entity-component/src/js/object/tags.mjs";
import { random } from "../../../samlib/Array.mjs";
import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { BASE_SPAWNABLE } from "../field/collection/base_collection.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { BubbleItem } from "./BubbleItem.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { GoombaItem } from "./GoombaItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
import { MeteorItem } from "./MeteorItem.mjs";
import { MoblinItem } from "./MoblinItem.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { TNTItem } from "./TNTItem.mjs";

export class MouseItem extends Item{

    /**
     * 
     */
    constructor(){
        super()
        this.base=null
        this.time=0
        this.dx=0
        this.dy=0
        this.state=new Cursor()
        this.changed=false
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="mouse ${this.state.getClasses()}">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){ }

    onTick(field,root,x,y){
        if(this.changed){
            this.changed=false
            this.state.onStart(field,root,this,x,y)
            field.updateElement(x,y)
        }
        this.time++
        if(this.time>7){
            this.state.onTick(field,root,this,x,y)
            this.time=0
        }
        field.schedule(x,y,root)
    }

    setState(state){
        this.state=state
        this.changed=true
    }

    rotate(field, root, x, y){
        Methods.rotate.dxdy.call(this, field , root, x, y)
        this.base?.rotate(field, root, x, y)
    }

    offsetAll(field,x,y,dx,dy){
        let adx=0
        let ady=0
        if(dy!=0){
            adx=1
            x=-1
        }
        if(dx!=0){
            ady=1
            y=-1
        }
        while(true){
            x+=adx
            y+=ady
            let under=field.get(x,y)
            if(under===undefined)break
            this.offset(field,x,y,dx,dy)
        }
    }

    offset(field,x,y,dx,dy){
        if(dx==1)x=0
        if(dy==1)y=0
        if(dx==-1)x=field.width-1
        if(dy==-1)y=field.height-1
        let base=field.get(x,y)
        while(true){
            x+=dx
            y+=dy
            let under=field.get(x,y)
            if(under===undefined)break
            else{
                field.set(x-dx,y-dy,null)
                field.swap(x,y,x-dx,y-dy)
            }
        }
        field.set(x-dx,y-dy,base)

    }

    agressiveDirection(field, x, y){
        function find(dx, dy){
            let xx=x
            let yy=y
            let under=null
            let distance=0
            while(under===null){
                xx+=dx
                yy+=dy
                distance++
                under=field.get(xx,yy)
            }
            if(under) return [dx,dy]
            else null
        }
        if(Math.random()>0.3){
            let direction= find(1,0) ?? find(-1,0) ?? find(0,1) ?? find(0,-1)
            if(direction){
                this.dx=direction[0]
                this.dy=direction[1]
                return
            }
        }
        this.randomDirection(field,x,y)
    }

    escapeDirection(field, x, y){
        this.randomDirection(field,x,y)
        if(field.get(x+this.dx,y+this.dy)!==null){
            this.dx*=-1
            this.dy*=-1
        }
        if(field.get(x+this.dx,y+this.dy)!==null){
            const o=this.dx
            this.dx=this.dy
            this.dy=-o
        }
        if(field.get(x+this.dx,y+this.dy)!==null){
            this.dx*=-1
            this.dy*=-1
        }
    }

    randomDirection(field,x,y){
        let direction=Math.floor(Math.random()*4)
        this.dx=0
        this.dy=0
        if(direction==0)this.dx=-1
        else if(direction==1)this.dx=1
        else if(direction==2)this.dy=-1
        else if(direction==3)this.dy=1
    }

    randomState(){
        let state=Math.floor(Math.random()*5)
        if(state==0)this.setState(new Cursor())
        else if(state==1)this.setState(new Waiting())
        else if(state==2)this.setState(new Grabbing())
        else if(state==3)this.setState(new Moving())
        else if(state==4)this.setState(new Pointer())
    }
}

class State{
    onStart(field,root,mouse,x,y){}
    onTick(field,root,mouse,x,y){}
    getClasses(){return ""}
}

/**
 * A wandering state
 */
class Cursor extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        mouse.escapeDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)+5
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            this.duration=Math.floor(Math.random()*10)+5
            mouse.escapeDirection(field,x,y)
            if(Math.random()>0.5)mouse.randomState()
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            let under=field.get(x+dx,y+dy)
            if(under!==undefined){
                field.swap(x,y,x+dx,y+dy)
            }
            else{
                mouse.escapeDirection(field,x,y)
            }
            this.duration--
        }
    }
}

/**
 * An interacting state
 */
class Pointer extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        mouse.agressiveDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)+5
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            this.duration=Math.floor(Math.random()*10)+5
            mouse.agressiveDirection(field,x,y)
            if(Math.random()>0.5)mouse.randomState()
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            let under=field.get(x+dx,y+dy)
            if(under!==undefined){
                if(under!=null){
                    Sounds.CLICK.play()
                    under.onTrigger(field,root,x+dx,y+dy)
                    mouse.randomState()
                }
                else{
                    field.swap(x,y,x+dx,y+dy)
                }
            }
            else{
                mouse.escapeDirection(field,x,y)
            }
            this.duration--
        }
    }

    getClasses(field,root,mouse,x,y){
        return "pointer"
    }
}

/**
 * A charging state
 */
class Waiting extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        this.duration=Math.floor(Math.random()*10)+5
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            const base=random(Object.values(BASE_SPAWNABLE)).factory(Math.round(Math.random()*1000))
            Sounds.CLICK.play()
            mouse.setState(new Grabbed(base))
        }
        this.duration--
    }

    getClasses(field,root,mouse,x,y){
        return "waiter"
    }
}

/**
 * An holding state
 */
class Grabbed extends State{
    duration=0

    constructor(base){
        super()
        this.base=base
    }

    onStart(field,root,mouse,x,y){
        mouse.escapeDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)
        mouse.base=this.base
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            this.duration=Math.floor(Math.random()*10)+5
            mouse.escapeDirection(field,x,y)
            let under=field.get(x+mouse.dx,y+mouse.dy)
            if(under===null && Math.random()>0.5){
                mouse.randomState()
                mouse.base=null
                field.set(x+mouse.dx,y+mouse.dy,this.base)
                Sounds.CLICK.play()
            }
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            let under=field.get(x+dx,y+dy)
            if(under!==undefined){
                field.swap(x,y,x+dx,y+dy)
            }
            else{
                mouse.escapeDirection(field,x,y)
            }
        }
        this.duration--
    }

    getClasses(field,root,mouse,x,y){
        return "grabbed"
    }
}

/**
 * An grabbing state
 */
class Grabbing extends State{
    duration=0

    onStart(field,root,mouse,x,y){
        mouse.agressiveDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)+2
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            mouse.randomState()
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            let under=field.get(x+dx,y+dy)
            if(under!==undefined){
                if(under!=null){
                    field.set(x+dx,y+dy,null)
                    Sounds.CLICK.play()
                    mouse.setState(new Grabbed(under))
                }
                else{
                    field.swap(x,y,x+dx,y+dy)
                }
            }
            else{
                mouse.agressiveDirection(field,x,y)
            }
        }
    }

    getClasses(field,root,mouse,x,y){
        return "grabber"
    }
}

/**
 * An state that move the world
 */
class Moving extends State{
    duration=0

    onStart(field,root,mouse,x,y){
        mouse.randomDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)+2
        Sounds.CLICK.play()
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            mouse.randomState()
        }
        else{
            mouse.offsetAll(field,x,y,mouse.dx,mouse.dy)
        }
        this.duration--
    }

    getClasses(field,root,mouse,x,y){
        return "mover"
    }
}