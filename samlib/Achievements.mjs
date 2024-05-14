

/** @typedef {{name:string, desc:string, img:string,max:number}} Achievement */

import { adom, create, dom } from "./DOM.mjs";
import { ACCOUNT_STORAGE, OBJECT_DATA } from "./Storage.mjs";

/** @typedef {{name:string, achievements:Object<string,Achievement>}} AchievementGroup*/

/** @typedef {Object<string,AchievementGroup>} AchievementList */

export class AchievementsStorage{

    /** @param {AchievementList} achievements */
    constructor(achievements){
        this.achievements = achievements;
    }


    /** @type {((gameid:string, achid:string, ach:Achievement)=>void)?} */
    on_complete=null


    /** Achievment List */
    /**
     * Check if an achievement exists
     */
    getAchievements(gameid,achid){
        return this._exist(gameid,achid)
    }

    clear(){
        ACCOUNT_STORAGE.set("achievements",OBJECT_DATA,null)
    }

    clearGame(gameid){
        ACCOUNT_STORAGE.edit("achievements",OBJECT_DATA,(user)=>{
            delete user[gameid]
        })
    }


    /** User Achievements */
    getUserAchievements(){
        return ACCOUNT_STORAGE.get("achievements",OBJECT_DATA)
    }

    /**
     * Modifie l'achievement en fonction de la fonction callback
     * @param {string} gameid 
     * @param {string} achid 
     * @param {(value:number,max:number)=>number} callback Le 1er paramètre est la valeur actuelle de l'achievement, le 2ème est la valeur max
     */
    edit(gameid,achid,callback){
        const previous=this.get(gameid,achid)
        if(previous!==undefined){
            const achievements=this.achievements[gameid].achievements[achid]
            const max=achievements.max
            const now=callback(previous,max)
            if(now!=previous) this.set(gameid,achid,now)
        }
    }
    
    /**
     * Retourne la complétion de l'achievement ou undefined si l'achievement n'existe pas
     * @returns {number|undefined}
     */
    get(gameid,achid){
        if(this.getAchievements(gameid,achid)){
            return this._get(gameid,achid)
        }
        else{
            this._set(gameid,achid,0);
            console.warn(`Trying to get an achievement that doesn't exist "${gameid}:${achid}"`)
            return undefined;
        }
    }

    /**
     * Retourne si l'achievement est débloqué
     * @param {string} gameid
     * @param {string} achid
     * @returns {boolean}
     */
    isUnlocked(gameid,achid){
        let ach=this.get(gameid,achid)
        if(ach!==undefined){
            return ach==this.achievements[gameid].achievements[achid].max
        }
        else return false
    }

    /**
     * Change la complétion de l'achievement si il existe
     * @param {number} value 
     */
    set(gameid,achid,value){
        let ach=this.getAchievements(gameid,achid)
        if(ach){
            if(value>ach.max){
                value=ach.max;
                //console.warn(`Trying to set an achievement to a value higher than the max of "${gameid}:${achid}, ${value} > ${ach.max}"`)
            }
            else if(value<0){
                value=0;
                //console.warn(`Trying to set an achievement to a value lower than 0 "${gameid}:${achid}"`)
            }
            this._set(gameid,achid,value)

            const previous=this.get(gameid,achid)
            if(value!=previous && value==ach.max && this.on_complete){
                this.on_complete(gameid,achid,ach)
            }
        }
        else{
            console.warn(`Trying to set an achievement that doesn't exist "${gameid}:${achid}"`)
        }
    }

    /**
     * @param {Element} filled 
     */
    fillWithHtml(filled){
        for(let [groupid,group] of Object.entries(this.achievements)){
            let section = document.createElement("section");
            section.appendChild(adom`<h2>${group.name}</h2>`)
            let list=create("ul")
            section.appendChild(list);
            for(let [achid,achievement] of Object.entries(group.achievements)){
                const value=this.get(groupid,achid)??0
                const max=achievement.max
                let element=adom/*html*/`
                    <li class="${value==max?"unlocked":""}">
                        <img src="${achievement.img}"/>
                        <h3>${achievement.name}</h3>
                        <p>${achievement.desc}</p>
                        <div class="progress" value="${Math.round(value/max*10)}">
                            ${value}/${max}
                        </div>
                    </li>
                `
                list.appendChild(element);
            }
            filled.appendChild(section);
        }
    }

    _exist(gameid,achid){
        return this.achievements[gameid] && this.achievements[gameid].achievements[achid];
    }

    _get(gameid,achid){
        const user = this.getUserAchievements();
        return user[gameid]?.[achid] ?? 0;
    }

    _set(gameid,achid,value){
        if(value==0){
            ACCOUNT_STORAGE.edit("achievements",OBJECT_DATA,(user)=>{
                if(user[gameid]) delete user[gameid][achid];
                if(Object.keys(user[gameid]).length==0) delete user[gameid];
            })
        }
        else{
            ACCOUNT_STORAGE.edit("achievements",OBJECT_DATA,(user)=>{
                if(!user[gameid]) user[gameid] = {};
                user[gameid][achid] = value;
            })
        }
    }
}