import { ModelKey } from "../world/ModelHolder.mjs"

export class LivingModel{

    /** @param {number=} life */
    constructor(life=1){
        this.#life=life
        this._previous_life=life
        this.invulnerability=0
    }

    _previous_life=0

    #life

    #damaged=false

    armor=1.0

    get life(){ return this.#life }

    /** @param {number} value */
    set life(value){
        this.#life=value
        if(this.#life<=0)this.#life=0
    }

    /**
     * @param {number} amount
     * @returns {boolean}
     */
    damage(amount){
        if(this.invulnerability>0)return false
        this.life-=Math.round(amount*this.armor)
        this.#damaged=true
        this.invulnerability=20
        return true
    }

    get damaged(){ return this.#damaged }

    get model_key(){ return LIVING }
}

/** @type {ModelKey<LivingModel>} */
export const LIVING=new ModelKey("living")