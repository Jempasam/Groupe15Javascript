import Serpent from './Serpent.js';
import Fruit from './Fruit.js';

let inputStates = {};
let vitesse = 5;
let angle = 0;
let debugGameOver = 0;

function definirEcouteurs() {
    document.addEventListener("keydown", traiteKeyDown);
}

// La fonction permet de détecter les touches enfoncées

function traiteKeyDown(event)
{
    const key = event.code;

    if (key === "ArrowRight") 
    {
        inputStates.right = true;
        inputStates.left = false;
        inputStates.down = false;
        inputStates.up = false;
        angle = 0;
    }

    else if (key === "ArrowLeft") 
    {
        inputStates.right = false;
        inputStates.left = true;
        inputStates.down = false;
        inputStates.up = false;
        angle = 0;
    }

    else if (key === "ArrowDown") 
    {
        inputStates.right = false;
        inputStates.left = false;
        inputStates.down = true;
        inputStates.up = false;
        angle = 0;
    }

    else if (key === "ArrowUp") 
    {
        inputStates.right = false;
        inputStates.left = false;
        inputStates.down = false;
        inputStates.up = true;
        angle = 0;
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

    if (inputStates.right)
    {
        serpent.move(vitesse,0);
    }

    if (inputStates.left)
    {
        serpent.move(- vitesse, 0);
    }

    if (inputStates.up)
    {
        serpent.move(0, - vitesse);
    }

    if (inputStates.down)
    {
        serpent.move(0, vitesse);
    }

    drawCanvas();
    hitbox();
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

        if ( serpentX >= segment.x && serpentX <= segment.x && serpentY >= segment.y && serpentY <= segment.y )
        {
            gameOver();
        }
    }

    // On définit une hitbox pour le serpent
    var margin = 22;

    // On check si le serpent est dans la hitbox du fruit
    if (Math.abs(serpentX - fruitX) <= margin && Math.abs(serpentY - fruitY) <= margin) 
    {
        mangerFruit();
    }

}

function mangerFruit() 
{
    serpent.AddNbFruits();
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



