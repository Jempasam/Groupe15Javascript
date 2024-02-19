import Serpent from './Serpent.js';
import Fruit from './Fruit.js';

let inputStates = {};
let vitesse = 5;
let vitesseP = 0;
let angle = 0;
let debugGameOver = 0;
let PremierCoup = false;
let Pause = false;

// Mode de jeu alternatifs

let mangerVitesse = false;
let mangerInversion = false;
let InversionTouche = false;


const bouton1 = document.getElementById("modeVitesse");
const bouton2 = document.getElementById("modeInversion");

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



    document.addEventListener("keydown", traiteKeyDown);

    document.addEventListener("keydown", function(evt)
    {
        if (evt.code != "F12")
        {
            evt.preventDefault();
        }
    });
}

// La fonction permet de détecter les touches enfoncées

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

    if (inputStates.left == false || inputStates.up == true || inputStates.down == true)
    {
        if (key === "ArrowRight") 
        {
            if (!InversionTouche)
            {
                inputStates.right = true;
            }
            else
            {
                inputStates.right = false;
            }
            inputStates.up = false;
            inputStates.down = false;

            if (!InversionTouche)
            {
                inputStates.left = false;
            }
            else
            {
                inputStates.left = true;
            }
            angle = 0;
        }
    }

    if (inputStates.right == false || inputStates.up == true || inputStates.down == true)
    {
        if (key === "ArrowLeft") 
        {
            inputStates.down = false;
            if (!InversionTouche)
            {
                inputStates.left = true;
            }
            else
            {
                inputStates.left = false;
            }

            if (!InversionTouche)
            {
            inputStates.right = false;
            }
            else
            {
                inputStates.right = true;
            }
            inputStates.up = false;
            angle = 0;
        }
    }

    if (inputStates.right == true || inputStates.up == false || inputStates.left == true)
    {
        if (key === "ArrowDown") 
        {
            if (!InversionTouche)
            {
                inputStates.up = false;
            }
            else
            {
                inputStates.up = true;
            }

            inputStates.left = false;

            if (!InversionTouche)
            {
                inputStates.down = true;
            }
            else
            {
                inputStates.down = false;
            }

            inputStates.right = false;
            angle = 0;
        }
    }


    if (inputStates.right == true || inputStates.down == false || inputStates.left == true)
    {
        if (key === "ArrowUp") 
        {
            inputStates.right = false;
            if (!InversionTouche)
            {
                inputStates.down = false;
            }
            else
            {
                inputStates.down = true;
            }
            
            inputStates.left = false;

            if (!InversionTouche)
            {
                inputStates.up = true;
            }
            else
            {
                inputStates.up = false;
            }

            angle = 0;
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
    serpent.drawGrossir(ctx, 0.5, angle);
    serpent.drawSerpent(ctx, 0.5, angle);
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
    serpent.AddNbFruits();
    serpent.positionQueue();
    afficherScore()
    
   setTimeout(() => {
        serpent.AddNbFruits();
        serpent.positionQueue();;
        afficherScore()
      }, 10);

    if (mangerVitesse)
    {
        vitesse = vitesse + 0.1;
        vitesseP = vitesse;
    }
    
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
    document.getElementById("score").innerHTML = "Score : " + Math.round(serpent.segments.length / 2); 
}
