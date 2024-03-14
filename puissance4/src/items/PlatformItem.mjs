import { Item } from "../field/Item.mjs";

export class PlatformItem extends Item{
    
    constructor(){
        super()
    }

    getClasses(){
        return ["platform"]
    }
}

export class WallItem extends PlatformItem{
    
    constructor(){
        super()
    }

    getClasses(){
        return ["wall"]
    }
}