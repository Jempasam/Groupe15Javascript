import { dom } from "../../samlib/DOM.mjs";
import { ACCOUNT_STORAGE } from "../../samlib/Storage.mjs";

document.addEventListener('DOMContentLoaded', function() {
    // Récupère l'utilisateur
    let current_user_data=ACCOUNT_STORAGE.current_user_data

    var connexionButton = document.getElementById('connexionButton');
    var profileIcon = document.getElementById('profileIcon');

    // Si l'utilisateur est connecté, afficher le bouton de déconnexion
    if (current_user_data) {
        console.log("Connected as "+current_user_data.name);
        profileIcon.style="display: block;"

        var profileLink = document.getElementById('profileLink');
        profileLink.setAttribute('href', 'profile.html');
        var profileImage = document.querySelector('.profile-image');
        profileImage.setAttribute('src', current_user_data.image);
        
        var deconnexionButton = 
            dom/*html*/`<a class="button" href="connexion.html">Se Déconnecter</a>`

        // @ts-ignore
        deconnexionButton.addEventListener('click', function() {
            ACCOUNT_STORAGE.current_user = null;
            location.reload();
        });

        // Remplacer le bouton de connexion par le bouton de déconnexion
        connexionButton.parentNode.replaceChild(deconnexionButton, connexionButton);
    }
});