

/**
 * Gère l'affichage de messages à l'utilisateur.
 */
export class MessageManager{

    /** @type {{ [key: string|number] : {timeoutid:NodeJS.Timeout?, element:HTMLElement} }} */
    #messages={}

    #id_counter=0

    /**
     * @param {Element} container - L'élément HTML dans lequel afficher les messages.
     */
    constructor(container){
        this._container = container
        this._container.innerHTML=""
    }

    /**
     * Envoyer un message à l'utilisateur.
     * @param {string} message 
     * @param {number=} duration La durée d'affichage du message en millisecondes.
     * @param {string|number?=} slot Le slot dans lequel afficher le message, si un message est déjà dans ce slot, il sera remplacé.
     */
    send(message, duration=MessageManager.FOREVER, slot=null){
        if(slot==null){
            slot = this.#id_counter
            this.#id_counter++
        }

        // Replace or create the message
        let entry=this.#messages[slot]
        if(entry){
            if(entry.timeoutid !== null) clearTimeout(entry.timeoutid)
        }
        else{
            const element=document.createElement('div')
            this._container.appendChild(element)
            entry={element:element,timeoutid:null}
            element.setAttribute("slot",slot.toString())
            this.#messages[slot]=entry
        }
    
        entry.element.innerHTML = message

        // Add the timeout
        let timeoutid=null
        if(duration != MessageManager.FOREVER){
            timeoutid=setTimeout(()=>{
                this._container.removeChild(entry.element)
                delete this.#messages[slot]
            }, duration)
        }
        entry.timeoutid=timeoutid
    }

    /**
     * Efface le message de ce slot.
     * @param {string|number} slot
     */
    clear(slot){
        let entry=this.#messages[slot]
        if(entry){
            if(entry.timeoutid !== null) clearTimeout(entry.timeoutid)
            this._container.removeChild(entry.element)
            delete this.#messages[slot]
        }
    }

    clearAll(){
        for(let key in this.#messages){
            let entry=this.#messages[key]
            if(entry.timeoutid !== null) clearTimeout(entry.timeoutid)
            this._container.removeChild(entry.element)
        }
        this.messages = []
    }

    static FOREVER=-1
}