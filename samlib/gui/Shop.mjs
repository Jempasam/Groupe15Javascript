//@ts-nocheck
import { mapAttribute } from "../CustomElement.mjs"
import { create, dom } from "../DOM.mjs"
import { LOCAL_STORAGE, OBJECT_DATA } from "../Storage.mjs"

export class Shop extends HTMLElement{

    #shop_content
    #shop_id

    static attributeMap={
        "title":{def:""}
    }

    /**
     * @param {(string)=>Element} display_getter
     */
    constructor(display_getter){
        super()
        this.display_getter=display_getter

        let [title,price,items]=dom/*htm*/`
            <h2>${this.title}</h2>
            <span class="price">0</span>
            <div class="item_list"></div>
        `
        this.dom_title=this.appendChild(title)
        this.dom_price=this.appendChild(price)
        this.dom_items=this.appendChild(items)
    }

    attributeChangedCallback(name,oldValue,newValue){
        switch(name){
            case "title":
                this.dom_title.innerText=newValue
                break
        }
    }

    set shop_content(value){
        this.#shop_content=value
        this.reloadShop()
    }

    set shop_id(value){
        this.#shop_id=value
        this.reloadShop()
    }

    reloadShop(){
        const dom_items=this.dom_items
        dom_items.innerHTML=""
        if(!this.#shop_content)return

        let save=ShopData.get(this.#shop_id)

        for(let [id,{name,description,price}] of Object.entries(this.#shop_content)){
            console.log(save,id)
            let item=dom_items.appendChild(dom/*html*/`
                <a class="${save.isBuyed(id)?"buyed":""}">
                    <h3>${name}</h3>
                    <div class="illustration"></div>
                    <p>${description}</p>
                    <span class="price">${price}</span>
                </a>
            `)
            item.onclick=()=>{
                if(save.isBuyed(id))return
                if(save.money<price)return
                save.money-=price
                save.buyeds.add(id)
                ShopData.set(this.#shop_id,save)
                this.reloadShop()
            }
            item.querySelector(".illustration").appendChild(this.display_getter(id))
        }

        this.dom_price.innerText=save.money
    }
}

export class ShopData{

    /**
     * Buyed items in this shop
     * @type {Set<string>}
     */
    buyeds

    /**
     * Shop identifier
     * @param {string} shop_id
     */
    identifier

    /**
     * Current money balance
     * @type {number}
     */
    money

    constructor(buyeds,identifier,money){
        console.log(buyeds)
        this.buyeds=buyeds
        this.identifier=identifier
        this.money=money

    }

    /**
     * Is buyed
     * @param {string} id
     * @returns {boolean}
     */
    isBuyed(id){
        return this.buyeds.has(id)
    }

    /**
     * Get Shop data of the given shop
     * @param {string} shop_id 
     * @returns {ShopData}
     */
    static get(shop_id){
        let storage=LOCAL_STORAGE.get("samlib_shop",OBJECT_DATA)
        if(!storage)return new ShopData(new Set(),shop_id,0)

        let data=storage[shop_id]
        if(!data)return new ShopData(new Set(),shop_id,0)

        return new ShopData(
            new Set(data.buyeds),
            shop_id,
            data.money ?? 0
        )

    }

    /**
     * Set Shop data of the given shop
     * @param {string} shop_id
     * @param {ShopData} data
     */
    static set(shop_id,data){
        let storage=LOCAL_STORAGE.get("samlib_shop",OBJECT_DATA)
        if(!storage)storage={}
        storage[shop_id]={"buyeds":Array.from(data.buyeds.values()), "money":Math.max(0,data.money)}
        LOCAL_STORAGE.set("samlib_shop",OBJECT_DATA,storage)
    }

    static clear(shop_id){
        LOCAL_STORAGE.set("samlib_shop",OBJECT_DATA,{})
    }

}

mapAttribute(Shop)
customElements.define("sam-shop",Shop)