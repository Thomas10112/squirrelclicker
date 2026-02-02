/* =========================================================
   game.js (ou main.js)
   Objectif:
   1) Click -> gagne des glands
   2) Afficher la 1ère machine (I01) dans le shop
   3) Acheter I01 -> production automatique (glands/sec)
   4) Affichage: glands, GPS total, prix, quantité
   ========================================================= */

/* =========================
   IMPORTS (toujours en haut)
   ========================= */
import { initialState } from "./core/state.js";
import { industries, prixIndustries, peutAcheterIndustrie } from "./systems/machines/industries.js";

/* =========================
   STATE (état du jeu)
   =========================
   - contient les glands, les quantités, etc.
   - c'est L'OBJET que toutes les fonctions modifient
*/
let state = structuredClone(initialState);

/* =========================
   SELECTEURS DOM
   ========================= */
const clicker = document.querySelector("#clicker");      // bouton écureuil
const compteur = document.querySelector("#compteur");    // affichage compteur clics (UI)
const flottant = document.querySelector("#flottant");    // zone des textes flottants
const rootShop = document.getElementById("shop-machines"); // conteneur shop

if (!clicker || !compteur || !flottant) {
    throw new Error("HTML manquant: #clicker, #compteur, #flottant");
}
if (!rootShop) {
    throw new Error('HTML manquant: <div id="shop-machines"></div>');
}

/* =========================
   HELPERS UI
   ========================= */

// format entier FR
function fmt(n) {
    return Math.floor(n).toLocaleString("fr-FR");
}

// animation compteur
function ajouterClasse() {
    compteur.classList.remove("anim-compteur");
    // force reflow pour rejouer l'anim
    void compteur.offsetWidth;
    compteur.classList.add("anim-compteur");
}

// texte flottant autour du centre
function apparaitreFlottant(text) {
    const span = document.createElement("span");
    span.className = "gland";
    span.textContent = text;

    // position aléatoire autour du centre
    span.style.left = (50 + Math.random() * 20 - 10) + "%";
    span.style.top = (50 + Math.random() * 20 - 10) + "%";

    flottant.appendChild(span);

    // suppression après l’animation
    setTimeout(() => span.remove(), 600);
}

/* =========================
   ECONOMIE / PRODUCTION
   ========================= */

/**
 * Calcule le GPS TOTAL uniquement via les industries.
 * (pas encore de travailleurs/cosmiques ici)
 */
function gpsTotalIndustries() {
    let gps = 0;

    for (const ind of industries) {
        const q = state.machines?.[ind.id] ?? 0;

        // compatible si ton objet est {gps} OU {gives:{glandsParSec}}
        const unit = (ind.gps ?? ind.gives?.glandsParSec ?? 0);
        gps += unit * q;
    }
    return gps;
}

/**
 * Boucle de production:
 * - calcule dt (secondes écoulées)
 * - ajoute gps * dt aux glands
 * - rerender UI
 */
let lastTime = performance.now();
function productionLoop(now) {
    const dt = (now - lastTime) / 1000; // secondes
    lastTime = now;

    const gps = gpsTotalIndustries();
    const gain = gps * dt;

    if (gain > 0) {
        state.glands += gain;
        state.glandsTotal += gain;
    }

    renderShopPremiereMachine();
    renderHUD();

    requestAnimationFrame(productionLoop);
}

/* =========================
   CLICK (gain actif)
   =========================
   On utilise state.nbClics et state.glandsParClic si présent,
   sinon on garde ton compteur UI local.
*/
function onClick() {
    // compteur clics (UI + state)
    state.nbClics = (state.nbClics ?? 0) + 1;
    compteur.textContent = state.nbClics;
    ajouterClasse();

    // gain en glands au clic
    const gainClic = state.glandsParClic ?? 1;
    state.glands += gainClic;
    state.glandsTotal += gainClic;

    // flottant "+X"
    apparaitreFlottant(`+${gainClic}`);
}

clicker.addEventListener("click", onClick);

/* =========================
   SHOP: 1ère machine (I01)
   ========================= */

function renderShopPremiereMachine() {
    rootShop.innerHTML = "";

    // récupère I01
    const m = industries.find(x => x.id === "I01");
    if (!m) throw new Error("Machine I01 introuvable dans industries");

    const owned = state.machines?.[m.id] ?? 0;

    // IMPORTANT: ton export s'appelle prixIndustrie (singulier)
    const price = prixIndustries(m.basePrix, owned);

    const capped = !peutAcheterIndustrie(m, owned);
    const affordable = state.glands >= price;

    const gpsUnit = (m.gps ?? m.gives?.glandsParSec ?? 0);
    const gpsTotal = gpsTotalIndustries();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <div class="card-title">${m.nom}</div>
    <p class="card-muted">+${gpsUnit} glands/sec</p>
    <p>Possédé: <b>${owned} / ${m.max}</b></p>

    <p>GPS total: <b>${gpsTotal.toFixed(2)}</b> glands/sec</p>

    <p>Prix: <b>${fmt(price)}</b> glands</p>
    <button class="btn btn-primary ${capped || !affordable ? "btn-disabled" : ""}">
      Acheter
    </button>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,.08);margin:12px 0;">

    <p>Glands: <b>${fmt(state.glands)}</b></p>

    <button class="btn btn-secondary" id="dbg-add">+1000 glands (test)</button>
  `;

    // Achat
    const buyBtn = card.querySelector(".btn-primary");
    buyBtn.onclick = () => {
        // re-check (sécurité)
        if (!peutAcheterIndustrie(m, owned)) return;

        const currentOwned = state.machines?.[m.id] ?? 0;
        const currentPrice = prixIndustries(m.basePrix, currentOwned);

        if (state.glands < currentPrice) return;

        state.glands -= currentPrice;
        state.machines[m.id] = currentOwned + 1;

        renderShopPremiereMachine();
        renderHUD();
    };

    // Debug +1000
    card.querySelector("#dbg-add").onclick = () => {
        state.glands += 1000;
        renderShopPremiereMachine();
        renderHUD();
    };

    rootShop.appendChild(card);
}

/* =========================
   HUD: affichage global simple
   (si tu veux un endroit dédié)
   ========================= */
function renderHUD() {
    // Si tu veux afficher les glands ailleurs que la card:
    // ajoute un élément <span id="glands-value"></span> dans ton HTML
    const el = document.getElementById("glands-value");
    if (el) el.textContent = fmt(state.glands);

    const elGps = document.getElementById("gps-value");
    if (elGps) elGps.textContent = gpsTotalIndustries().toFixed(2);
}

/* =========================
   INIT
   ========================= */
function init() {
    // init compteur clics
    compteur.textContent = state.nbClics ?? 0;

    // rendu initial
    renderShopPremiereMachine();
    renderHUD();

    // démarre la production auto (même si gps=0 au début)
    requestAnimationFrame(productionLoop);
}

init();
