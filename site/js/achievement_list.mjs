import { AchievementsStorage } from "../../samlib/Achievements.mjs"

const img= url => import.meta.resolve("../img/"+url)

export const achievement_list = {
    "puissance4":{
        name:"Puissance 4",
        achievements:{
            "row":{
                name: "Victoire",
                desc: "Réalisez un puissance 4 !",
                img: img("../img/achievement/puissance4/row.png"),
                max:1
            },
            "50row":{
                name: "Gros joueur",
                desc: "Réalisez 50 puissance 4 !",
                img: img("../img/achievement/puissance4/row.png"),
                max:50
            },
            "row5":{
                name: "Tacticien confirmé",
                desc: "Réalisez un puissance 5 !",
                img: img("../img/achievement/puissance4/row5.png"),
                max:1
            },
            "50row5":{
                name: "Quel masterclass!",
                desc: "Réalisez 50 puissance 5 !",
                img: img("../img/achievement/puissance4/row5.png"),
                max:50
            },

            "10money":{
                name: "Argent de pauvre",
                desc: "Gagnez 10 pièces!",
                img: img("../img/achievement/puissance4/dollar.png"),
                max:10
            },
            "50money":{
                name: "Argent de poche",
                desc: "Gagnez 50 pièces!",
                img: img("../img/achievement/puissance4/dollar.png"),
                max:50
            },
            "100money":{
                name: "Argent de porsche",
                desc: "Gagnez 200 pièces!",
                img: img("../img/achievement/puissance4/dollar.png"),
                max:200
            },

            "10bocal":{
                name: "A cassé bocal!",
                desc: "Cassez 20 bocaux!",
                img: img("../img/achievement/puissance4/bocal.png"),
                max:20
            },
            "100bocal":{
                name: "A plus bocal!",
                desc: "Cassez 100 bocaux! Et calmez-vous un peu!",
                img: img("../img/achievement/puissance4/bocal.png"),
                max:100
            },

            "20boom":{
                name: "Petit malin",
                desc: "Cassez 20 objets avec des bombes!",
                img: img("../img/achievement/puissance4/boom.png"),
                max:20
            },
            "200boom":{
                name: "Réel psychopathe",
                desc: "Cassez 200 objets avec des bombes!",
                img: img("../img/achievement/puissance4/boom.png"),
                max:200
            },

            "coolbubble":{
                name: "Merci la bulle!",
                desc: "Terminez un puissance 4 en prenant appuie sur une bulle!",
                img: img("../img/achievement/puissance4/bubble.png"),
                max:1
            },
            "green":{
                name: "Le vert",
                desc: "Faites 10 puissance 4 avec le joueur vert.",
                img: img("../img/achievement/puissance4/green.png"),
                max:10
            },
            "spawner":{
                name: "Ferme à moblin 1lvl/min",
                desc: "Faites apparaitre 200 objets avec un spawner",
                img: img("../img/achievement/puissance4/spawner.png"),
                max:100
            },
            "snake":{
                name: "C'est le puissance 4 ça?",
                desc: "Mangez 100 pommes en une seule fois avec un snake normal.",
                img: img("../img/achievement/puissance4/snake.png"),
                max:100
            },
            "masterhand":{
                name: "Soirée entre potes",
                desc: "Faites invoquez 5 masterhands à des masterhands.",
                img: img("../img/achievement/puissance4/masterhand.png"),
                max: 5
            },
            "goomboom":{
                name: "Goomboom (alias Boomba)",
                desc: "Explosez un goomba avec un objet météore",
                img: img("../img/achievement/puissance4/goomboom.png"),
                max: 1
            },
            "fratricide":{
                name: "Fratricide",
                desc: "Attaquez 10 links avec des links",
                img: img("../img/achievement/puissance4/fratricide.png"),
                max: 10
            },
            "kidnap":{
                name: "Kidnapping",
                desc: "Faites attraper un link à un lynel.",
                img: img("../img/achievement/puissance4/kidnap.png"),
                max: 1
            },
            "crush":{
                name: "Roi des gateaux",
                desc: "Detruisez 10 gâteaux en un seul coup.",
                img: img("../img/achievement/puissance4/crush.png"),
                max: 10
            },
            "crush30":{
                name: "Dieu des gateaux",
                desc: "Detruisez 30 gâteaux en un seul coup.",
                img: img("../img/achievement/puissance4/crush.png"),
                max: 30
            },
            "miner":{
                name: "Marteau-piqueur",
                desc: "Brisez 30 blocs de roche..",
                img: img("../img/achievement/puissance4/miner.png"),
                max: 30
            },

            "apple1":{
                name: "Mmmhh, une pomme!",
                desc: "Faites manger une pomme à un snake.",
                img: img("../img/achievement/puissance4/apple1.png"),
                max: 1
            },
            "apple50":{
                name: "Gros gourmand",
                desc: "Faites manger 50 pommes à un snake.",
                img: img("../img/achievement/puissance4/apple2.png"),
                max: 50
            },
            "apple300":{
                name: "Indigestion de pommes",
                desc: "Faites monter le cours de la pomme en en mangeant 300!",
                img: img("../img/achievement/puissance4/apple3.png"),
                max: 300
            },


            "buy5":{
                name: "Faire son marché",
                desc: "Achetez 5 objets et rendez vous compte de la qualité de ce jeu.",
                img: img("../img/achievement/puissance4/dollar.png"),
                max: 5
            },
            "buy20":{
                name: "Le maître du jeu",
                desc: "Achetez 20 objets.",
                img: img("../img/achievement/puissance4/dollar.png"),
                max: 20
            },
            "buy40":{
                name: "Loup Esprit Sauvage de Wallstreet",
                desc: "Achetez 40 objets, vous êtes un tradeur hors pairs.",
                img: img("../img/achievement/puissance4/dollar.png"),
                max: 40
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
    },
    "snake":{
        name:"Snake",
        achievements:{
            "game1":{
                name: "Vers de pomme",
                desc: "Jouer 1 partie",
                img: "../../snake/assets/fruit1.png",
                max:1
            },
            "win1":{
                name: "1 pomme par jour éloigne le médecin",
                desc: "Obtenir 1 point",
                img: "../../snake/assets/fruit1.png",
                max:1
            },
            "win10":{
                name: "Serpent gourmet",
                desc: "Obtenir 10 points",
                img: "../../snake/assets/fruit1.png",
                max:10
            },
            "win20":{
                name: "Maître serpent",
                desc: "Obtenir 20 points",
                img: "../../snake/assets/fruit1.png",
                max:20
            },
            "win50":{
                name: "Roi des serpents",
                desc: "Obtenir 50 points",
                img: "../../snake/assets/fruit1.png",
                max:50
            },
            "win100":{
                name: "SSSSSSSSERPENT",
                desc: "Obtenir 100 points",
                img: "../../snake/assets/fruit1.png",
                max:100
            },
            "win0":{
                name: "Faux départ",
                desc: "Obtenir 0 point",
                img: "../../snake/assets/fruit1.png",
                max: 1
            },
            "Gamemode4":{
                name: "Fiesta",
                desc: "Jouer avec les 4 modes de jeux en même temps",
                img: "../../snake/assets/fruit1.png",
                max: 1
            },
            "SkinClick":{
                name: "Diplome",
                desc: "Avoir cliquer sur un skin pour accéder à sa page wikipédia",
                img: "../../snake/assets/fruit1.png",
                max: 1
            },
            "noisrevnI":{
                name: "noisrevnI",
                desc: "Avoir marqué 10 points avec le mode de jeu Inversion",
                img: "../../snake/assets/fruit1.png",
                max: 10
            }
        }
    }
}

export const achievement_registry=new AchievementsStorage(achievement_list)