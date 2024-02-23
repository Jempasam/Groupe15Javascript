import { BaseDTarget } from "./BaseDTarget.mjs";
import { DShape, DShapeDef } from "./Display.mjs";
import "babylonjs";


/**
 * @template T
 */
class ObjectPool{
    
    /** @type {T[]} */ #pool
    
    /** @type {number} */ #count

    /** @type {function(): T} */ #factory

    /** @type {function(T): void} */ #destructor


    /**
     * @param {function(): T} factory
     * @param {function(T): void} destructor
     */
    constructor(factory,destructor){
        this.#pool=new Array()
        this.#count=0
        this.#factory=factory
        this.#destructor=destructor
    }

    /**
     * Deallocate all objects
     */
    reset(){
        const count=this.#pool.length-this.#count
        for(let i=0; i<count; i++){
            const removed=this.#pool[this.#pool.length-1]
            this.#destructor(removed)
            this.#pool.pop()
        }        
        this.#count=0
    }

    /**
     * Get a new object from the pool
     * @returns {T}
     */
    get(){
        let obj
        if(this.#count>=this.#pool.length){
            obj=this.#factory()
            this.#pool.push(obj)
        }
        else obj=this.#pool[this.#count]
        this.#count++
        return obj
    }
}

/**
 * Represents a canvas display target for rendering objects.
 * @extends BaseDTarget
 */
export default class BabylonJSDTarget extends BaseDTarget {

    /** @type {Object.<number,ObjectPool>} */
    #object_pools

    #scene
    #engine

    constructor(parent_canvas, transform) {
        super(transform);

        if(parent_canvas instanceof BabylonJSDTarget){
            this.#engine = parent_canvas.#engine
            this.#scene = parent_canvas.#scene
            this.#object_pools = parent_canvas.#object_pools
        }
        else{
            this.#engine=new BABYLON.Engine(parent_canvas,true)
            this.#scene = new BABYLON.Scene(this.#engine);
            this.#object_pools = {}

            // Camera
            let sy=transform.sy
            let sx=transform.sx
            let sz=transform.sz
            const camera = new BABYLON.ArcRotateCamera("cam", 0, 0, sy*2, new BABYLON.Vector3(sx/2, sy/2, -sz), this.#scene);
            camera.setTarget(new BABYLON.Vector3(sx/2, sy/2, sz/2));
            camera.attachControl(parent_canvas, true);
            const ssao = new BABYLON.SSAO2RenderingPipeline("ssao",this.#scene, 0.75,[camera])

            
            // Light
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.#scene);
            light.intensity = 0.7;

            // Our built-in 'ground' shape.
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:sx, height:sy}, this.#scene);
            ground.position.x=sx/2
            ground.position.y=0
            ground.position.z=sz/2

            const back = BABYLON.MeshBuilder.CreateGround("ground", {width:sx, height:sy}, this.#scene);
            back.position.z=sy/2+sz/2
            back.position.y=sy/2
            back.position.x=sx/2
            back.rotation.x=-Math.PI/2

            transform.scale(1,-1,1)
            transform.move(0,-1,0)
        }
    }

    /**
     * 
     * @param {DShape} object 
     */
    draw(object) {
        let factory
        let id=object.id
        if(object["getBabylonModel"]){
            factory=()=>{return object["getBabylonModel"](this.#scene)}
        }
        else{
            switch(object.defaultShape()){
                case DShapeDef.BOX:
                    factory=(scene)=>{
                        let color=object.defaultColor()
                        let model=BABYLON.MeshBuilder.CreateBox("baseBox", {size: 1}, scene)
                        model.material=new BABYLON.StandardMaterial("baseBox", scene)
                        model.material.diffuseColor=new BABYLON.Color3(color[0]/255,color[1]/255,color[2]/255)
                        model.isVisible=false
                        return model
                    }
                    break;
                case DShapeDef.SPHERE:
                    factory=(scene)=>{
                        let color=object.defaultColor()
                        let model=BABYLON.MeshBuilder.CreateSphere("baseSphere", {diameter: 1, segments: 10}, scene)
                        model.material=new BABYLON.StandardMaterial("baseSphere", scene)
                        model.material.diffuseColor=new BABYLON.Color3(color[0]/255,color[1]/255,color[2]/255)
                        model.isVisible=false
                        return model
                    }
                    break;
                default:
                    throw new Error("Unknown shape")
            }
        }
        this.#putObj(id, factory)
    }

    #putObj(id, factory){
        let pool=this.#object_pools[id]
        if(!pool){
            let model=factory(this.#scene)
            model.setPivotPoint(new BABYLON.Vector3(-1/2,-1/2,-1/2))
            pool=new ObjectPool(
                ()=>{
                    return model.createInstance("child")
                },
                (obj)=>{
                    obj.dispose()
                }
            )
            this.#object_pools[id]=pool
        }
        let obj=pool.get()
        obj.position.x=this.transform.x
        obj.position.y=this.transform.y
        obj.position.z=this.transform.z
        obj.scaling.x=this.transform.sx
        obj.scaling.y=this.transform.sy
        obj.scaling.z=this.transform.sz
        obj.rotation.x=this.transform.rx
        obj.rotation.y=this.transform.ry
        obj.rotation.z=this.transform.rz
    }
    
    start(){

    }

    end(){
        for(let kpool in this.#object_pools){
            let pool=this.#object_pools[kpool]
            pool.reset()
        }
        this.#scene.render();
    }
    
    clone(){
        return new BabylonJSDTarget(this, this.transform.clone());
    }
}