

/**
 * @template T
 */
export class FriendlyIterable{

    /**
     * Create a friendly iterator
     * @param {Iterable<T>} iterable 
     */
    constructor(iterable){
        this.iterable=iterable
    }

    /**
     * Find the first element that matches the predicate
     * @param {(value:T,index:number)=>boolean} predicate
     * @returns {T=}
     */
    find(predicate){
        let index=0
        for(const value of this.iterable){
            if(predicate(value,index)){
                return value
            }
            index++
        }
        return undefined
    }

    /**
     * Find the first element that matches the predicate
     * @param {(value:T,index:number)=>boolean} predicate
     * @returns {boolean}
     */
    all(predicate){
        let index=0
        for(const value of this.iterable){
            if(!predicate(value,index))return false
            index++
        }
        return true
    }

    /**
     * Find the first element that matches the predicate
     * @param {(value:T,index:number)=>boolean} predicate
     * @returns {boolean}
     */
    any(predicate){
        let index=0
        for(const value of this.iterable){
            if(predicate(value,index))return true
            index++
        }
        return false
    }

    /**
     * Find the first element that matches the predicate
     * @param {(value:T,index:number)=>void} action
     */
    forEach(action){
        let index=0
        for(const value of this.iterable){
            action(value,index)
            index++
        }
    }

    /**
     * Find the maximum element
     * @param {(a:T, b:T, ai:number, bi:number)=>number} comparator
     * @returns {T=}
     */
    max(comparator){
        let max=undefined
        let max_index=0
        let index=0
        for(const value of this.iterable){
            if(max===undefined || comparator(value,max,index,max_index)>0){
                max=value
                max_index=index
            }
            index++
        }
        return max
    }

    /**
     * Find the minimum element
     * @param {(a:T, b:T, ai:number, bi:number)=>number} comparator
     * @returns {T=}
     */
    min(comparator){
        return this.max((a,b,ai,bi)=>-comparator(a,b,ai,bi))
    }

    /**
     * Find the maximum element comparing a number value given by the mapper
     * @param {(value:T,index:number)=>number} mapper
     * @returns {T=}
     */
    maxBy(mapper){
        return this.max((a,b,ai,bi)=>mapper(a,ai)-mapper(b,bi))
    }

    /**
     * Find the minimum element comparing a number value given by the mapper
     * @param {(value:T,index:number)=>number} mapper
     * @returns {T=}
     */
    minBy(mapper){
        return this.min((a,b,ai,bi)=>mapper(a,ai)-mapper(b,bi))
    }

    /**
     * Decorate the FriendlyIterator with a iterator decorator
     * @template U
     * @param {(from:Iterator<T>)=>Iterator<U>} decorator
     * @returns {FriendlyIterable<U>}
     */
    decorate(decorator){
        const original=this.iterable
        return new FriendlyIterable({
            [Symbol.iterator]: () => decorator(original[Symbol.iterator]())
        })
    }

    /**
     * Obtain a FriendlyIterable containing the mapped values of this iterable
     * @template U
     * @param {(value:T)=>U} mapper
     * @returns {FriendlyIterable<U>}
     */
    map(mapper){
        return this.decorate(from=>({
            /** @returns {IteratorResult<U>} */
            next(){
                const {value,done}=from.next()
                if(done)return {value:null, done:true}
                else return {value: mapper(value), done:false}
            }
        }))
    }

    /**
     * Obtain a FriendlyIterable containing the filtered values of this iterable
     * @param {(value:T)=>boolean} predicate
     * @returns {FriendlyIterable<T>}
     */
    filter(predicate){
        return this.decorate(from=>({
            /** @returns {IteratorResult<T>} */
            next(){
                let result
                while(true){
                    result=from.next()
                    if(result.done || predicate(result.value))break
                }
                return result
            }
        }))
    }

    /**
     * Collect the values of this iterable into an array
     */
    collect(){
        return Array.from(this.iterable)
    }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @returns {FriendlyIterable<T>}
 */
export function friendly(iterable){
    return new FriendlyIterable(iterable)
}