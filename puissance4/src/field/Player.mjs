import { Item } from "./Item.mjs";

export class Player{

    /**
     * 
     * @param {string} name 
     * @param {function(void):Item} factory 
     * @param {number} x 
     * @param {number} y 
     * @param {{
     *  left:string,
     *  right:string,
     *  up:string,
     *  down:string,
     *  spawn:string,
     *  speed:number
     * }} options
     */
    constructor(name, factory, x, y, options){
        this.name = name;
        this.factory = factory;
        this.left=options.left
        this.right=options.right
        this.up=options.up
        this.down=options.down
        this.spawn=options.spawn
        this.speed=options.speed || 20
    }

    createItem(){
        return this.factory();
    }
}