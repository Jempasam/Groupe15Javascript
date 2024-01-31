import Serpent from './Serpent.js';
import Fruit from './Fruit.js';

let inputStates = {};
let vitesse = 5;
let angle = 0;

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
        angle = Math.PI;
    }

    else if (key === "ArrowDown") 
    {
        inputStates.right = false;
        inputStates.left = false;
        inputStates.down = true;
        inputStates.up = false;
        angle = 1.5708;
    }

    else if (key === "ArrowUp") 
    {
        inputStates.right = false;
        inputStates.left = false;
        inputStates.down = false;
        inputStates.up = true;
        angle = -1.5708;
    }
}

function getRandomInt(max)
{
    return Math.floor(Math.random() * max);
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

    fruit.setPositionX(getRandomInt(500));
    fruit.setPositionY(getRandomInt(500));
    drawCanvas();

    definirEcouteurs();
    requestAnimationFrame(mainloop);
}

// Permet de dessiner le serpent et les fruits

function drawCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    serpent.drawSerpent(ctx, 0.5, angle);
    fruit.drawFruit(ctx, 0.5);
    serpent.drawGrossir(ctx,0.5,angle);
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

    // Définir la marge
    var margin = 22;

    // Vérifier si la serpent et le fruit se trouvent dans la même zone avec la marge
    if (Math.abs(serpentX - fruitX) <= margin && Math.abs(serpentY - fruitY) <= margin) {
        // Collision détectée
        mangerFruit();
    }


}

function mangerFruit()
{
    console.log("NB FRUIT = ", serpent.getNbFruits());
    serpent.AddNbFruits();
    fruit.setPositionX(getRandomInt(500));
    fruit.setPositionY(getRandomInt(500));
}
