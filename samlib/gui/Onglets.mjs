// @ts-nocheck

import { mapAttribute } from "../CustomElement.mjs"
import { create } from "../DOM.mjs"


/**
 * @event change
 */
export class Onglets extends HTMLElement{

    static #select=new CustomEvent("select",{bubbles:true})


    constructor(){
        super()
        this.addEventListener("click",e=>{
            const onglet=e.target
            if(onglet.parentElement.tagName==="NAV" && onglet.parentElement?.parentElement===this){
                this.select(onglet.getAttribute("page"))
            }
        })
    }

    select(pageid){
        const onglets=this.querySelector("&>nav")
        const pages=this.querySelector("&>div")
        for(const onglet of onglets.children){
            const id=onglet.getAttribute("page")
            if(id===pageid){
                onglet.setAttribute("selected","")
            }
            else{
                onglet.removeAttribute("selected")
            }
        }
        for(const page of pages.children){
            const id=page.getAttribute("page")
            if(id===pageid){
                page.setAttribute("selected","")
            }
            else{
                page.removeAttribute("selected")
            }
        }
    }

}
customElements.define("sam-onglets", Onglets)