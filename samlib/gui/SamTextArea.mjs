import { adom, create, html } from "../DOM.mjs"

export default class SamTextArea extends HTMLTextAreaElement{
    
    constructor(){
        super()
        this.addEventListener("keydown",this.onKeyPress)
    }

    /** @param {KeyboardEvent} event */
    onKeyPress(event){
        if(event.key==="V" && event.shiftKey && event.ctrlKey){
            this.paste_area()
            event.preventDefault()
        }
        else if(event.key==="C" && event.shiftKey && event.ctrlKey){
            this.copy_area()
            event.preventDefault()
        }
        else if(this.selectionStart!=this.selectionEnd){
            let before=this.value.substring(0,this.selectionStart)
            let middle=this.value.substring(this.selectionStart, this.selectionEnd)
            let after=this.value.substring(this.selectionEnd)
            if(event.key==="Tab"){
                if(event.shiftKey){
                    middle=middle.replace(/\n /g, "\n")
                    if(middle.startsWith(" "))middle=middle.substring(1)
                }
                else{
                    middle=middle.replace(/(^|\n)/g,it=>it+" ")
                }
                event.preventDefault()
            }
            this.value=before+middle+after
            this.selectionStart=before.length
            this.selectionEnd=before.length+middle.length
        }
        else{
            if(!["Tab"].includes(event.key))return
            let before=this.value.substring(0,this.selectionStart)
            let after=this.value.substring(this.selectionStart)
            if(event.key=="Tab"){
                if(event.shiftKey){
                    if(before.endsWith("    "))before=before.substring(0,before.length-4)
                }
                else before+="    "
            }
            this.value=before+after
            this.selectionStart=this.selectionEnd=before.length
            event.preventDefault()

        }
    }

    /**
     * Paste as square
     * */
    async paste_area(){
        const data=await navigator.clipboard.readText()
        if(data){
            // Get text arrays
            const contentarray=this.value.split(/\n/g)
            const pastearray=data.split(/\n/g)

            // Get paste coordinates
            let paste_y=-1
            let paste_x=-1
            let counter=0
            for(let y=0;y<contentarray.length;y++){
                const back_x=counter+contentarray[y].length
                if(back_x>this.selectionStart){
                    paste_y=y
                    paste_x=this.selectionStart-counter
                    break
                }
                counter=back_x+1
            }

            // Paste into target
            for(let y=0;y<pastearray.length;y++){
                const target_y=paste_y+y
                
                // Add line
                if(target_y>=contentarray.length)contentarray.push("")
                
                // Add column
                const to_add=contentarray[target_y].length-paste_x
                contentarray[target_y]+=" ".repeat(to_add)

                // Paste into
                const before=contentarray[target_y].substring(0,paste_x)
                const replaced=contentarray[target_y].substring(paste_x,paste_x+pastearray[y].length)
                const after=contentarray[target_y].substring(paste_x+pastearray[y].length)
                contentarray[target_y]=before+pastearray[y]+after
            }

            this.value=contentarray.join("\n")
        }
        
    }

    /**
     * Paste as square
     * */
    copy_area(){
        // Get text arrays
        const contentarray=this.value.split(/\n/g)

        // Get paste coordinates
        let start_x=-1
        let start_y=-1
        let counter=0
        for(let y=0;y<contentarray.length;y++){
            const back_x=counter+contentarray[y].length
            if(back_x>this.selectionStart){
                start_y=y
                start_x=this.selectionStart-counter
                break
            }
            counter=back_x+1
        }

        let end_x=-1
        let end_y=-1
        counter=0
        for(let y=0;y<contentarray.length;y++){
            const back_x=counter+contentarray[y].length
            if(back_x>this.selectionEnd){
                end_y=y
                end_x=this.selectionEnd-counter
                break
            }
            counter=back_x+1
        }

        // Copied
        let copied_lines=[]
        for(let y=start_y; y<=end_y; y++)copied_lines.push(contentarray[y].substring(start_x,end_x))
        navigator.clipboard.writeText(copied_lines.join("\n"))
    }

}

customElements.define("sam-textarea", SamTextArea, {extends:"textarea"})