


let id_counter=0

/* --- KEYS --- */
/**
 * Une clé de modèle.
 * @template T Event object
 */
export class ModelKey{

    /** @type {string} */ name

    /**
     * @param {string} name 
     */
    constructor(name="unamed"){
        this.name=name+"_"+id_counter
        id_counter++
    }
}

/**
 * Une clé de modèle associé à un identifiant textuel, permet d'avoir plusieurs
 * modèles avec la même ModelKey.
 * @template T
 * @typedef {[ModelKey<T>,string]} TaggedModelKey
 */

/**
 * Une clé de modèle ou une clé de modèle taggée.
 * @template T
 * @typedef {TaggedModelKey<T>|ModelKey<T>} AnyModelKey
 */


/* --- MODELS --- */
/**
 * Un modèle qui a une méthode pour récupérer sa clé.
 * @typedef {{model_key:ModelKey<*>}} KeyedModel
 */

/**
 * Un paire de clé et de modèle.
 * @template T
 * @typedef {[AnyModelKey<T>,T]} ModelPair
 */

/**
 * Un modèle associé à une clé sous forme d'une paire [clé,modèle] ou juste d'un modèle avec une méthode model_key.
 * @typedef {KeyedModel|ModelPair<*>} ModelAndKey
 */

/**
 * @template T
 * @param {AnyModelKey<T>} model_key
 * @returns {string} 
 */
function anyKeyToId(model_key){
    if(Array.isArray(model_key))return model_key[1]+"_"+model_key[0].name
    return "_"+model_key.name
}

/**
 * Represents a game object.
 * @satisfies {any}
 * @class
 */
export class ModelHolder{
    
    /* --- GETTERS --- */

    /**
     * @template T
     * @param {AnyModelKey<T>} key
     * @returns {T?}
     */
    get(key){
        return this[anyKeyToId(key)] ?? null
    }

    /**
     * @template T
     * @param {AnyModelKey<T>} key
     * @param {(value:T)=>void} callback
     */
    apply(key,callback){
        let value=this.get(key)
        if(value!==null)callback(value)
    }

    /**
     * @template A,B
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB
     * @param {(valA:A, valB:B)=>void} callback
     */
    apply2(keyA,keyB,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        callback(valA,valB)
    }

    /**
     * @template A,B,C
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC
     * @param {(valA:A, valB:B, valC:C)=>void} callback
     */
    apply3(keyA,keyB,keyC,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        callback(valA,valB,valC)
    }

    /**
     * @template A,B,C,D
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD
     * @param {(valA:A, valB:B, valC:C, valD:D)=>void} callback
     */
    apply4(keyA,keyB,keyC,keyD,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        callback(valA,valB,valC,valD)
    }

    /**
     * @template A,B,C,D,E
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E)=>void} callback
     */
    apply5(keyA,keyB,keyC,keyD,keyE,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        callback(valA,valB,valC,valD,valE)
    }

    /**
     * @template A,B,C,D,E,F
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE @param {AnyModelKey<F>} keyF
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F)=>void} callback
     */
    apply6(keyA,keyB,keyC,keyD,keyE,keyF,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        let valF=this.get(keyF); if(valF==null)return
        callback(valA,valB,valC,valD,valE,valF)
    }

    /**
     * @template A,B,C,D,E,F,G
     * @param {AnyModelKey<A>} keyA @param {AnyModelKey<B>} keyB @param {AnyModelKey<C>} keyC @param {AnyModelKey<D>} keyD @param {AnyModelKey<E>} keyE @param {AnyModelKey<F>} keyF @param {AnyModelKey<G>} keyG
     * @param {(valA:A, valB:B, valC:C, valD:D, valE:E, valF:F, valG:G)=>void} callback
     */
    apply7(keyA,keyB,keyC,keyD,keyE,keyF,keyG,callback){
        let valA=this.get(keyA); if(valA==null)return
        let valB=this.get(keyB); if(valB==null)return
        let valC=this.get(keyC); if(valC==null)return
        let valD=this.get(keyD); if(valD==null)return
        let valE=this.get(keyE); if(valE==null)return
        let valF=this.get(keyF); if(valF==null)return
        let valG=this.get(keyG); if(valG==null)return
        callback(valA,valB,valC,valD,valE,valF,valG)
    }



    /* --- SETTERS --- */

    /**
     * @template T
     * @param {AnyModelKey<T>} key
     * @param {()=>T} constructor
     */
    getOrSet(key, constructor){
        let value=this.get(key)
        if(value===null){
            value=constructor()
            this.set(key,value)
        }
        return value
    }

    /**
     * @template T
     * @param {AnyModelKey<T>} key
     * @param {T?} value
     */
    set(key,value){
        if(value)this[anyKeyToId(key)]=value
        else this.remove(key)
    }
    
    /**
     * @template {ModelAndKey} T
     * @param {T} value
     */
    setAuto(value){
        if(Array.isArray(value))this.set(value[0],value[1])
        else this.set(value.model_key,value)
    }


    /* --- REMOVERS --- */

    /**
     * @param {AnyModelKey<*>} key
     */
    remove(key){
        delete this[anyKeyToId(key)]
    }
}