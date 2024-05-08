
/**
 * 
 * @param {string} map 
 * @param {[number,number]} position 
 * @param {[number,number]} size 
 * @param {(letter:string, pos:[number,number], size:[number,number])=>void} factory 
 */
export function forMap(map, position, size, factory, tilesize=1){

    /** @type {Array<Array<string?>>} */
    let table=[]
    let column=[]

    // Get Width and Height
    let width=0
    let height=0
    let widtha=0
    for(let i=0; i<map.length; i++){
        if(map[i]==='\n'){
            height++
            width=Math.max(width, widtha)
            widtha=0
            table.push(column)
            column=[]
        }
        else{
            const letter=map.substring(i,i+tilesize)
            i+=tilesize-1
            widtha++
            column.push(letter)
        }
    }
    table.push(column)
    width=Math.max(width, widtha)

    console.log(table)
    const get_size= (x,y)=>{
        let height=1, width=1
        while(table[y]?.[x+width]?.[0]=="-") width++
        while(table[y+height]?.[x]?.[0]=="|") height++
        for(let xx=0; xx<width; xx++){
            for(let yy=0; yy<height; yy++){
                if(table[y+yy]?.[x+xx]!==undefined)table[y+yy][x+xx]=null
            }
        }

        return [width,height]
    }

    // Map
    /** @type {[number,number]} */
    let cellsize=[size[0]/width, size[1]/height]
    for(let y=0; y<table.length; y++){
        for(let x=0; x<table[y].length; x++){
            var letter=table[y][x]
            if(letter===null)continue
            let size=get_size(x,y)
            factory(letter, [position[0]+x*cellsize[0], position[1]+y*cellsize[1]], [cellsize[0]*size[0], cellsize[1]*size[1]])
        }
    }
    /*let x=0
    let y=0
    for(let i=0; i<map.length; i++){
        if(map[i]==='\n'){
            y++
            x=0
        }
        else{
            factory(map[i], [position[0]+x*cellsize[0], position[1]+y*cellsize[1]], cellsize)
            x++
        }
    }*/
}