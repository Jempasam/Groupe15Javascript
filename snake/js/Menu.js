// Menu.js

// Récupération du bouton dans le DOM
const toggleMenuButton = document.getElementById('toggleMenuButton');
// Récupération du canvas menuPrincipal
const divMenu = document.getElementById('menuJeu');
const divJeu = document.getElementById('ecranjeu');

// Booléen pour contrôler la visibilité du canvas
let isMenuVisible = true;

// Fonction pour changer la visibilité du canvas

function toggleMenuVisibility() {

  
  // Change la visibilité du canvas en fonction du booléen
  divMenu.style.display = 'none';

  divJeu.style.display = 'block';
}

// Ajout d'un écouteur d'événement pour détecter le clic sur le bouton
toggleMenuButton.addEventListener('click', () => {
  // Appel de la fonction pour changer la visibilité du canvas
  toggleMenuVisibility();
});
