import { ACCOUNT_STORAGE, OBJECT_DATA } from "../../samlib/Storage.mjs"
import { Puissance4Game } from "./game.mjs"

/* Get Host and create Menu */
let host=document.getElementById("host")
if(!host)throw new Error("No host")

let game=new Puissance4Game(host, ACCOUNT_STORAGE)
