//@ts-nocheck
import { mapAttribute } from "../CustomElement.mjs"
import { create, dom } from "../DOM.mjs"

export class GameMenu extends HTMLElement{

    #actions={}

    on_play

    on_shop

    static attributeMap={
        "title":{def:""}
    }

    constructor(){
        super()
        this.dom_title=dom`<h2>${this.title}</h2>`
        this.appendChild(this.dom_title)

        this.dom_menu=create("div.button_list")
        this.appendChild(this.dom_menu)

        this.dom_play=create("a.play")
        this.dom_play.onclick = ()=>{if(this.onplay)this.onplay()}
        this.dom_menu.appendChild(this.dom_play)

        this.dom_shop=create("a.shop")
        this.dom_shop.onclick = ()=>{if(this.onshop)this.onshop()}
        this.dom_menu.appendChild(this.dom_shop)

        this.dom_menu2=create("div.button_list")
        this.appendChild(this.dom_menu2)
    }

    attributeChangedCallback(name,oldValue,newValue){
        switch(name){
            case "title":
                this.dom_title.innerText=newValue
                break
        }
    }

    generateMenu(){
        for(let [key,action] of Object.entries(this.#actions)){
            let button=create("a.menu_button")
            button.innerText=key
            button.onclick=action
            this.dom_menu2.appendChild(button)
        }
    }

    set actions(value){
        this.#actions=value
        this.generateMenu()
    }
}


mapAttribute(GameMenu)
customElements.define("sam-gamemenu",GameMenu)