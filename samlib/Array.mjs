// @ts-nocheck 

/*
 * Des extensions pour les tableaux
 */

/**
 * Ajoute tout les éléments d'un iterable à celui-ci
 * @memberof Array
 * @instance
 * @param {Iterable} a 
 */
Array.prototype.pushAll = function(a) 
{
    for (let x of a)this.push(x);
    return this;
};

/**
 * Supprime tout les éléments d'un iterable de celui-ci
 * @memberof Array
 * @instance
 * @param {Iterable} a
 */
Array.prototype.removeAll = function(a){
    for (let x of a) this.remove(x);
    return this;
}

/**
 * @param {Array}
 */
export function random(array){
    return array[Math.floor(Math.random()*array.length)]
}

/**
 * 
 * @param {Array} array 
 * @param {number} index 
 */
export function roundGet(array,index){
    return array[index%array.length]
}

/**
 * Supprime un élément rapidement (sans conserver l'ordre)
 * @memberof Array
 * @instance
 * @param {number} index 
 */
Array.prototype.fastRemove = function fastDelete(index){
    this[index]=this[array.length-1]
    array.pop()
}

/**
 * Supprime un élément rapidement (sans conserver l'ordre)
 * @param {Array} array
 * @param {number} index 
 */
export function fastRemove(array,index){
    array[index]=array[array.length-1]
    array.pop()
}

/**
 * Supprime un élément rapidement (sans conserver l'ordre)
 * @param {Array} array
 * @param {any|any[]} value 
 */
export function fastRemoveValue(array,value){
    const index=array.indexOf(value)
    if(index>=0)fastRemove(array,index)
}

export function fastRemoveValueAll(array,values){
    for(let i=values.length-1; i>=0; i--){
        fastRemoveValue(array,values[i])
    }

}

/**
 * Supprime les éléments qui ne sont pas dans la liste (sans conserver l'ordre)
 * @param {Array} array
 * @param {any[]} values 
 */
export function fastKeep(array,values){
    for(let i=values.length-1; i>=0; i--){
        if(!values.includes(array[i]))fastRemove(array,i)
    }
}