import { Drawable } from "./Drawable.mjs"
import { defined } from "../lang/Utils.mjs"

import "babylonjs"

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

export class BabylonJSDrawable extends Drawable{

    #spheres

    #boxs

    get width(){ return this._width }

    get height(){ return this._height }

    get depth(){ return this._depth }


    /**
     * Create a drawable from a canvas
     * @param {HTMLCanvasElement} canvas
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [z]
     * @param {number} [width]
     * @param {number} [height]
     * @param {number} [depth]
     */
    constructor(canvas, x, y, z, width, height, depth){
        super()
        defined(canvas)
        if(canvas instanceof BabylonJSDrawable){
            this.scene=canvas.scene
            this.engine=canvas.engine
            this.#spheres=canvas.#spheres
            this.#boxs=canvas.#boxs
            this.x=x
            this.y=y
            this.z=z
            this._width=defined(width)
            this._height=defined(height)
            this._depth=defined(depth)
        }
        else{
            this.x=-width/2
            this.y=-height/2
            this.z=-depth/2
            this._width=width
            this._height=height
            this._depth=depth

            this.engine=new BABYLON.Engine(canvas,true)
            this.scene = new BABYLON.Scene(this.engine);
            //this.scene.debugLayer.show();
            
            // -- SPHERE INSTANCE -- //
            this.sphere=BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 10}, this.scene)
            this.sphere.material=new BABYLON.StandardMaterial("sphere", this.scene)
            this.sphere.registerInstancedBuffer("color", 3);
            this.sphere.isVisible=false
            this.#spheres=new ObjectPool(
                ()=>{
                    return this.sphere.createInstance("sphere")
                },
                (obj) => {
                    obj.dispose()
                }
            )

            // -- BOX INSTANCE -- //
            this.box=BABYLON.MeshBuilder.CreateBox("box", {size: 1}, this.scene)
            this.box.material=new BABYLON.StandardMaterial("box", this.scene)
            this.box.registerInstancedBuffer("color", 3);
            this.box.isVisible=false
            this.#boxs=new ObjectPool(
                ()=>{
                    return this.box.createInstance("box")
                },
                (obj) => {
                    obj.dispose()
                }
            )

            //this.scene.debugLayer.show();

            // Camera
            const camera = new BABYLON.ArcRotateCamera("cam", 0, 0, 0, new BABYLON.Vector3(0, height/2, -depth*1.5), this.scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, true);
            const ssao = new BABYLON.SSAO2RenderingPipeline("ssao",this.scene, 0.75,[camera])

            
            // Light
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.7;

            // Our built-in 'ground' shape.
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width, height}, this.scene);
            ground.position.y=-height/2

            const back = BABYLON.MeshBuilder.CreateGround("ground", {width, height}, this.scene);
            back.position.z=height/2
            back.rotation.x=-Math.PI/2
        }
    }

    /**
     * @inheritDoc
     */
    draw(image){
        //this.canvas.drawImage(image,this.x,this.y,this.width,this.height)
    }

    /** @inheritdoc */
    paint(color){
        let box=this.#boxs.get()
        box.instancedBuffers.color = new BABYLON.Color3(color[0]/255, color[1]/255, color[2]/255);
        box.position= new BABYLON.Vector3(this.x+this.width/2, -(this.y+this.height/2), this.z+this.depth/2)
        box.scaling=new BABYLON.Vector3(this.width, this.height, this.depth)
    }

    /** @inheritdoc */
    paintCircle(color) {
        let sphere=this.#spheres.get()
        sphere.instancedBuffers.color = new BABYLON.Color3(color[0]/255, color[1]/255, color[2]/255);
        sphere.position= new BABYLON.Vector3(this.x+this.width/2, -(this.y+this.height/2), this.z+this.depth/2)
        sphere.scaling=new BABYLON.Vector3(this.width, this.height, this.depth)
    }

    /** @inheritdoc */
    clear(){
        this.#spheres.reset()
        this.#boxs.reset()
        this.scene.render();
    }
    
    /** @inheritdoc */
    sub(x,y,z,width,height,depth){
        if(width>this.width-x)width=this.width-x
        if(height>this.height-y)height=this.height-y
        if(depth>this.depth-z)depth=this.depth-z

        if(x<0){
            width+=x
            x=0
        }
        if(y<0){
            height+=y
            y=0
        }
        if(z<0){
            depth+=z
            z=0
        }
        return new BabylonJSDrawable(this, this.x+x, this.y+y, this.z+z, width, height, depth)
    }
}