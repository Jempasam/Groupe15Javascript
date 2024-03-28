import { AchievementsStorage } from "../../samlib/Achievements.mjs"

const img= url => import.meta.resolve("../img/"+url)

export const achievement_list = {
    "puissance4":{
        name:"Puissance 4",
        achievements:{
            "acheter":{
                name: "Victoires",
                desc: "Gagnez une partie",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:5
            },
            "win5":{
                name: "Victoires en série",
                desc: "Gagnez 5 parties d'affilée",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:1
            },
            "win10":{
                name: "Victoires en série",
                desc: "Gagnez 10 parties d'affilée",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:1
            },
        }
    },
    "tictactoe":{
        name:"Morpion",
        achievements:{
            "win":{
                name: "Victoires",
                desc: "Gagnez une partie",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:1
            },
            "win5":{
                name: "Victoires en série",
                desc: "Gagnez 5 parties d'affilée",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:1
            },
            "win10":{
                name: "Victoires en série",
                desc: "Gagnez 10 parties d'affilée",
                img: "https://www.shutterstock.com/image-vector/golden-crown-gradient-mesh-vector-600nw-599734505.jpg",
                max:1
            },
        }
    }
}

export const achievement_registry=new AchievementsStorage(achievement_list)