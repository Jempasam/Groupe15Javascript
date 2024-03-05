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

    /* -- NEAREST A FOR A -- */
    /** @type {[number,number,number]} */
    let bCenterForA=[0.5,0.5,0.5];
    transform.apply(bCenterForA);

    let aCenterNearestForA=bounda.getNearestPoint(bCenterForA);

    /** @type {[number,number,number]} */
    let aCenterNearestForB=[...aCenterNearestForA]
    inversed.apply(aCenterNearestForB)

    let bNearestForB=boundb.getNearestPoint(aCenterNearestForB)
    /** @type {[number,number,number]} */
    let bNearestForA=[...bNearestForB]
    transform.apply(bNearestForA)

    /** @type {[number,number,number]} */
    let aCenterForB=[0.5, 0.5, 0.5]
    inversed.apply(aCenterForB);

    let bCenterNearestForB=boundb.getNearestPoint(aCenterForB);

    /** @type {[number,number,number]} */
    let bCenterNearestForA=[...bCenterNearestForB];
    transform.apply(bCenterNearestForA);

    let aNearestForA=bounda.getNearestPoint(bCenterNearestForA);

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
        (0.5-aCenterNearestForA[0])**2+
        (0.5-aCenterNearestForA[1])**2+
        (0.5-aCenterNearestForA[2])**2
    
    let distanceBCenterBNearest=
        (bCenterForA[0]-bCenterNearestForA[0])**2+
        (bCenterForA[1]-bCenterNearestForA[1])**2+
        (bCenterForA[2]-bCenterNearestForA[2])**2
    
    if(distanceACenterBNearest<distanceACenterANearest || distanceBCenterANearest<distanceBCenterBNearest){
        let depthA=distanceACenterBNearest-distanceACenterANearest;
        let depthB=distanceBCenterANearest-distanceBCenterBNearest;
        let bNormal=boundb.getNormal(bNearestForB);
        inversed.inverse()
        inversed.x=0
        inversed.y=0
        inversed.z=0
        inversed.sx=1
        inversed.sy=1
        inversed.sz=1
        inversed.apply(bNormal);
        let aNormal=bounda.getNormal(aNearestForA);
        bNormal[0]*=depthB
        bNormal[1]*=depthB
        bNormal[2]*=depthB
        aNormal[0]*=depthA
        aNormal[1]*=depthA
        aNormal[2]*=depthA
        return [aNearestForA,bNearestForA,bCenterForA,aNormal,bNormal]
    }
    else{
        return false
    }
}

/**
 * Test if the bound is colliding with another bound.
 * The transform is the transform of the other bounds relative to this bound.
 * @param {Bound} bounda
 * @param {Transform} transform
 * @param {Bound} boundb
 */
export function collide(bounda, transform, boundb){
    const inversed=transform.clone();
    inversed.inverse()

    /* -- NEAREST A FOR A -- */
    /** @type {[number,number,number]} */
    let bCenterForA=[0.5,0.5,0.5];
    transform.apply(bCenterForA);

    let aCenterNearestForA=bounda.getNearestPoint(bCenterForA);

    /** @type {[number,number,number]} */
    let aCenterNearestForB=[...aCenterNearestForA]
    inversed.apply(aCenterNearestForB)

    let bNearestForB=boundb.getNearestPoint(aCenterNearestForB)
    /** @type {[number,number,number]} */
    let bNearestForA=[...bNearestForB]
    transform.apply(bNearestForA)

    /** @type {[number,number,number]} */
    let aCenterForB=[0.5, 0.5, 0.5]
    inversed.apply(aCenterForB);

    let bCenterNearestForB=boundb.getNearestPoint(aCenterForB);

    /** @type {[number,number,number]} */
    let bCenterNearestForA=[...bCenterNearestForB];
    transform.apply(bCenterNearestForA);

    let aNearestForA=bounda.getNearestPoint(bCenterNearestForA);

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
        (0.5-aCenterNearestForA[0])**2+
        (0.5-aCenterNearestForA[1])**2+
        (0.5-aCenterNearestForA[2])**2
    
    let distanceBCenterBNearest=
        (bCenterForA[0]-bCenterNearestForA[0])**2+
        (bCenterForA[1]-bCenterNearestForA[1])**2+
        (bCenterForA[2]-bCenterNearestForA[2])**2
    
    if(distanceACenterBNearest<distanceACenterANearest || distanceBCenterANearest<distanceBCenterBNearest){
        let depthA=distanceACenterBNearest-distanceACenterANearest;
        let depthB=distanceBCenterANearest-distanceBCenterBNearest;
        let bNormal=boundb.getNormal(bNearestForB);
        inversed.inverse()
        inversed.x=0
        inversed.y=0
        inversed.z=0
        inversed.sx=1
        inversed.sy=1
        inversed.sz=1
        
        let aNormal=bounda.getNormal(aNearestForA);
        bNormal[0]*=depthB
        bNormal[1]*=depthB
        bNormal[2]*=depthB
        inversed.apply(bNormal);
        aNormal[0]*=depthA
        aNormal[1]*=depthA
        aNormal[2]*=depthA

        return [aNearestForA,bNearestForA,aNormal,bNormal]
    }
    else{
        return false
    }
}