

export class Transform2{
    root_x
    root_y
    root_z
    up_x
    up_y
    up_z
    forward_x
    forward_y
    forward_z
    right_x
    right_y
    right_z

    /**
     * Create a new transform
     * @param {number} root_x 
     * @param {number} root_y 
     * @param {number} root_z 
     * @param {number} up_x 
     * @param {number} up_y 
     * @param {number} up_z 
     * @param {number} forward_x 
     * @param {number} forward_y 
     * @param {number} forward_z 
     * @param {number} right_x 
     * @param {number} right_y 
     * @param {number} right_z 
     */
    constructor(root_x,root_y,root_z, up_x,up_y,up_z, forward_x,forward_y,forward_z, right_x,right_y,right_z){
        this.root_x=root_x
        this.root_y=root_y
        this.root_z=root_z
        this.up_x=up_x
        this.up_y=up_y
        this.up_z=up_z
        this.forward_x=forward_x
        this.forward_y=forward_y
        this.forward_z=forward_z
        this.right_x=right_x
        this.right_y=right_y
        this.right_z=right_z
    }

    static identity(){
        return new Transform2(0,0,0, 0,1,0, 0,0,1, 1,0,0)
    }

    /**
     * Move the transform relative to his dimensions and orientation
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    move(x,y,z){
        this.root_x+=this.right_x*x+this.up_x*y+this.forward_x*z
        this.root_y+=this.right_y*x+this.up_y*y+this.forward_y*z
        this.root_z+=this.right_z*x+this.up_z*y+this.forward_z*z
    }

    /**
     * Scale the transform relative to his current scale
     * @param {number} sx
     * @param {number} sy
     * @param {number} sz
     */
    scale(sx,sy,sz){
        this.right_x*=sx
        this.right_y*=sx
        this.right_z*=sx
        this.up_x*=sy
        this.up_y*=sy
        this.up_z*=sy
        this.forward_x*=sz
        this.forward_y*=sz
        this.forward_z*=sz
    }

    /**
     * Rotate the transform in radian
     * @param {number} rx 
     * @param {number} ry 
     * @param {number} rz 
     */
    rotate(rx,ry,rz){
        const cosx=Math.cos(rx)
        const sinx=Math.sin(rx)
        const cosy=Math.cos(ry)
        const siny=Math.sin(ry)
        const cosz=Math.cos(rz)
        const sinz=Math.sin(rz)
        this.right_x=cosy*cosz*this.right_x+cosy*sinz*this.up_x-siny*this.forward_x
        this.right_y=cosx*sinz*this.right_x+cosx*cosz*this.up_x-sinx*this.forward_x
        this.right_z=sinx*sinz*this.right_x+sinx*cosz*this.up_x+cosx*this.forward_x
        this.up_x=cosy*cosz*this.right_y+cosy*sinz*this.up_y-siny*this.forward_y
        this.up_y=cosx*sinz*this.right_y+cosx*cosz*this.up_y-sinx*this.forward_y
        this.up_z=sinx*sinz*this.right_y+sinx*cosz*this.up_y+cosx*this.forward_y
        this.forward_x=cosy*cosz*this.right_z+cosy*sinz*this.up_z-siny*this.forward_z
        this.forward_y=cosx*sinz*this.right_z+cosx*cosz*this.up_z-sinx*this.forward_z
        this.forward_z=sinx*sinz*this.right_z+sinx*cosz*this.up_z+cosx*this.forward_z
        
    }
}