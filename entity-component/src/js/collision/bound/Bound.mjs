import { Transform } from "../../transform/Transform.mjs";

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

/**
 * Get closest point of the bound to a given point in a give space defined by a transform.
 * The point is muted.
 * @param {Bound} bound 
 * @param {Transform} transform 
 * @param {[number,number,number]} point 
 */
function closestTo(bound, transform, point){
    let nearest_point=bound.getNearestPoint(point);

}

/**
 * Get the nearest point of a from a point of the bound b with an offset of transform
 * The point given is mutated.
 * @param {Bound} a 
 * @param {Transform} transform
 * @param {Transform} inversed The inverse of transform
 * @param {[number,number,number]} point
 */
function distanceToCenter(a, transform, inversed, b, point){
    transform.apply(point);
    let nearest_point=a.getNearestPoint(point);
    inversed.apply(nearest_point);
    return nearest_point;
}

/**
 * Test if the bound is colliding with another bound.
 * The transform is the transform of the other bounds relative to this bound.
 * @param {Bound} bounda
 * @param {Transform} transform
 * @param {Bound} boundb
 */
export function doCollide(bounda, transform, boundb){
    const inversed=transform.clone();
    inversed.inverse()

    // Get border point of A bound to B bound center
    /** @type {[number,number,number]} */
    let bCenterForA=[0.5,0.5,0.5];
    transform.apply(bCenterForA);
    let aNearestForA=bounda.getNearestPoint(bCenterForA);

    // Get border point of B bound to A bound nearest point
    /** @type {[number,number,number]} */
    let aNearestForB=[aNearestForA[0],aNearestForA[1],aNearestForA[2]];
    inversed.apply(aNearestForB);
    let bNearestForA=boundb.getNearestPoint(aNearestForB);
    transform.apply(bNearestForA);

    // Distance between borders
    let distanceACenterBNearest=
        (0.5-bNearestForA[0])**2+
        (0.5-bNearestForA[1])**2+
        (0.5-bNearestForA[2])**2
    
    let distanceBCenterANearest=
        (bCenterForA[0]-aNearestForA[0])**2+
        (bCenterForA[1]-aNearestForA[1])**2+
        (bCenterForA[2]-aNearestForA[2])**2
    
    let distanceACenterANearest=
        (0.5-aNearestForA[0])**2+
        (0.5-aNearestForA[1])**2+
        (0.5-aNearestForA[2])**2
    
    let distanceBCenterBNearest=
        (bCenterForA[0]-bNearestForA[0])**2+
        (bCenterForA[1]-bNearestForA[1])**2+
        (bCenterForA[2]-bNearestForA[2])**2
    
    if(distanceACenterBNearest<distanceACenterANearest || distanceBCenterANearest<distanceBCenterBNearest){
        return [aNearestForA,bNearestForA,bCenterForA]
    }
    else{
        return false
    }
}