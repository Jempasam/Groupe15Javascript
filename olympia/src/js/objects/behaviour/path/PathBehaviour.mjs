import { Behaviour } from "../Behaviour.mjs"
import { ModelKey } from "../../world/ModelHolder.mjs"
import { ObjectQuery, World } from "../../world/World.mjs"
import { TRANSFORM } from "../../model/TransformModel.mjs"
import { PATH, PathModel } from "../../model/PathModel.mjs"
import { Vector3 } from "../../../../../../babylonjs/core/Maths/math.vector.js";
import { SCENE } from "../../model/MeshModel.mjs"

/**
 * Un behaviour de base pour la création et le maintien d'un PathModel, une carte de chemin
 */
export class PathBehaviour extends Behaviour{

    out_access_duration=0
    resize_timer=0

    /**
     * @param {Vector3} path_step
     */
    constructor(path_step){
        super()
        this.path_step=path_step
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    init(world, objects, targets, ...rest){
    }

    /** @override @type {Behaviour['open']} */
    open(world){
    }

    /** @override @type {Behaviour['close']} */
    close(world){
        world.model.remove(PATH)
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    tick(world, objects){
        const path=world.model.get(PATH)
        if(!path)this.createGrid(world,objects)
        else{

            // Up size
            path.out_access=0
            this.fillTheGrid(world,objects)
            if(path.out_access>0){
                path.out_access=0
                this.out_access_duration++
                if(this.out_access_duration>200){
                    this.out_access_duration=0
                    this.createGrid(world,objects)
                }
            }
            else this.out_access_duration=0

            // Down size
            this.resize_timer++
            if(this.resize_timer>600){
                this.resize_timer=0
                if(path.min_access.subtract(path.minimum).length() + path.max_access.subtract(path.maximum).length() > 10){
                    this.createGrid(world,objects)
                }
            }

        }
    }

    /**
     * @override
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    finish(world, objects){
    }

    /**
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    createGrid(world,objects){
        // Get min and mex
        const minimum=new Vector3(Infinity,Infinity,Infinity)
        const maximum=new Vector3(-Infinity,-Infinity,-Infinity)
        let count=0
        for(const obj of objects)obj.apply(TRANSFORM,t=>{
            const miscale=t.scale.scale(0.5)
            minimum.minimizeInPlace(t.position.subtract(miscale))
            maximum.maximizeInPlace(t.position.add(miscale))
            count++
        })
        if(count<=0)return
        minimum.subtractInPlace(this.path_step.scale(4))
        maximum.addInPlace(this.path_step.scale(4))

        // Create the grid
        const dx=Math.ceil((maximum.x-minimum.x)/this.path_step.x)
        const dy=Math.ceil((maximum.y-minimum.y)/this.path_step.y)
        const dz=Math.ceil((maximum.z-minimum.z)/this.path_step.z)
        const arrayx=new Array()
        for(let xx=0; xx<dx; xx++){
            const arrayy=new Array()
            for(let yy=0; yy<dy; yy++){
                arrayy.push(new Array(dz).fill(PathModel.EMPTY))
            }
            arrayx.push(arrayy)
        }

        const path=new PathModel(minimum,maximum,arrayx)
        world.model.set(PATH,path)
    }

    /**
     * @param {World} world
     * @param {ObjectQuery} objects
     */
    fillTheGrid(world,objects){
        const path=world.model.get(PATH)
        if(!path)return

        path.content.forEach(e=>e.forEach(e=>e.fill(PathModel.EMPTY)))
        for(const obj of objects){
            obj.apply(TRANSFORM,t=>{
                const old=path.out_access
                const min=t.position.subtract(t.scale.scale(0.5))
                const max=t.position.add(t.scale.scale(0.5))
                path.setBetween(min,max,PathModel.SOLID)
            })
        }
        //path.show(world.model.get(SCENE))
    }
}
