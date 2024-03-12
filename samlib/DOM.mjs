

export function html(strings, ...values) {
    const escaped = values.map((value) => {
        if(value instanceof Element)return value.outerHTML
        return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    });

    return strings.reduce(
        (result, string, i) => `${result}${string}${escaped[i] || ""}`,
        "",
    );
}

/**
 * A tag template that return a dom from a outer html
 * and escape template parameters
 * @param {*} strings 
 * @param  {...any} values 
 * @returns
 */
export function dom(strings, ...values) {
    const template = document.createElement("aa");
    template.innerHTML = html(strings, ...values);
    if(template.children.length==1)return template.children[0];
    return template.children;
}

/**
 * A tag template that return a dom from a outer html
 * and escape template parameters. Return the first element only.
 * @param {*} strings 
 * @param  {...any} values 
 */
export function adom(strings, ...values) {
    const template = document.createElement("aa");
    template.innerHTML = html(strings, ...values);
    return template.children[0];
}

/**
 * Create an element using a selector like description
 * @param {string} element
 * @param {string=} content
 * @returns {Element}
 */
export function create(element,content){
    let splitted=element.split(/(?=\.)|(?=#)|(?=\[)/)
    let ret=document.createElement(splitted[0])
    if(content)ret.textContent=content
    for(let s of splitted){
        if(s.length>1 && s[0]=="."){
            ret.classList.add(s.slice(1))
        }
        else if(s.length>1 && s[0]=="#"){
            ret.id=s.slice(1)
        }
        else if(s.length>1 && s[0]=="["){
            let attr=s.slice(1,-1).split("=")
            ret.setAttribute(attr[0],attr[1])
        }
    }
    return ret
}