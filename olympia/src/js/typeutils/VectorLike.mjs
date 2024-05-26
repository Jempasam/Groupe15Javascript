

/**
 * @typedef {Vector3|[number,number,number]} VectorLike
 */
import { GetInternalFormatFromBasisFormat, Vector3 } from "../../../../babylonjs/core/index.js";


/**
 * @overload
 * @param {VectorLike} vector_like
 * @returns {Vector3}
 */
/**
 * @overload
 * @param {VectorLike?} vector_like
 * @returns {Vector3?}
 */
/**
 * @overload
 * @param {VectorLike=} vector_like
 * @returns {Vector3=}
 */
export function fromVectorLike(vector_like){
    if(vector_like===null)return null
    if(vector_like===undefined)return undefined
    if(Array.isArray(vector_like))return new Vector3(vector_like[0],vector_like[1],vector_like[2])
    return vector_like
}
