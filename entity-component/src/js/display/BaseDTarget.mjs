import { Transform } from "../transform/Transform.mjs";
import { DTarget } from "./Display.mjs";

export class BaseDTarget extends DTarget{
    
    #stack=[]
    #transform
    
    get transform(){
        return this.#transform
    }

    /**
     * @param {Transform} transform 
     */
    constructor(transform){
        super();
        this.#transform=transform
    }


    /**
     * Save the current state of the display target
     */
    push(){
        this.#stack.push(this.#transform.clone())
    }

    /**
     * Restore the last saved state of the display target
     */
    pop(){
        const state=this.#stack.pop()
        if(!state)throw new Error("No state to pop")
        this.#transform=state
    }
}