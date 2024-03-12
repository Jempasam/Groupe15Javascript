import { view } from "./Template.mjs";

class Test{
    constructor(){
        this.name="Salade";
        this.desc="C'est une salade";
        this.age=12;
    }
}

let obj=new Test()
let testView=view(String)/*html*/`
<div>
    <h1>${x=>x.name}</h1>
    <p>${x=>x.desc}</p>
    <p>${x=>x.age}</p>
</div>
`

let result= testView(obj)

console.log(result)