//@ts-nocheck
import { mapAttribute } from "../CustomElement.mjs"
import { create, dom } from "../DOM.mjs"

export class EndScreen extends HTMLElement{

    #actions={}

    static attributeMap={
        "money":{def:0, parser:(v)=>parseInt(v)||0, serializer:(v)=>""+v},
        "score":{def:0, parser:(v)=>parseInt(v)||0, serializer:(v)=>""+v},
        "winner":{def:"nobody"},
    }

    constructor(){
        super()
        let [title,winner,score,money,buttons]=dom/*html*/`
            <h2>Game Over</h2>
            <p class="_winner">Nobody</p>
            <p class="_score">0</p>
            <p class="_money">0</p>
            <ul class="_buttons"></ul>
        `
        this._dom_title=this.appendChild(title)
        this._dom_winner=this.appendChild(winner)
        this._dom_score=this.appendChild(score)
        this._dom_money=this.appendChild(money)
        this._dom_buttons=this.appendChild(buttons)
    }

    attributeChangedCallback(name,_,newValue){
        switch(name){
            case "money":
                this._dom_money.innerText=newValue
                break
            case "score":
                this._dom_score.innerText=newValue
                break
            case "winner":
                this._dom_winner.innerText=newValue
                break
        }
    }

    generateMenu(){
        for(let [key,action] of Object.entries(this.#actions)){
            let button=create("a.menu_button")
            button.innerText=key
            button.onclick=action
            this._dom_buttons.appendChild(button)
        }
    }

    set actions(value){
        this.#actions=value
        this.generateMenu()
    }
}


mapAttribute(EndScreen)
customElements.define("sam-endscreen",EndScreen)