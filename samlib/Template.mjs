// @ts-nocheck

/**
 * List les attributs qui ont été lus.
 * @returns 
 */
function GetterProxy(obj, getter){
    let handler={
        accessList: [],
        get(target, prop){
            this.accessList.push(prop)
            return Reflect.get(...arguments)
        },
    }
    return [new Proxy(obj, handler),handler]
}

/**
 * Résoud un template string et le renvoit avec les attributs lus pour le générer.
 * @param {any} obj 
 * @param {function(any):string} stringifier 
 * @param {TemplateStringArrays} strings 
 * @param  {...function(any):any} args 
 * @returns {View}
 */
function use_template(obj, stringifier, strings, ...args){
    let [proxy,handler]=GetterProxy(obj)
    let ret=strings[0]
    for(let i=1; i<strings.length; i++){
        ret+=stringifier(args[i-1](proxy))+strings[i]
    }
    return new View(ret, handler.accessList)
}

export class View{
    result
    observed
    constructor(result, observed){
        this.result=result
        this.observed=observed
    }

    onChange(object, changed, onchange){
        if(this.observed.includes(name)){
            let {result,observed}=use_template(object, this.result, ...this.observed)
            this.result=result
            this.observed=observed
            onchange(result)
        }
    }

}

/**
 * Crée un usine à modèle de vue qui utilise un stringifier pour convertir les valeurs en string.
 * 
 * @typedef {function(any):{View}} ViewTemplate
 * @typedef {function(TemplateStringArrays, ...(function(any):any)):ViewTemplate} ViewTemplateFactory
 * 
 * @param {function(any):string} stringifier 
 * @returns {ViewTemplateFactory}
 */
export function view(stringifier){
    return function(strings, ...args){
        return (obj)=>use_template(obj, stringifier, strings, ...args)
    }
}