import { view } from "./Template.mjs";
import { EndScreen } from "./gui/EndScreen.mjs";

let body=document.querySelector("body")

let endScreen=new EndScreen()
endScreen.money=100
endScreen.score=100
endScreen.winner="Player 1"
endScreen.actions={
    "Restart":()=>{console.log("Restart")},
    "Quit":()=>{console.log("Quit")}
}
body?.appendChild(endScreen)