import { Drawable } from "./Drawable.mjs"

/**
 * Iterate over tiles of the matrix dans call a function for each tile with a given drawable.
 * Return false from the callable stop the evaluation on the same depth
 * @param {Drawable} drawable
 * @param {[number,number,number]} center
 * @param {[number,number,number]} size
 * @param {number} precision
 */
export function drawTestMatrix(drawable, center, size, precision, callable){
    let sx=size[0]/precision
    let sy=size[1]/precision
    let sz=size[2]/precision
    for(let x=0; x<precision; x++){
        for(let y=0; y<precision; y++){
            for(let z=0; z<precision; z++){
                let box_width=drawable.width/precision
                let box_height=drawable.height/precision
                if(!callable(
                    center[0]+x*sx, center[1]+y*sy, center[2]+z*sz,
                    sx, sy, sz,
                    drawable.sub(
                        x*box_width,
                        y*box_height,
                        box_width,
                        box_height
                    )
                ))continue
                break
            }
        }
    }
}