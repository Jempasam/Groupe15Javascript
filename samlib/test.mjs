import { adom } from "./DOM.mjs";
import { view } from "./Template.mjs";
import { EndScreen } from "./gui/EndScreen.mjs";
import { Onglets } from "./gui/Onglets.mjs";

let body=document.querySelector("body")

body?.appendChild(adom/*html*/`
    <sam-onglets style="height:300px;background:red;">
        <nav>
            <a page=screen1 selected>Screen 1</a>
            <a page=screen2>Screen 2</a>
            <a page=screen3>Screen 3</a>
        </nav>
        <div>
            <div page=screen1 selected>This is screen 1</div>
            <div page=screen2>This is screen 2</div>
            <div page=screen3>This is screen 3</div>
        </div>
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