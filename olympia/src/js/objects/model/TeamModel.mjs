import { GameObject } from "../world/GameObject.mjs"
import { ModelKey } from "../world/ModelHolder.mjs"

export class Team{

    /**
     * @param {string} name 
     */
    constructor(name){
        this.name=name
    }

    static PEACEFUL=new Team("peaceful")
    static HATEFUL=new Team("hateful")
}

export class TeamModel{

    /**
     * @param {Team} team 
     */
    constructor(team){
        this.team=team
    }

    /**
     * Check if this team is an ally of the given team.
     * @param {Team} team
     * @returns {boolean} 
     */
    do_team_with(team){
        if(team === Team.HATEFUL || this.team === Team.HATEFUL) return false
        if(team === Team.PEACEFUL || this.team === Team.PEACEFUL) return true
        return this.team === team
    }

    get model_key(){ return TEAM }
}

/** @type {ModelKey<TeamModel>} */
export const TEAM=new ModelKey("team")

/**
 * @param {GameObject} obj1
 * @param {GameObject} obj2
 * @param {boolean} default_to_peaceful
 */
export function do_team_with(obj1, obj2, default_to_peaceful=false){
    const team1=obj1.get(TEAM); if (!team1) return default_to_peaceful
    const team2=obj2.get(TEAM); if (!team2) return default_to_peaceful
    return team1.do_team_with(team2.team)
}