
/**
 * A Bound is a shape that is used to detect collisions between objects.
 * You can give it a direction vector and get:
 * - the point of the bound border that is on the line passing by the center of the bound and with the given direction
 * - the normal of the bound border at this point
 */
export class Bound{

    /**
     * Get nearest point of the bound border from a given point
     * @param {[number,number,number]} point
     * @returns {[number,number,number]}
     */
    getNearestPoint(point){
        throw new Error('Not implemented');
    }

    /**
     * Get the normal of the bound border of a given point of the bound border
     * @param {[number,number,number]} point
     * @returns {[number,number,number]}
     */
    getNormal(point){
        throw new Error('Not implemented');
    }
}