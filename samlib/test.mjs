import { merge } from "./inheritance/merge.mjs"


class Animal{
    get(){
        console.log("Fur")
    }
    waf(){
        console.log("Waf")
    }
}

class Eatable{
    get(){
        console.log("Food")
    }
    eatable(){
        console.log("I'm eatable")
    }
}

class Pork{
    jam(){
        console.log("I'm pork")
    }
}
function Date(){

}
Date.prototype={
    get(){
        console.log("Date")
    }
}

console.log(Animal)
console.log(Eatable)
console.log(Pork)
console.log(merge(Date,Eatable,Pork))