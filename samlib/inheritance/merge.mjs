
/**
 * @template T
 * @template P...
 * @param  {function(new:T,...P)} base The classes to merge 
 * @param  {...Function} classes The classes to merge 
 * @returns {function(new:({supers,super_call}&T),...P)} The merged class
 */
export function merge(base,...classes){
    classes=[base,...classes]
    // The merged class
    const merged={}
    merged.supers=classes
    merged.super_call=function(name,...args){
        for(let classe of this.supers){
            if(classe.prototype[name]!==undefined){
                classe.prototype[name].apply(this,args)
            }
        }
    }

    // Get the function names set
    let member_names=new Set()
    for(let classe of classes){
        for(let name of Object.getOwnPropertyNames(classe.prototype)){
            console.log("-",name)
            member_names.add(name)
        }
    }
    console.log(member_names)

    // Merge the functions
    for(let name of member_names){
        // Get the sub functions
        let sub_members=[]
        for(let classe of classes){
            if(classe.prototype[name]!==undefined){
                sub_members.push(classe.prototype[name])
            }
        }
        if(sub_members.length==1){
            merged[name]=sub_members[0]
        }
        else if(sub_members.length>1){
            if(sub_members[0] instanceof Function){
                merged[name]=function(...args){
                    for(let sub_member of sub_members){
                        sub_member.apply(this,args)
                    }
                }
            }
            else{
                merged[name]=sub_members[sub_members.length-1]
            }
        }
    }

    if(merged.constructor===undefined){
        merged.constructor=function(){}
    }
    console.log(merged)
    merged.constructor.prototype=merged
    return merged.constructor
}