// @ts-nocheck 

/*
 * Des extensions pour les tableaux
 */

/**
 * Ajoute tout les éléments d'un iterable à celui-ci
 * @memberof Array
 * @instance
 * @param {Iterable} a 
 */
Array.prototype.pushAll = function(a) 
{
    for (let x of a)this.push(x);
    return this;
};

/**
 * Supprime tout les éléments d'un iterable de celui-ci
 * @memberof Array
 * @instance
 * @param {Iterable} a
 */
Array.prototype.removeAll = function(a){
    for (let x of a) this.remove(x);
    return this;
}

/**
 * @param {Array}
 */
export function random(array){
    return array[Math.floor(Math.random()*array.length)]
}

/**
 * 
 * @param {Array} array 
 * @param {number} index 
 */
export function roundGet(array,index){
    return array[index%array.length]
}

/**
 * Supprime un élément rapidement (sans conserver l'ordre)
 * @memberof Array
 * @instance
 * @param {number} index 
 */
Array.prototype.fastRemove = function fastDelete(index){
    this[index]=this[array.length-1]
    array.pop()
}

/**
 * Supprime un élément rapidement (sans conserver l'ordre)
 * @param {Array} array
 * @param {number} index 
 */
export function fastRemove(array,index){
    array[index]=array[array.length-1]
    array.pop()
}
