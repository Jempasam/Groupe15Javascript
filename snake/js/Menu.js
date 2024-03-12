//@ts-nocheck
import { reset } from './GameManager.js';
import { afficherScore } from './GameManager.js';

// Menu.js


const toggleMenuButton = document.getElementById('toggleMenuButton');
const buttonReset = document.getElementById('boutonReset');

const divMenu = document.getElementById('menuJeu');
const divJeu = document.getElementById('ecranjeu');
const divMort = document.getElementById('ecranGameOver');


function mainToPlay() 
{
  divMenu.style.display = 'none';

  divJeu.style.display = 'block';
}

export function playToDeath()
{
  divMort.style.display = 'block';

  divJeu.classList.add('blur');
}

function deathToMain()
{
  reset();
  divMort.style.display = 'none';
  divMenu.style.display = 'flex';
  divJeu.style.display= 'none';
  divJeu.classList.remove('blur');
}

// Ajout d'un écouteur d'événement pour détecter le clic sur le bouton
toggleMenuButton.addEventListener('click', () => 
{
  afficherScore();
  mainToPlay();
});

buttonReset.addEventListener('click', () =>
{
  deathToMain();
});