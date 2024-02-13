import { DTarget } from "./Display.mjs";

export class BaseDTarget extends DTarget{
    #stack=[]
    _x;
    _y;
    _z;
    _rx;
    _ry;
    _rz;
    _sx;
    _sy;
    _sz;
    constructor(x,y,z,rx,ry,rz,sx,sy,sz){
        super();
        this._x = x;
        this._y = y;
        this._z = z;
        this._rx = rx;
        this._ry = ry;
        this._rz = rz;
        this._sx = sx;
        this._sy = sy;
        this._sz = sz;
    }

    move(dx, dy, dz) {
        if(this._rx==0 && this._ry==0 && this._rz==0){
            this._x += dx * this._sx;
            this._y += dy * this._sy;
            this._z += dz * this._sz;
            return
        }
        
        const cosX = Math.cos(this._rx);
        const sinX = Math.sin(this._rx);
        const cosY = Math.cos(this._ry);
        const sinY = Math.sin(this._ry);
        const cosZ = Math.cos(this._rz);
        const sinZ = Math.sin(this._rz);

        const newX = this._x + (dx * cosY * cosZ - dy * (cosX * sinZ + sinX * sinY * cosZ) + dz * (sinX * sinZ - cosX * sinY * cosZ)) * this._sx;
        const newY = this._y + (dx * cosY * sinZ + dy * (cosX * cosZ - sinX * sinY * sinZ) - dz * (sinX * cosZ + cosX * sinY * sinZ)) * this._sy;
        const newZ = this._z + (dx * -sinY + dy * sinX * cosY + dz * cosX * cosY) * this._sz;

        this._x = newX;
        this._y = newY;
        this._z = newZ;
    }

    rotate(rx, ry, rz) {
        this._rx += rx;
        this._ry += ry;
        this._rz += rz;
    }

    rotateAround(rx, ry, rz, px, py, pz) {
        this.move(px,py,pz)
        this.rotate(rx, ry, rz);
        this.move(-px,-py,-pz)
    }

    scale(sx, sy, sz) {
        this._sx *= sx;
        this._sy *= sy;
        this._sz *= sz;
    }

    
    scaleAround(sx, sy, sz, px, py, pz) {
        this.move(px * (1 - sx), py * (1 - sy), pz * (1 - sz));
        this.scale(sx, sy, sz);
    }

    /**
     * Save the current state of the display target
     */
    push(){
        this.#stack.push([this._x, this._y, this._z, this._rx, this._ry, this._rz, this._sx, this._sy, this._sz])
    }

    /**
     * Restore the last saved state of the display target
     */
    pop(){
        const state=this.#stack.pop()
        if(!state)throw new Error("No state to pop")
        this._x=state[0]
        this._y=state[1]
        this._z=state[2]
        this._rx=state[3]
        this._ry=state[4]
        this._rz=state[5]
        this._sx=state[6]
        this._sy=state[7]
        this._sz=state[8]
    }
}