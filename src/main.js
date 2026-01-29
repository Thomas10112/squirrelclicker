let clicker = document.querySelector("#clicker");
let compteur = document.querySelector("#compteur");
let flottant = document.querySelector("#flottant");
let compteurClick = 0;
// ===== EVENEMENT AU CLIQUE DU BOUTON ECUREUIL =====
function onClick() {
    compteurClick++;
    compteur.textContent = compteurClick;
    apparaitreFlottant();
}
clicker.addEventListener("click", onClick);

function apparaitreFlottant(text) {
    const span = document.createElement("span");
    span.className = "gland";
    span.textContent = text;

    // position aléatoire autour du centre
    span.style.left = (50 + Math.random() * 20 - 10) + "%";
    span.style.top = (50 + Math.random() * 20 - 10) + "%";

    flottant.appendChild(span);

    // suppression après l’animation
    setTimeout(() => {
        span.remove();
    }, 600);
}


