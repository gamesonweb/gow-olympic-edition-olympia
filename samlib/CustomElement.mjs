
/**
 * Ajoute à la classe passée en paramètre des setter et getter pour 
 * tous ses attributes observés.
 * @param {any} clazz 
 */
export function mapAttribute(clazz){
    let prototype=clazz.prototype
    if(clazz.attributeMap){
        // Create observed if not
        if(!clazz.observedAttributes)clazz.observedAttributes=[]
        for(let [name,{def,parser,serializer,observe}] of Object.entries(clazz.attributeMap)){
            // Observe
            if(observe===undefined)observe=true
            if(observe)clazz.observedAttributes.push(name)

            // Define getter and setter
            if(!parser)parser= v=>v
            if(!serializer)serializer= v=>v
            Object.defineProperty(prototype,name,{
                set(v){
                    this.setAttribute(name,serializer(v))
                },
                get(){
                    let got=this.getAttribute(name)
                    if(got!==undefined)got=parser(got)
                    if(got===undefined)return def
                    return got
                },
            })
        }
    }
}
