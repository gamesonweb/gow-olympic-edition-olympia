// @ts-nocheck

import { mapAttribute } from "../CustomElement.mjs"
import { create } from "../DOM.mjs"


/**
 * @event change
 */
export class NumberInput extends HTMLElement{

    static attributeMap={
        "min": { def:Number.MIN_VALUE, parser:NumberInput.parser, serializer:n=>new String(n) },
        "max": { def:Number.MAX_VALUE, parser:NumberInput.parser, serializer:n=>new String(n) },
        "value": { def:0, parser:NumberInput.parser, serializer:n=>new String(n) },
    }

    static #change=new CustomEvent("change",{bubbles:true})

    static parser(str){
        let n=parseInt(str)
        if(isNaN(n))return 0
        return n
    }

    constructor(){
        super()
        this.dom_minus=create("input[type=button][value=-]")
        this.dom_plus=create("input[type=button][value=+]")
        this.dom_input=create("input[type=text]")
        this.appendChild(this.dom_minus)
        this.appendChild(this.dom_input)
        this.appendChild(this.dom_plus)
        this.dom_input.addEventListener("input",v=>{
            this.value=NumberInput.parser(this.dom_input.value)
        })
        this.dom_minus.onclick=()=>{
            this.value--
        }
        this.dom_plus.onclick=()=>{
            this.value++
        }
    }

    attributeChangedCallback(name,oldValue,newValue){
        if(["min","max","value"].includes(name) && this.max>=this.min){
            if(this.value<this.min){
                this.value=this.min
                return
            }
            else if(this.value>this.max){
                this.value=this.max
                return
            }
        }
        if(name=="value"){
            this.dom_input.value=this.value
            this.dispatchEvent(NumberInput.#change)
        }
    }

}

mapAttribute(NumberInput)
customElements.define("sam-numberinput", NumberInput)

