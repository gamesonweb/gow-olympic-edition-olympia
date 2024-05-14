//@ts-nocheck
import { mapAttribute } from "../CustomElement.mjs"
import { create, dom } from "../DOM.mjs"
import { LOCAL_STORAGE, OBJECT_DATA } from "../Storage.mjs"

export class Shop extends HTMLElement{

    #shop_content
    #shop_id="global"
    #storage=LOCAL_STORAGE

    static attributeMap={
        "title":{def:""}
    }

    /** @type {(buyed:string,price:number)=>void} */
    on_buy=null

    /**
     * @param {(string)=>Element} display_getter
     */
    constructor(display_getter){
        super()
        this.display_getter=display_getter

        let [count,title,price,items]=dom/*htm*/`
            <span class="count">0/80</span>
            <h2>${this.title}</h2>
            <span class="price">0</span>
            <div class="item_list"></div>
        `
        this.dom_count=this.appendChild(count)
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

    set storage(value){
        this.#storage=value
        this.reloadShop()
    }

    /**
     * @param {(data:ShopData)=>void} callback
     */
    editShopData(callback){
        const data=ShopData.get(this.#storage, this.#shop_id)
        callback(data)
        ShopData.set(data)
    }

    reloadShop(){
        const dom_items=this.dom_items
        dom_items.innerHTML=""
        if(!this.#shop_content)return

        let save=ShopData.get(this.#storage, this.#shop_id)
        
        let total=0
        let buyed=0
        for(let [id,{name,description,price}] of Object.entries(this.#shop_content)){
            let item=dom_items.appendChild(dom/*html*/`
                <a class="${save.isBuyed(id)?"buyed":""}">
                    <h3>${name}</h3>
                    <div class="illustration"></div>
                    <p>${description}</p>
                    <span class="price">${price}</span>
                </a>
            `)
            total++
            if(save.isBuyed(id))buyed++
            item.onclick=()=>{
                if(save.isBuyed(id))return
                if(save.money<price)return
                this.editShopData(data=>{
                    data.money-=price
                    data.buyeds.add(id)
                })
                if(this.on_buy)this.on_buy(id,price)
                this.reloadShop()
            }
            item.querySelector(".illustration").appendChild(this.display_getter(id))
        }
        this.dom_count.innerText=`${buyed}/${total}`
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
     * @type {string} shop_id
     */
    identifier

    /**
     * @type {Storage}
     */
    storage

    /**
     * Current money balance
     * @type {number}
     */
    money

    constructor(buyeds,identifier,storage,money){
        this.buyeds=buyeds
        this.identifier=identifier
        this.storage=storage
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
    static get(storage,shop_id){
        let shop_storages=storage.get("samlib_shop",OBJECT_DATA)
        if(!shop_storages)return new ShopData(new Set(),shop_id,this.storage,0)

        let data=shop_storages[shop_id]
        if(!data)return new ShopData(new Set(),shop_id,storage,0)

        return new ShopData(
            new Set(data.buyeds),
            shop_id,
            storage,
            data.money ?? 0
        )

    }

    /**
     * Set Shop data of the given shop
     * @param {string} shop_id
     * @param {ShopData} data
     */
    static set(data){
        let storage=data.storage.get("samlib_shop",OBJECT_DATA)
        if(!storage)storage={}
        storage[data.identifier]={buyeds:Array.from(data.buyeds.values()), money:Math.max(0,data.money)}
        data.storage.set("samlib_shop",OBJECT_DATA,storage)
    }

    static clear(shop_id){
        this.storage.set("samlib_shop",OBJECT_DATA,{})
    }

}

mapAttribute(Shop)
customElements.define("sam-shop",Shop)