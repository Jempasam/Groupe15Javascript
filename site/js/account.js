document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est connecté
    var utilisateurConnecteJSON = sessionStorage.getItem('utilisateurConnecte');
    console.log(utilisateurConnecteJSON);
    var utilisateurConnecte = utilisateurConnecteJSON ? JSON.parse(utilisateurConnecteJSON) : null;

    // Sélectionner le bouton de connexion
    var connexionButton = document.getElementById('connexionButton');
    var profileIcon = document.getElementById('profileIcon');

    // Si l'utilisateur est connecté, afficher le bouton de déconnexion
    if (utilisateurConnecte) {
        var profileLink = document.getElementById('profileLink');
        profileLink.setAttribute('href', 'profile.html'); // Lien vers le profil de l'utilisateur

        // Afficher l'icône de profil avec le chemin spécifié dans le LocalStorage
        profileIcon.style.display = 'block';
        var profileImage = document.querySelector('.profile-image');
        profileImage.setAttribute('src', utilisateurConnecte.profileImage);

        var deconnexionButton = document.createElement('a');
        deconnexionButton.setAttribute('class', 'button');
        deconnexionButton.setAttribute('href', 'connexion.html'); // Lien vers la déconnexion
        deconnexionButton.textContent = 'Se Déconnecter';
        deconnexionButton.addEventListener('click', function() {
            // Mettre à jour le sessionStorage lors de la déconnexion
            sessionStorage.clear();
            // Recharger la page pour refléter les changements
            location.reload();
        });

        // Remplacer le bouton de connexion par le bouton de déconnexion
        connexionButton.parentNode.replaceChild(deconnexionButton, connexionButton);
    }
});