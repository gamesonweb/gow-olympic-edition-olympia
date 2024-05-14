// @ts-nocheck

import { mapAttribute } from "../CustomElement.mjs"
import { create } from "../DOM.mjs"


export class SamSelector extends HTMLElement{
    constructor(){
        super()
    }
}

mapAttribute(SamSelector)
customElements.define("sam-selector", SamSelector)


/**
 * @event select
 */
export class SamOption extends HTMLElement{

    static attributeMap={
        "selected": { def:false, parser:v=>v=="true", serializer:v=>v?"true":"false" },
    }

    static #select=new CustomEvent("select",{bubbles:true})

    constructor(){
        super()
        this.addEventListener("click",()=>{
            this.selected=true
        })
    }

    attributeChangedCallback(name,oldValue,newValue){
        if(name=="selected"){
            if(newValue=="true" && oldValue!=newValue){
                let parent=this.parentElement
                if(parent instanceof SamSelector){
                    for(let option of parent.children){
                        if(option==this){
                            continue
                        }
                        if(option instanceof SamOption)option.selected=false
                    }
                    this.dispatchEvent(SamOption.#select)
                }
            }
        }
    }

}

mapAttribute(SamOption)
customElements.define("sam-option", SamOption)

