
/**
 * Remove efficiently an element from an array without preserving order
 * @template T
 * @param {T[]} array 
 * @param {number} index 
 */
export function fastDelete(array,index){
    array[index]=array[array.length-1]
    array.pop()
}