import { adom } from "./DOM.mjs"
import Assembler from "./gui/Assembler.mjs"
import TemplateList from "./gui/TemplateList.mjs"
import { merge } from "./inheritance/merge.mjs"



document.querySelector("body")?.appendChild(adom/*html*/`
<sam-template-list>
    <div class="template">
        <h1>Template</h1>
        <p>Salut les bougs</p>
        <input type="text" value="Hello World">
        <input type="text" value="Hello World">
    </div>
</sam-template-list>
`)