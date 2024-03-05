
/**
 * Create a new transform
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number=} sx 
 * @param {number=} sy 
 * @param {number=} sz 
 * @param {number=} rx 
 * @param {number=} ry 
 * @param {number=} rz 
 * @returns 
 */
export function transform(x, y, z, sx, sy, sz, rx, ry, rz) {
    if(sx===undefined)sx=1;
    if(sy===undefined)sy=sx;
    if(sz===undefined)sz=sy;
    if(rx===undefined)rx=0;
    if(ry===undefined)ry=0;
    if(rz===undefined)rz=0;
    return new Transform(x, y, z, rx, ry, rz, sx, sy, sz);
}

/**
 * A transformation in 3D space.
 */
export class Transform{

    x;
    y;
    z;
    rx;
    ry;
    rz;
    sx;
    sy;
    sz;

    cosX
    sinX
    cosY
    sinY
    cosZ
    sinZ
    precalculatedLast=0
    changeLast=1

    precalculate(){
        if(this.precalculatedLast!=this.changeLast){
            this.precalculatedLast=this.changeLast
            this.cosX = Math.cos(this.rx);
            this.sinX = Math.sin(this.rx);
            this.cosY = Math.cos(this.ry);
            this.sinY = Math.sin(this.ry);
            this.cosZ = Math.cos(this.rz);
            this.sinZ = Math.sin(this.rz);
        }
    }

    constructor(x,y,z,rx,ry,rz,sx,sy,sz){
        this.x = x;
        this.y = y;
        this.z = z;

        this.rx = rx;
        this.ry = ry;
        this.rz = rz;

        this.sx = sx;
        this.sy = sy;
        this.sz = sz;
    }

    /**
     * Move the display target in part of the width, height and depth of the display.
     * @param {number} dx
     * @param {number} dy 
     * @param {number} dz 
     */
    move(dx, dy, dz) {
        if(this.rx==0 && this.ry==0 && this.rz==0){
            this.x += dx * this.sx;
            this.y += dy * this.sy;
            this.z += dz * this.sz;
            return
        }

        this.precalculate()
        
        const cosX = this.cosX;
        const sinX = this.sinX;
        const cosY = this.cosY;
        const sinY = this.sinY;
        const cosZ = this.cosZ;
        const sinZ = this.sinZ;

        const newX = this.x + (dx * cosY * cosZ - dy * (cosX * sinZ + sinX * sinY * cosZ) + dz * (sinX * sinZ - cosX * sinY * cosZ)) * this.sx;
        const newY = this.y + (dx * cosY * sinZ + dy * (cosX * cosZ - sinX * sinY * sinZ) - dz * (sinX * cosZ + cosX * sinY * sinZ)) * this.sy;
        const newZ = this.z + (dx * -sinY + dy * sinX * cosY + dz * cosX * cosY) * this.sz;

        this.x = newX;
        this.y = newY;
        this.z = newZ;
    }

    /**
     * Rotate the display target in radian
     * @param {number} rx 
     * @param {number} ry 
     * @param {number} rz 
     */
    rotate(rx, ry, rz) {
        this.rx += rx;
        this.ry += ry;
        this.rz += rz;
        this.changeLast++
    }

    /**
     * Rotate the display target around a specified point in radian
     * @param {number} rx 
     * @param {number} ry 
     * @param {number} rz 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} centerZ 
     */
    rotateAround(rx, ry, rz, centerX, centerY, centerZ) {
        this.move(centerX,centerY,centerZ)
        this.rotate(rx, ry, rz);
        this.move(-centerX,-centerY,-centerZ)
    }

    /**
     * Scale the display target, in part of the current scale
     * @param {number} sx 
     * @param {number} sy 
     * @param {number} sz 
     */
    scale(sx, sy, sz) {
        this.sx *= sx;
        this.sy *= sy;
        this.sz *= sz;
    }

    /**
     * Scale the display target around a specified point, in part of the current scale
     * @param {number} sx 
     * @param {number} sy 
     * @param {number} sz 
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} centerZ 
     */
    scaleAround(sx, sy, sz, centerX, centerY, centerZ) {
        this.move(centerX * (1 - sx), centerY * (1 - sy), centerZ * (1 - sz));
        this.scale(sx, sy, sz);
    }

    /**
     * Move this transform so that it is at the same position as the given transform in the coordinate system of this transform.
     * @param {Transform} transform
     */
    compose(transform){
        this.move(transform.x, transform.y, transform.z);
        this.rotate(transform.rx, transform.ry, transform.rz);
        this.scale(transform.sx, transform.sy, transform.sz);
    }

    /**
     * Turn this transform into the inverse transform.
     * A transformation B such that Id=A*B with A this transformation, and Id the identity transformation.
     */
    inverse(){
        this.rx = -this.rx;
        this.ry = -this.ry;
        this.rz = -this.rz;
        this.changeLast++;

        /* LOCATION */
        this.precalculate()
        let nx = (this.x * this.cosY * this.cosZ - this.y * (this.cosX * this.sinZ + this.sinX * this.sinY * this.cosZ) + this.z * (this.sinX * this.sinZ - this.cosX * this.sinY * this.cosZ)) / this.sx;
        let ny = (this.x * this.cosY * this.sinZ + this.y * (this.cosX * this.cosZ - this.sinX * this.sinY * this.sinZ) - this.z * (this.sinX * this.cosZ + this.cosX * this.sinY * this.sinZ)) / this.sy;
        let nz = (this.x * -this.sinY + this.y * this.sinX * this.cosY + this.z * this.cosX * this.cosY) / this.sz;
        this.x = -nx;
        this.y = -ny;
        this.z = -nz;

        /* SIZE */
        this.sx = 1 / this.sx;
        this.sy = 1 / this.sy;
        this.sz = 1 / this.sz;
        this.changeLast++
    }
    
    /**
     * Apply this transform to a pair point-vector.
     * and size.
     * @param {[number,number,number]} point
     */
    apply(point){
        if(this.rx!=0 || this.ry!=0 || this.rz!=0){
            this.precalculate()
            const cosX = this.cosX;
            const sinX = this.sinX;
            const cosY = this.cosY;
            const sinY = this.sinY;
            const cosZ = this.cosZ;
            const sinZ = this.sinZ;
            let nx = (point[0] * cosY * cosZ - point[1] * (cosX * sinZ + sinX * sinY * cosZ) + point[2] * (sinX * sinZ - cosX * sinY * cosZ)) * this.sx;
            let ny = (point[0] * cosY * sinZ + point[1] * (cosX * cosZ - sinX * sinY * sinZ) - point[2] * (sinX * cosZ + cosX * sinY * sinZ)) * this.sy;
            let nz = (point[0] * -sinY + point[1] * sinX * cosY + point[2] * cosX * cosY) * this.sz;
            point[0]=nx
            point[1]=ny
            point[2]=nz
        }
        else{
            point[0]*=this.sx;
            point[1]*=this.sy;
            point[2]*=this.sz;
        }
        point[0]+=this.x;
        point[1]+=this.y;
        point[2]+=this.z;
    }

    /**
     * Set as the the offset between the two transforms.
     * Set as A such as this+A=other
     * @param {Transform} other
     */
    offset(other){
        this.rx = other.rx - this.rx;
        this.ry = other.ry - this.ry;
        this.rz = other.rz - this.rz;
        this.changeLast++;

        this.x = other.x - this.x;
        this.y = other.y - this.y;
        this.z = other.z - this.z;

        this.sx = other.sx / this.sx;
        this.sy = other.sy / this.sy;
        this.sz = other.sz / this.sz;
    }

    /**
     * Clone this transform
     * @returns {Transform}
     */
    clone(){
        return new Transform(this.x, this.y, this.z, this.rx, this.ry, this.rz, this.sx, this.sy, this.sz);
    }

    /**
     * Copy the values of another transform into this transform
     * @param {Transform} other 
     */
    copy(other){
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.rx = other.rx;
        this.ry = other.ry;
        this.rz = other.rz;
        this.sx = other.sx;
        this.sy = other.sy;
        this.sz = other.sz;
        this.cosX = other.cosX;
        this.sinX = other.sinX;
        this.cosY = other.cosY;
        this.sinY = other.sinY;
        this.cosZ = other.cosZ;
        this.sinZ = other.sinZ;
    }

    /**
     * Compare this transform to another transform
     * @param {Transform} other 
     * @returns 
     */
    equals(other){
        return this.x==other.x && this.y==other.y && this.z==other.z && this.rx==other.rx && this.ry==other.ry && this.rz==other.rz && this.sx==other.sx && this.sy==other.sy && this.sz==other.sz;
    }

    
    /**
     * Get the zero transform
     * @returns {Transform}
     */
    static zero(){
        return new Transform(0,0,0,0,0,0,0,0,0);
    }

    /**
     * Get an identiy transform
     * @returns {Transform}
     */
    static identity(){
        return new Transform(0,0,0,0,0,0,1,1,1);
    }
}