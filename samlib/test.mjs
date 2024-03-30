import { adom } from "./DOM.mjs";
import { view } from "./Template.mjs";
import { EndScreen } from "./gui/EndScreen.mjs";
import { Onglets } from "./gui/Onglets.mjs";

let body=document.querySelector("body")

body?.appendChild(adom/*html*/`
    <sam-onglets>
        <sam-onglet page=screen1>Screen 1</sam-onglet>
        <sam-onglet page=screen2 class=shown>Screen 2</sam-onglet>
        <sam-onglet page=screen3>Screen 3</sam-onglet>

        <sam-page page=screen1>This is screen 1</sam-page>
        <sam-page page=screen2 class=shown>This is screen 2</sam-page>
        <sam-page page=screen3>This is screen 3</sam-page>
    </sam-onglets>
`)

/*let endScreen=new EndScreen()
endScreen.money=100
endScreen.score=100
endScreen.winner="Player 1"
endScreen.actions={
    "Restart":()=>{console.log("Restart")},
    "Quit":()=>{console.log("Quit")}
}
body?.appendChild(endScreen)*/