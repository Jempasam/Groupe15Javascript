//@ts-nocheck
import Serpent from './Serpent.js';
import Fruit from './Fruit.js';
import { playToDeath } from './Menu.js';

let inputStates = {};
let vitesse = 5;
let vitesseP = 0;
let angle = 0;
let debugGameOver = 0;
let PremierCoup = false;
let Pause = false;
let choixSkin = 0;
let son = true;
const HIGHSCORE_KEY = 'highscore';
let dureeBloquer = 50;

let toucheBloque = false;

let highscore = localStorage.getItem(HIGHSCORE_KEY);
if (!isNaN(highscore) && highscore % 1 === 0) 
{
    
}
else
{
    highscore = 0;
}

// Mode de jeu alternatifs

let mangerVitesse = false;
let mangerInversion = false;
let InversionTouche = false;
let miamFast = false;


const bouton1 = document.getElementById("modeVitesse");
const bouton2 = document.getElementById("modeInversion");
const bouton3 = document.getElementById("boutonSkin");
const bouton4 = document.getElementById("modeMiamFast");
const bouton5 = document.getElementById("modeSerpentLent");

var audio = document.getElementById('mangerAudio');

function definirEcouteurs() {

    document.getElementById("modeVitesse").addEventListener("click", function()
    {
        mangerVitesse = !mangerVitesse;
        if (mangerVitesse)
        {
            bouton1.classList.add("bouton-active"); // Ajoute la classe pour la brillance
        }
        else
        {
            bouton1.classList.remove("bouton-active"); // Ajoute la classe pour la brillance
        }
    });

    document.getElementById("modeMiamFast").addEventListener("click", function()
    {
        miamFast = !miamFast;
        if (miamFast)
        {
            bouton4.classList.add("bouton-active"); // Ajoute la classe pour la brillance
        }
        else
        {
            bouton4.classList.remove("bouton-active"); // Ajoute la classe pour la brillance
        }
    });

    document.getElementById("modeInversion").addEventListener("click", function()
    {        
        mangerInversion = !mangerInversion;
        if (mangerInversion)
        {
            bouton2.classList.add("bouton-active"); // Ajoute la classe pour la brillance
        }
        else
        {
            bouton2.classList.remove("bouton-active"); // Ajoute la classe pour la brillance
        }
    });

    document.getElementById("modeSerpentLent").addEventListener("click", function()
    {        
        if (dureeBloquer == 50)
        {
            bouton5.classList.add("bouton-active"); // Ajoute la classe pour la brillance
            dureeBloquer = 500;

        }
        else
        {
            bouton5.classList.remove("bouton-active"); // Ajoute la classe pour la brillance
            dureeBloquer = 50;
        }
    });

    document.getElementById("boutonSon").addEventListener("click", function()
    {
        
        const imgSon = document.getElementById("boutonSon").querySelector("img");
        
        
        if (son)
        {
            imgSon.src = "../assets/Mute.png";
            son = false;
        }
        else
        {
            imgSon.src = "../assets/Son.png"; // Ajoute la classe pour la brillance
            son = true;
        }
    });

    document.getElementById("boutonSkin").addEventListener("click", function()
    {        
        if (choixSkin < 3)
        {
            choixSkin ++;
        }
        else
        {
            choixSkin = 0;
        }

        // Mettre à jour l'image en fonction du choixSkin
        const img = document.getElementById("boutonSkin").querySelector("img");
        const animationSkin = document.getElementById("easterEggLien").querySelector("img");
        const easterEggLien = document.getElementById("easterEggLien");

        if (choixSkin === 0) 
        {
            img.src = "../assets/serpentManchot.png";
            animationSkin.src = "../assets/serpentManchot.png";
            easterEggLien.href = "https://fr.wikipedia.org/wiki/Manchot_empereur";
        } 
        else 
        {
            if (choixSkin === 1)
            {
                img.src = "../assets/serpentCanard.png";
                animationSkin.src = "../assets/serpentCanard.png";
                easterEggLien.href = "https://fr.wikipedia.org/wiki/Canard";
            }
            else
            {
                if (choixSkin === 2)
                {
                    img.src =  "../assets/serpentMariau.png";
                    animationSkin.src =  "../assets/serpentMariau.png";
                    easterEggLien.href = "https://fr.wikipedia.org/wiki/Mario_(personnage)"
                }
                else
                {
                    if (choixSkin === 3)
                    {
                        img.src = "../assets/serpentSerpent.png";
                        animationSkin.src = "../assets/serpentSerpent.png";
                        easterEggLien.href = "https://fr.wikipedia.org/wiki/Serpentes"
                    }
                }
            }
        }
    });



    document.addEventListener("keydown", traiteKeyDown);

    document.addEventListener("keydown", function(evt)
    {
        if (evt.code != "F12")
        {
            evt.preventDefault();
        }
    });
}

function traiteKeyDown(event)
{
    const key = event.code;

        // Ajouter la gestion de la touche "p"
        if (key === "KeyP") {
            pause();
        }

    if (key === "ArrowRight" && PremierCoup == false) 
    {
        inputStates.right = true;
        PremierCoup = true;
        vitesse = 5;
    }


    if (inputStates.left == false && !InversionTouche || inputStates.left == true && InversionTouche || inputStates.up == true || inputStates.down == true)
    {
        if (key === "ArrowRight" && toucheBloque == false) 
        {
            if (!InversionTouche)
            {
                inputStates.right = true;
                inputStates.left = false;
                angle = 0;
            }
            else
            {
                inputStates.right = false;
                inputStates.left = true;
                angle = Math.PI;
            }
            inputStates.up = false;
            inputStates.down = false;

        }
    }

    if (inputStates.right == false && !InversionTouche || inputStates.right == true && InversionTouche || inputStates.up == true || inputStates.down == true)
    {
        if (key === "ArrowLeft" && toucheBloque == false)  
        {
            inputStates.down = false;
            if (!InversionTouche)
            {
                inputStates.left = true;
                inputStates.right = false;
                angle = Math.PI;
            }
            else
            {
                inputStates.left = false;
                inputStates.right = true;
                angle = 0;
            }
            inputStates.up = false;
        }
    }

    if (inputStates.right == true  || inputStates.up == false && !InversionTouche || inputStates.up == true && InversionTouche || inputStates.left == true)
    {
        if (key === "ArrowDown" && toucheBloque == false)  
        {
            if (!InversionTouche)
            {
                inputStates.up = false;
                inputStates.down = true;
                angle = Math.PI /2;
            }
            else
            {
                inputStates.up = true;
                inputStates.down = false;
                angle = - Math.PI /2;
            }

            inputStates.left = false;

            inputStates.right = false;

        }
    }


    if (inputStates.right == true || inputStates.down == false && !InversionTouche || inputStates.down == true && InversionTouche || inputStates.left == true)
    {
        if (key === "ArrowUp" && toucheBloque == false) 
        {
            console.log("La vitesse est de : " + vitesse);
            inputStates.right = false;
            if (!InversionTouche)
            {
                inputStates.down = false;
                inputStates.up = true;
                angle = - Math.PI /2;
            }
            else
            {
                inputStates.down = true;
                inputStates.up = false;
                angle = Math.PI /2;
            }
            
            inputStates.left = false;
        }
    }

    if (key === "ArrowRight" || "ArrowLeft" || "ArrowDown" || "ArrowUp")
    {
        toucheBloque = true;
        setTimeout(() => {
            toucheBloque = false;
            console.log("touceBloque");
          }, dureeBloquer);        
    }
}

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// On démarre le tout avec les commandes

window.onload = init;
let canvas, ctx, serpent, fruit;

function init()
{
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");

    serpent = new Serpent();
    fruit = new Fruit();

    fruit.setPositionX(getRandomInt(100, 400));
    fruit.setPositionY(getRandomInt(100, 400));
    drawCanvas();

    definirEcouteurs();
    setInterval(() => {
        mainloop();
      }, 15);
    //requestAnimationFrame(mainloop);
}

// Permet de dessiner le serpent et les fruits

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    serpent.drawGrossir(ctx, 0.5, angle, choixSkin);
    serpent.drawSerpent(ctx, 0.5, angle, choixSkin);
    fruit.drawFruit(ctx, 0.5);
}


function mainloop()
{


    if (Pause == false)
    {
        if (inputStates.right)
        {
            vitesseP = vitesse;
            serpent.move(vitesse,0);
        }

        if (inputStates.left)
        {
            vitesseP = vitesse;
            serpent.move(- vitesse, 0);
        }

        if (inputStates.up)
        {
            vitesseP = vitesse;
            serpent.move(0, - vitesse);
        }

        if (inputStates.down)
        {
            vitesseP = vitesse;
            serpent.move(0, vitesse);
        }

    hitbox();
        
    }
    drawCanvas();
    
    //requestAnimationFrame(mainloop);
}

function hitbox() {

    // Récupérer les positions de la serpent et du fruit
    var serpentX = serpent.getPositionX();
    var serpentY = serpent.getPositionY();
    var fruitX = fruit.getPositionX();
    var fruitY = fruit.getPositionY();

    if (serpentX > 490 || serpentX < 1 || serpentY > 490 || serpentY < 1)
    {
        gameOver()
    }


    for (let i = 5; i < serpent.segments.length; i++) {
        let segment = serpent.segments[i];
        let segmentX = segment.x;
        let segmentY = segment.y;

        // On définit une hitbox pour chaque segment de la queue
        var marginS = 5.5; // Ajustez cette valeur selon votre préférence

        // On vérifie la collision avec le segment actuel
        if (Math.abs(serpentX - segmentX) <= marginS && Math.abs(serpentY - segmentY) <= marginS) {
            gameOver();
        }
    }


    // On définit une hitbox pour le serpent
    var margin = 22;

    // On check si le serpent est dans la hitbox du fruit
    if (Math.abs(serpentX - fruitX) <= margin && Math.abs(serpentY - fruitY) <= margin) 
    {
        TeleportationFruit();
        hitbox();
        mangerFruit();
    }

}



function mangerFruit() 
{
    //audio.play();
    if (son)
    {
        audio.play();
    }


    serpent.AddNbFruits();
    serpent.positionQueue();
    afficherScore()

    if (!mangerVitesse)
    {
        setTimeout(() => {
            serpent.AddNbFruits();
            serpent.positionQueue();;
            afficherScore()
          }, 10);

    }

    else
    {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                serpent.AddNbFruits();
                serpent.positionQueue();;
                afficherScore()
              }, 10);
        }

    }



    //Changement du mode de jeu alternatif
    if (miamFast)
    {
        vitesse = vitesse + 0.1;
        vitesseP = vitesse;
    }
    
    if (mangerInversion)
    {
        InversionTouche = !InversionTouche;
    }

}

function TeleportationFruit()
{
    fruit.setPositionX(getRandomInt(100, 400));
    fruit.setPositionY(getRandomInt(100, 400));
}


function gameOver() 
{
    angle = 0;
    if (inputStates.left)
    {
        inputStates.left = false;
        inputStates.right = true;
    }
    let score;
    const ModeVitesseImage = document.getElementById("ModeDeJeu2");
    const ModeInversionImage = document.getElementById("ModeDeJeu1");
    const ModeMiamFastImage = document.getElementById("ModeDeJeu3");
    const ModeSerpentLentImage = document.getElementById("ModeDeJeu4");

    if (!mangerVitesse)
    {
        score = serpent.segments.length / 2;
        console.log("Mon score est de : ", score);
    }
    else
    {
        score = serpent.segments.length / 4;
    }
    
        // Code à exécuter en cas de collision avec la queue
        //console.log("Game Over - Le serpent a touché sa propre queue! Nombre de Game Over = ", debugGameOver);
        debugGameOver ++;
        vitesse = 0;
        // Appeler playToDeath() de Menu.js
        playToDeath();
        console.log("Le HighScore est de : ", highscore);
        if (score > highscore)
        {
            highscore = score;
            localStorage.setItem(HIGHSCORE_KEY, highscore);
        }
        document.querySelector(".ScoreNow").textContent = score;
        document.querySelector(".HighScoreChiffre").textContent = highscore;

        if (mangerVitesse)
        {
            ModeVitesseImage.style.display = "block";
        }
        else
        {
            ModeVitesseImage.style.display = "none";
        }

        if (mangerInversion)
        {
            ModeInversionImage.style.display = "block";
        }
        else
        {
            ModeInversionImage.style.display = "none";
        }

        if (miamFast)
        {
            ModeMiamFastImage.style.display = "block";
        }
        else
        {
            ModeMiamFastImage.style.display = "none";
        }

        if (dureeBloquer == 500)
        {
            ModeSerpentLentImage.style.display = "block";
        }
        else
        {
            ModeSerpentLentImage.style.display = "none";
        }

        
    
}

export function reset()
{
    serpent.setPositionX(50);
    serpent.setPositionY(50);
    serpent.setNbFruits(0);
    PremierCoup = false;
    InversionTouche = false;

}


function pause()
{
            if (Pause)
            {
                vitesse = vitesseP;
                Pause = false;
            }
            else
            {
                vitesse = 0;
                Pause = true;
            }

}


export function afficherScore()
{
    if (!mangerVitesse)
    {
        document.querySelector(".NombrePoints").textContent = Math.round(serpent.segments.length / 2);
    }
    else
    {
        document.querySelector(".NombrePoints").textContent = Math.round(serpent.segments.length / 4);
    }



}
