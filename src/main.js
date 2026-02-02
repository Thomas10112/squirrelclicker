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
import {initialState} from "./core/state.js";
import {industries, prixIndustries, peutAcheterIndustrie} from "./systems/machines/industries.js";
import { paliers } from "./systems/palier.js";

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

// texte flottant (gland) autour du centre
function apparaitreFlottant(text) {
    const div = document.createElement("div");
    div.className = "gland-flottant";
    
    // Image du gland
    const img = document.createElement("img");
    img.src = "/assets/img/items/glands-click.png";
    img.alt = "gland";
    
    // Texte (+X)
    const span = document.createElement("span");
    span.textContent = text;

    div.appendChild(img);
    div.appendChild(span);

    // Position aléatoire autour du clic (ou du centre)
    // On utilise des offsets aléatoires
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50; // Distance entre 50px et 100px du centre
    const randomX = Math.cos(angle) * distance;
    const randomY = Math.sin(angle) * distance;
    
    div.style.left = `calc(50% + ${randomX}px)`;
    div.style.top = `calc(50% + ${randomY}px)`;

    flottant.appendChild(div);

    // suppression après l’animation
    setTimeout(() => div.remove(), 800);
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

    const baseGps = gpsTotalIndustries();
    // Application du bonus global de production
    const bonusMult = state.bonus.prodGlobalMult ?? 0;
    const gps = baseGps * (1 + bonusMult);
    const gain = gps * dt;

    if (gain > 0) {
        state.glands += gain;
        state.glandsTotal += gain;
    }

    renderHUD();
    checkPaliers();

    // Rafraîchir le shop moins souvent (ex: toutes les 2 secondes)
    // pour que l'utilisateur ait le temps de cliquer sur les boutons de test
    // sans que l'élément soit recréé sous sa souris.
    if (now - lastShopUpdate > 2000) {
        updateShopUI();
        lastShopUpdate = now;
    }

    requestAnimationFrame(productionLoop);
}

let lastShopUpdate = performance.now();

/**
 * Met à jour l'état visuel du shop (boutons activés/désactivés)
 * sans tout reconstruire si possible, ou alors appelé seulement quand nécessaire.
 */
function updateShopUI() {
    renderShopPremiereMachine();
}

/* =========================
   CLICK (gain actif)
   =========================
   On utilise state.nbClics et state.glandsParClic si présent,
   sinon on garde ton compteur UI local.
*/
function onClick() {
    // calcul du gain au clic avec bonus
    const clickBonus = state.bonus.clickAdd ?? 0;
    const gainClic = (state.glandsParClic ?? 1) + clickBonus;

    // Mise à jour du state
    state.glands += gainClic;
    state.glandsTotal += gainClic;
    state.nbClics = (state.nbClics ?? 0) + 1;

    // UI
    compteur.textContent = fmt(state.glands);
    ajouterClasse();

    // Vérification des paliers au clic
    checkPaliers();

    // HUD
    renderHUD();
    updateShopUI();

    // flottant "+X"
    apparaitreFlottant(`+${fmt(gainClic)}`);
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

    <p>Prix: <b>${fmt(price)}</b> glands</p>
    <button class="btn btn-primary ${capped || !affordable ? "btn-disabled" : ""}">
      Acheter
    </button>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,.08);margin:12px 0;">

    <button class="btn btn-secondary" id="dbg-add">Ajout de 1000 glands</button>
  `;

    // Achat
    const buyBtn = card.querySelector(".btn-primary");
    buyBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // re-check (sécurité)
        if (!peutAcheterIndustrie(m, owned)) return;

        const currentOwned = state.machines?.[m.id] ?? 0;
        const currentPrice = prixIndustries(m.basePrix, currentOwned);

        if (state.glands < currentPrice) return;

        state.glands -= currentPrice;
        state.machines[m.id] = currentOwned + 1;

        updateShopUI();
        renderHUD();
    };

    // Debug +1000
    const dbgAddBtn = card.querySelector("#dbg-add");
    dbgAddBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.glands += 1000;
        state.glandsTotal += 1000;
        updateShopUI();
        renderHUD();
    };

    // Debug GPS
    const dbgGps = document.createElement("button");
    dbgGps.className = "btn btn-secondary";
    dbgGps.id = "dbg-gps";
    dbgGps.style.marginTop = "8px";
    dbgGps.textContent = "+1 I01 (Test GPS)";
    dbgGps.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentOwned = state.machines[m.id] ?? 0;
        state.machines[m.id] = currentOwned + 1;
        updateShopUI();
        renderHUD();
    };
    card.appendChild(dbgGps);

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

    // Mise à jour du compteur principal également
    if (compteur) compteur.textContent = fmt(state.glands);

    const elGps = document.getElementById("gps-value");
    if (elGps) {
        const baseGps = gpsTotalIndustries();
        const bonusMult = state.bonus.prodGlobalMult ?? 0;
        const gps = baseGps * (1 + bonusMult);
        elGps.textContent = gps.toFixed(2);
    }

    // On vérifie si on doit activer/désactiver les boutons du shop
    // sans forcément tout redraw si on veut être opti, mais pour l'instant
    // on va juste appeler updateShopUI de temps en temps ou ici si on accepte le redraw.
    // Pour éviter de casser les boutons de test pendant qu'on clique, on ne redraw
    // le shop dans renderHUD QUE si le nombre de glands a passé un seuil critique (ex: prix)
    // ou simplement on ne le fait PAS ici et on le laisse aux actions explicites.
}

/* =========================
   INIT
   ========================= */
function init() {
    // init compteur
    compteur.textContent = fmt(state.glands);

    // rendu initial
    renderShopPremiereMachine();
    renderHUD();
    checkPaliers();

    // démarre la production auto (même si gps=0 au début)
    requestAnimationFrame(productionLoop);
}

function checkPaliers() {
    for (const p of paliers) {
        // Si déjà fait, on passe
        if (state.paliersFaits[p.id]) continue;

        // Vérification condition
        let conditionRemplie = false;
        if (p.condition.type === "nbClics") {
            if (state.nbClics >= p.condition.valeur) {
                conditionRemplie = true;
            }
        } else if (p.condition.type === "glandsTotal") {
            if (state.glandsTotal >= p.condition.valeur) {
                conditionRemplie = true;
            }
        }

        if (conditionRemplie) {
            // Appliquer le bonus
            if (p.bonus.type === "clickAdd") {
                state.bonus.clickAdd = (state.bonus.clickAdd ?? 0) + p.bonus.valeur;
            } else if (p.bonus.type === "prodGlobalMult") {
                state.bonus.prodGlobalMult += p.bonus.valeur;
            }

            // Marquer comme fait
            state.paliersFaits[p.id] = true;

            // Notification (simple alert pour le moment ou console.log)
            console.log(`Palier débloqué : ${p.nom} - ${p.message}`);
            
            // Notification visuelle
            const notif = document.createElement("div");
            notif.className = "palier-notif";
            notif.innerHTML = `<strong>${p.nom}</strong><br>${p.message}`;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 4000);

            // On pourrait ajouter un petit message flottant spécial
            apparaitreFlottant(p.message);

            // Action spécifique pour le palier PC04 (l'écureuil qui saute)
            if (p.id === "PC04") {
                triggerJumpSquirrel();
            }
        }
    }
}

function triggerJumpSquirrel() {
    const container = document.getElementById("jump-container");
    const squirrel = document.getElementById("jump-squirrel");
    const bubble = document.getElementById("jump-bubble");

    if (!container || !squirrel || !bubble) return;

    // Rendre le conteneur visible
    container.classList.add("show-jump-container");

    // Faire apparaître la bulle
    setTimeout(() => {
        bubble.classList.add("show-bubble");
    }, 500);

    // Lancer le saut
    setTimeout(() => {
        squirrel.classList.add("anim-jump");
        spawnJumpTrees(container);
    }, 1500);

    // Faire tout disparaître après l'animation
    setTimeout(() => {
        container.classList.remove("show-jump-container");
        bubble.classList.remove("show-bubble");
        squirrel.classList.remove("anim-jump");
        // Nettoyer les arbres
        const trees = container.querySelectorAll(".jump-tree");
        trees.forEach(t => t.remove());
    }, 6000);
}

function spawnJumpTrees(container) {
    const keyframes = [
        { time: 0, x: 50 },      // 0%
        { time: 500, x: 400 },   // 25% (2s * 0.25 = 0.5s)
        { time: 1000, x: 800 },  // 50% (2s * 0.5 = 1s)
        { time: 1500, x: 1150 }, // 75% (2s * 0.75 = 1.5s)
        { time: 2000, x: 1500 }  // 100% (2s * 1 = 2s)
    ];

    keyframes.forEach(kf => {
        setTimeout(() => {
            const tree = document.createElement("img");
            tree.src = "./assets/img/items/arbre-jump.png";
            tree.className = "jump-tree";
            tree.style.left = `${kf.x}px`;
            container.appendChild(tree);
        }, kf.time);
    });
}

init();
