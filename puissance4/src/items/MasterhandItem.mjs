import { MOVING } from "../../../entity-component/src/js/object/tags.mjs";
import { random } from "../../../samlib/Array.mjs";
import { adom } from "../../../samlib/DOM.mjs";
import { observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";
import { BASE_SPAWNABLE } from "../field/collection/base_collection.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { BocalItem } from "./BocalItem.mjs";
import { BubbleItem } from "./BubbleItem.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { GoombaItem } from "./GoombaItem.mjs";
import { Class, Methods } from "./ItemUtils.mjs";
import { MeteorItem } from "./MeteorItem.mjs";
import { MoblinItem } from "./MoblinItem.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { SnakeItem } from "./SnakeItem.mjs";
import { SpawnerItem } from "./SpawnerItem.mjs";
import { TNTItem } from "./TNTItem.mjs";

export class MasterhandItem extends Item{

    /**
     * 
     */
    constructor(duration=5,speed=3){
        super()
        this.time=0
        this.dx=0
        this.dy=0
        this.state=new Moving()
        this.changed=false
        this.duration=duration
        this.speed=speed
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="masterhand ${this.state.getClasses()}">
                ${this.state?.getDisplay(...args)}
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
        if(this.time>this.speed){
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
        this.state?.rotate(field, root, x, y)
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

    move(field,x,y,dx,dy){
        let nextx=x+dx
        let nexty=y+dy
        let under=field.get(nextx,nexty)
        if(under===undefined){
            if(nextx<0)nextx+=field.width
            else if(nextx>=field.width)nextx-=field.width
            if(nexty<0)nexty+=field.height
            else if(nexty>=field.height)nexty-=field.height
        }
        field.swap(x,y,nextx,nexty)
        return [nextx,nexty]
    }
}

class State{
    onStart(field,root,mouse,x,y){}
    onTick(field,root,mouse,x,y){}
    getDisplay(...args){return null}
    rotate(...args){}
    getClasses(){return ""}
}

/**
 * A escaping state
 */
class Escaping extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        Sounds.GUITARE.play()
        mouse.randomDirection(field,x,y)
    }

    onTick(field,root,mouse,x,y){
        const dx=mouse.dx
        const dy=mouse.dy
        const under=field.get(x+dx,y+dy)
        if(under===undefined){
            field.set(x,y,null)
            Sounds.GUITARE2.play()
        }
        else{
            field.swap(x,y,x+dx,y+dy)
        }
    }

    getClasses(field,root,mouse,x,y){
        return "escaping"
    }
}

/**
 * A wandering state
 */
class Moving extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        mouse.randomDirection(field,x,y)
        this.duration=Math.floor(Math.random()*10)+5
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            this.duration=Math.floor(Math.random()*10)+5
            mouse.randomDirection(field,x,y)
            if(Math.random()>0.5)mouse.setState(new Waiting())
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            mouse.move(field,x,y,dx,dy)
            this.duration--
        }
    }
}

/**
 * A charging state
 */
class Waiting extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        this.duration=Math.floor(Math.random()*3)+5
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            const base=random(Object.values(BASE_SPAWNABLE)).factory(Math.round(Math.random()*1000))
            if(Math.random()>0.2)mouse.setState(new Drawing())
            else mouse.setState(new Shooting())
        }
        this.duration--
    }

    getClasses(field,root,mouse,x,y){
        return "closed"
    }
}

/**
 * A teleporting state
 */
class Teleporting extends State{

    duration=0

    onStart(field,root,mouse,x,y){
        this.duration=6
    }

    onTick(field,root,mouse,x,y){
        if(this.duration==3){
            let dx=Math.floor(Math.random()*field.width)
            let dy=Math.floor(Math.random()*field.height)
            field.swap(x,y,dx,dy)
            field.updateElement(x,y)
        }
        else if(this.duration<=0){
            if(Math.random()>0.5)mouse.setState(new Waiting())
            else this.duration=10
        }
        this.duration--
    }

    getClasses(field,root,mouse,x,y){
        return this.duration>3?"closed":"energized"
    }
}

/**
 * A drawing pencil
 */
class Pencil{

    /**
     * @param {Array<function(number):Item>} factories
     * @param {Array<function(Item):Item>} decorators
     */
    constructor(factories,decorators){
        // Pattern
        let a=Math.floor(Math.random()*3)+1
        let b=Math.floor(Math.random()*(a+1))
        this.pattern = (i)=> i%a<=b

        // Factory
        this.variant=Math.round(Math.random()*1000) // Variant Center
        this.variant_d=Math.max(0,Math.round(Math.random()*4)) // Variant Variation
        this.factory=random(factories).factory

        // Decorator
        this.decorator=random(decorators)
    }

    create(){
        return this.decorator(this.factory(this.variant+Math.round(Math.random()*this.variant_d)))
    }
}

/**
 * a drawing state
 */
class Drawing extends State{

    duration=0

    
    static random_pattern(){
        let a=Math.floor(Math.random()*3)+1
        let b=Math.floor(Math.random()*(a+1))
        return i => i%a<=b
    }
    
    constructor(){
        super()
        // Length of line and timing of direciton change
        this.length=Math.floor(Math.random()*8)+1
        this.rotate_moment=Math.floor(Math.random()*8)+1

        // Pattern
        this.pattern=Drawing.random_pattern()

        // Factory
        this.variant=Math.round(Math.random()*1000)
        this.variant_d=Math.max(0,Math.round(Math.random()*4))
        this.factory=random(Object.values(BASE_SPAWNABLE)).factory

        // Decorator
        switch(Math.floor(Math.random()*11)){
            case 1:
            case 3:
            case 2: // Falling
                this.decorator=a=>new MovingItem(a,0,1)
                break
            case 6: // Bocal
                this.decorator=a=>new BocalItem(a)
                break
            default: // Normal
                this.decorator=a=>a
                break
        }

        this.next=this.decorator(this.factory(this.variant))
    }

    onStart(field,root,mouse,x,y){
        mouse.randomDirection(field,x,y)
    }

    onTick(field,root,mouse,x,y){
        if(this.length<=0){
            mouse.duration--
            if(mouse.duration<=0)mouse.setState(new Escaping())
            else if(Math.random()>0.5)mouse.setState(new Teleporting())
            else mouse.setState(new Moving())
        }
        else{
            const dx=mouse.dx
            const dy=mouse.dy
            const [fx,fy]=mouse.move(field,x,y,dx,dy)
            if(field.get(x,y)===null && this.pattern(this.length)){
                const next=this.next
                field.set(x,y,next)
                Sounds.TOP.play()
                this.next=this.decorator(this.factory(this.variant+Math.round(Math.random()*this.variant_d)))
                observers(field,"on_summon").notify(root, fx, fy, next, x, y)
            }
            if(this.length==this.rotate_moment){
                let ro=Math.floor(Math.random()*2)
                if(ro==0){
                    let o=mouse.dx
                    mouse.dx=mouse.dy
                    mouse.dy=o
                }
                else{
                    let o=mouse.dx
                    mouse.dx=-mouse.dy
                    mouse.dy=o
                }
            }
            this.length--
        }
    }

    getDisplay(...args){
        return this.next.getDisplay(...args)
    }

    rotate(...args){ this?.next?.rotate(...args) }
}

/**
 * a shooting state
 */
class Shooting extends State{

    duration=0

    constructor(){
        super()
        this.duration=Math.round(Math.random()*8)
        this.factory=random(Object.values(BASE_SPAWNABLE)).factory
        this.variant=Math.round(Math.random()*1000)
    }

    onTick(field,root,mouse,x,y){
        if(this.duration<=0){
            mouse.duration--
            if(mouse.duration<=0)mouse.setState(new Escaping())
            else if(Math.random()>0.5)mouse.setState(new Teleporting())
            else mouse.setState(new Moving())
        }
        else{
            mouse.randomDirection(field,x,y)
            let under=field.get(x+mouse.dx,y+mouse.dy)
            if(under===null){
                field.set(x+mouse.dx,y+mouse.dy,new MovingItem(this.factory(this.variant),mouse.dx,mouse.dy))
            }
            this.duration--
        }
    }

    getClasses(field,root,mouse,x,y){
        return "shooting"
    }
}