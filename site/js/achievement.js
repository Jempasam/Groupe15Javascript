import { achievement_registry } from "./achievement_list.mjs";


let html=document.querySelector(".achievements")
if(html){
    achievement_registry.fillWithHtml(html)
}