//@ts-nocheck
import { mapAttribute } from "../CustomElement.mjs"
import { create, dom } from "../DOM.mjs"

export class GameHeader extends HTMLElement{

    #onhome

    #onback

    constructor(){
        super()

        this.dom_back=create("a.back.disabled")
        this.dom_back.onclick = ()=>{if(this.#onback)this.#onback()}
        this.appendChild(this.dom_back)

        this.dom_home=create("a.home.disabled")
        this.dom_home.onclick = ()=>{if(this.#onhome)this.#onhome()}
        this.appendChild(this.dom_home)
    }

    set onhome(value){
        this.#onhome=value
        this.dom_home.classList.toggle("disabled",!value)
    }

    set onback(value){
        this.#onback=value
        this.dom_back.classList.toggle("disabled",!value)
    }
}


mapAttribute(GameHeader)
customElements.define("sam-gameheader",GameHeader)