import { Drawable } from "../drawable/Drawable.mjs"
import { AABB, spherePenetrationSphere, sphereTestSphere } from "./AABB.mjs"

export class Shape{

    doCollide(shape){
        throw new Error("Not implemented")
    }

    penetration(shape){
        throw new Error("Not implemented")
    }

    draw(drawable, color, height, width, depth){
        throw new Error("Not implemented")
    }

    place(x,y,z,size){
        throw new Error("Not implemented")
    }

    clone(){
        throw new Error("Not implemented")
    }

    type=0
    static SPHERE=1
    static BOX=2
}

export class CircleShape extends Shape{

    type=Shape.SPHERE

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} radius 
     */
    constructor(x,y,z,radius){
        super()
        this.x=x
        this.y=y
        this.z=z
        this.radius=radius
    }

    static create_sized(x,y,z,size){
        return new CircleShape(x, y, z, size/2)
    }

    doCollide(shape){
        switch(shape.type){
            case Shape.BOX:
                shape.aabb.testSphere(this.x, this.y, this.z, this.radius)
            case Shape.SPHERE:
                return sphereTestSphere(this.x, this.y, this.z, this.radius, shape.x, shape.y, shape.z, shape.radius)
            default:
                return shape.doCollide(this)
        }
    }

    penetration(shape){
        switch(shape.type){
            case Shape.BOX:
                let ret=shape.aabb.penetrationSphere(this.x, this.y, this.z, this.radius)
                return ret && [-ret[0], -ret[1], -ret[2]]
            case Shape.SPHERE:
                return spherePenetrationSphere(this.x, this.y, this.z, this.radius, shape.x, shape.y, shape.z, shape.radius)
            default:
                const v=shape.penetration(this)
                return v && [-v[0], -v[1], -v[2]]
        }
    }

    /**
     * 
     * @param {Drawable} drawable 
     */
    draw(drawable, color, height, width, depth){
        let th=drawable.height/height
        let tw=drawable.width/width
        let td=drawable.depth/depth
        let d=0.5+0.5/depth*this.z
        drawable.sub(
            (this.x-this.radius)*tw,
            (this.y-this.radius)*th,
            (this.z-this.radius)*td,
            this.radius*2*tw,
            this.radius*2*th,
            this.radius*2*td
        ).paintCircle([
            color[0]*d,
            color[1]*d,
            color[2]*d,
            color[3]
        ])
    }

    place(x,y,z,size){
        this.x=x
        this.y=y
        this.z=z
        this.radius=size/2
    }

    clone(){
        return new CircleShape(this.x, this.y, this.z, this.radius)
    }
}

export class BoxShape extends Shape{
    aabb=new AABB()
    type=Shape.BOX

    get x(){ return this.aabb.x }
    set x(v){ this.aabb.x=v }

    get y(){ return this.aabb.y }
    set y(v){ this.aabb.y=v }

    get z(){ return this.aabb.z }
    set z(v){ this.aabb.z=v }

    get width(){ return this.aabb.width }
    set width(v){ this.aabb.width=v }

    get height(){ return this.aabb.height }
    set height(v){ this.aabb.height=v }

    get depth(){ return this.aabb.depth }
    set depth(v){ this.aabb.depth=v }

    constructor(x, y, z, width, height, depth){
        super()
        this.aabb=new AABB(x, y, z, width, height, depth)
    }

    static create_sized(x,y,z,size){
        return new BoxShape(x-size/2, y-size/2, z-size/2, size, size, size)
    }

    doCollide(shape){
        switch(shape.type){
            case Shape.BOX:
                this.aabb.testAABB(shape.aabb)
            case Shape.SPHERE:
                return this.aabb.testSphere(shape.x, shape.y, shape.z, shape.radius)
            default:
                return shape.doCollide(this)
        }
    }

    penetration(shape){
        switch(shape.type){
            case Shape.BOX:
                return this.aabb.penetrationAABB(shape.aabb)
            case Shape.SPHERE:
                return this.aabb.penetrationSphere(shape.x, shape.y, shape.z, shape.radius)
            default:
                const v=shape.penetration(this)
                return v && [-v[0], -v[1], -v[2]]
        }
    }

    /**
     * 
     * @param {Drawable} drawable 
     */
    draw(drawable, color, height, width, depth){
        let th=drawable.height/height
        let tw=drawable.width/width
        let td=drawable.depth/depth

        if(this.aabb.z+this.aabb.depth>0 && this.aabb.z<depth){
            let d=this.aabb.z+this.aabb.depth
            d=Math.max(0, Math.min(depth, this.aabb.z+this.aabb.depth))
            d=d/depth
            drawable.sub(
                this.aabb.x*tw,
                this.aabb.y*th,
                this.aabb.z*td,
                this.aabb.width*tw,
                this.aabb.height*th,
                this.aabb.depth*td
            ).paint([
                color[0]*d,
                color[1]*d,
                color[2]*d,
                color[3]
            ])
        }
    }

    place(x,y,z,size){
        let w_to_h=this.aabb.width/this.aabb.height
        let w_to_d=this.aabb.width/this.aabb.depth
        this.aabb.width=size
        this.aabb.height=size/w_to_h
        this.aabb.depth=size/w_to_d
        this.aabb.x=x-this.aabb.width/2
        this.aabb.y=y-this.aabb.height/2
        this.aabb.z=z-this.aabb.depth/2
    }

    clone(){
        let b=this.aabb
        return new BoxShape(b.x, b.y, b.z, b.width, b.height, b.depth)
    }
}