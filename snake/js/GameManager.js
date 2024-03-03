import Serpent from './Serpent.js';
import Fruit from './Fruit.js';

let inputStates = {};
let vitesse = 5;
let vitesseP = 0;
let angle = 0;
let debugGameOver = 0;
let PremierCoup = false;
let Pause = false;
let choixSkin = 0;

// Mode de jeu alternatifs

let mangerVitesse = false;
let mangerInversion = false;
let InversionTouche = false;


const bouton1 = document.getElementById("modeVitesse");
const bouton2 = document.getElementById("modeInversion");
const bouton3 = document.getElementById("boutonSkin");

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

    document.getElementById("boutonSkin").addEventListener("click", function()
    {        
        if (choixSkin < 1)
        {
            choixSkin ++;
        }
        else
        {
            choixSkin = 0;
        }

        // Mettre à jour l'image en fonction du choixSkin
        const img = document.getElementById("boutonSkin").querySelector("img");
        if (choixSkin === 0) 
        {
            img.src = "../../snake/assets/serpentManchot.png";
        } else 
        {
            img.src = "../../snake/assets/serpentCanard.png";
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
    }



    if (inputStates.left == false && !InversionTouche || inputStates.left == true && InversionTouche || inputStates.up == true || inputStates.down == true)
    {
        if (key === "ArrowRight") 
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
        if (key === "ArrowLeft") 
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
        if (key === "ArrowDown") 
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
        if (key === "ArrowUp") 
        {
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
    requestAnimationFrame(mainloop);
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
    requestAnimationFrame(mainloop);
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


    for (let i = 1; i < serpent.segments.length; i++) 
    {
        console.debug("La taille du serpent est de = ",serpent.segments.length);
        let segment = serpent.segments[i];

        // On détecte une collision entre le serpent et sa queue

        if ( serpentX == segment.x && serpentY == segment.y )
        {
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
    //if (mangerVitesse)
    //{
    //    vitesse = vitesse + 0.1;
    //    vitesseP = vitesse;
    //}
    
    if (mangerInversion)
    {
        InversionTouche = !InversionTouche;

        if (InversionTouche)
        {
            console.log ("TRUCE");
        }

        if (!InversionTouche)
        {
            console.log ("WHILIS");
        }
    }

}

function TeleportationFruit()
{
    fruit.setPositionX(getRandomInt(100, 400));
    fruit.setPositionY(getRandomInt(100, 400));
}


function gameOver() 
{
    // Code à exécuter en cas de collision avec la queue
    console.log("Game Over - Le serpent a touché sa propre queue! Nombre de Game OVer = ", debugGameOver);
    debugGameOver ++;
    vitesse = 0;
    // Afficher une boîte de dialogue avec un message et un bouton OK
    alert("Vous avez perdu!");

    // Redémarrer la partie (recharger la page)
    window.location.reload();
    
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


function afficherScore()
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
