
const editor=document.querySelector("#editor")
if(editor===null)throw new Error("Editor not found")
editor.setAttribute("contenteditable","true")

editor.addEventListener("keypress",/** @param {KeyboardEvent} e */e=>{
    if(e.key==="Enter"){
        //e.preventDefault()
    }
    console.log(e)
})