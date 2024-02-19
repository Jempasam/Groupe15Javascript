
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
        
        const cosX = Math.cos(this.rx);
        const sinX = Math.sin(this.rx);
        const cosY = Math.cos(this.ry);
        const sinY = Math.sin(this.ry);
        const cosZ = Math.cos(this.rz);
        const sinZ = Math.sin(this.rz);

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
        this.x=-this.x;
        this.y=-this.y;
        this.z=-this.z;
        this.rx=-this.rx;
        this.ry=-this.ry;
        this.rz=-this.rz;
        this.sx=1/this.sx;
        this.sy=1/this.sy;
        this.sz=1/this.sz;
    }

    /**
     * Clone this transform
     * @returns {Transform}
     */
    clone(){
        return new Transform(this.x, this.y, this.z, this.rx, this.ry, this.rz, this.sx, this.sy, this.sz);
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