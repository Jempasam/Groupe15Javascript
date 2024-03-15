import { adom } from "../../../samlib/DOM.mjs";
import { Item } from "../field/Item.mjs";
import { Sounds } from "../sounds/SoundBank.mjs";
import { BubbleItem } from "./BubbleItem.mjs";
import { CoinItem } from "./CoinItem.mjs";
import { Class } from "./ItemUtils.mjs";
import { MeteorItem } from "./MeteorItem.mjs";
import { MoblinItem } from "./MoblinItem.mjs";
import { MovingItem } from "./MovingItem.mjs";
import { TNTItem } from "./TNTItem.mjs";

export class LynelItem extends Item{
    /**
     * 
     * @param {Item?} base 
     */
    constructor(base=null,life=2){
        super()
        this.base=base
        this.time=0
        this.dx=0
        this.dy=0
        this.duration=0
        this.attack_time=0
        this.life=life
    }

    getDisplay(...args){
        return adom/*html*/`
            <div class="lynel ${this.attack_time>0?"_attack":""} _life${this.life} ${Class.direction(this.dx,this.dy)}">
                ${this.base?.getDisplay(...args)}
            </div>
        `
    }

    onAdd(field,root,x,y){
        field.schedule(x,y,root)
    }

    onTrigger(field,root,x,y){
        this.life--
        if(this.life==0)field.set(x,y,this.base)
        else field.updateElement(x,y)
    }

    onTick(field,root,x,y){
        this.time++
        if(this.time>7){
            // While in attack
            if(this.attack_time>0){
                if(this.attack_time==2){
                    for(let dx=-1; dx<=1; dx++){
                        for(let dy=-1; dy<=1; dy++){
                            if(dx===0 && dy===0)continue
                            field.set(x+dx, y+dy, null)
                        }
                    }
                }
                this.attack_time--
                if(this.attack_time<=0)field.updateElement(x,y)
            }
            // Action change
            else if(this.duration<=0){
                const action=Math.floor(Math.random()*6)
                const direction=Math.floor(Math.random()*4)
                this.duration=1
                
                // Get direction
                this.dx=0
                this.dy=0
                if(direction==0)this.dx=1
                else if(direction==1)this.dx=-1
                else if(direction==2)this.dy=1
                else this.dy=-1
                const target=field.get(x+this.dx,y+this.dy)
                if(target!==null){
                    this.dx*=-1
                    this.dy*=-1
                }

                switch(action){
                    case 0: // Move
                    case 1:
                        this.duration=Math.random()*8
                        break
                    case 2: // Throw or Take
                    case 3:
                        if(this.base){
                            const already=field.get(x+this.dx,y+this.dy)
                            if(already!==undefined){
                                const object=Math.floor(Math.random()*4)
                                let item
                                switch(object){
                                    case 0:
                                    case 1:
                                    case 2:
                                        item=new MovingItem(this.base,this.dx,this.dy)
                                        break
                                    case 3:
                                        item=new MeteorItem(this.base,this.dx,this.dy)
                                        break

                                }
                                field.set(x+this.dx,y+this.dy,item)
                                this.base=already
                            }
                        }
                        else{
                            let taken=[field.get(x+1,y+0),x+1,y+0]
                            taken=taken[0] ?? [field.get(x-1,y+0),x-1,y+0]
                            taken=taken[0] ?? [field.get(x+0,y+1),x+0,y+1]
                            taken=taken[0] ?? [field.get(x+0,y-1),x+0,y-1]
                            if(taken[0]){
                                field.set(taken[1],taken[2],null)
                                this.base=taken[0]
                            }
                            else{
                                const object=Math.floor(Math.random()*3)
                                switch(object){
                                    case 0: this.base=new TNTItem(); break
                                    case 1: this.base=new MoblinItem(); break
                                    case 2: this.base=new BubbleItem(); break
                                }
                            }
                        }
                        field.updateElement(x,y)
                        break
                    case 4: // Attack
                        Sounds.SWORD.play()
                        this.attack_time=2
                        field.updateElement(x,y)
                        break
                    case 5: // Meteor Charge
                        Sounds.DRAGON.play()
                        field.set(x,y,new MeteorItem(root,this.dx,this.dy))
                }
                
            }
            else if(this.dx!=0 || this.dy!=0){
                let facing=field.get(x+this.dx,y+this.dy)
                if(facing!==null){
                    if(facing!==undefined){
                        facing.onTrigger(field,root,x+this.dx,y+this.dy)
                    }
                    this.dx=-this.dx
                    this.dy=-this.dy
                }
                else field.swap(x,y, x+this.dx,y+this.dy)
            }
            this.duration--
            this.time=0
        }
        field.schedule(x,y,root)
    }
}