// autoclick.js
// ==============================
// AUTO-CLICK SYSTEM (Gland Clicker)
// - Débloqué via upgrade uniquement (tu le gères ailleurs)
// - Simule un VRAI clic => appelle clickGland(state)
// - Commenté + testable
// ==============================

import {clickGland} from "./crit.js"; // clickGland inclut crit + stats + bestClick

// Timer interne (un seul auto-click loop à la fois)
let intervalId = null;

/**
 * Démarre l'auto-clic si activé et si CPS > 0
 * @param {object} state
 */
export function startAutoClick(state) {
    // Garde-fous
    if (!state?.autoClick) {
        console.warn("[AutoClick] state.autoClick manquant");
        return;
    }

    if (!state.autoClick.enabled) {
        console.log("[AutoClick] non activé (enabled=false)");
        return;
    }

    if (state.autoClick.clicksPerSecond <= 0) {
        console.log("[AutoClick] clicksPerSecond <= 0");
        return;
    }

    // Si déjà en route, on redémarre proprement (au cas où cps change)
    stopAutoClick();

    const intervalMs = Math.max(50, Math.floor(1000 / state.autoClick.clicksPerSecond));

    console.log(`[AutoClick] START - ${state.autoClick.clicksPerSecond} cps -> interval=${intervalMs}ms`);

    intervalId = setInterval(() => {
        // Si désactivé en cours de route, on stop
        if (!state.autoClick.enabled || state.autoClick.clicksPerSecond <= 0) {
            stopAutoClick();
            return;
        }

        // IMPORTANT : simule un vrai clic
        // -> gain, crit, stats, bestClick, tout passe par clickGland
        clickGland(state, {allowCrit: false}); // auto-clic = pas de crit
    }, intervalMs);
}

/**
 * Stoppe l'auto-clic si actif
 */
export function stopAutoClick() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("[AutoClick] STOP");
    }
}

/**
 * Met à jour l'auto-clic quand un upgrade change (enabled/cps)
 * -> à appeler après achat upgrade auto-click / reset prestige
 * @param {object} state
 */
export function updateAutoClick(state) {
    // Si désactivé => stop
    if (!state?.autoClick?.enabled || state.autoClick.clicksPerSecond <= 0) {
        stopAutoClick();
        return;
    }

    // Sinon (ré)start avec nouveaux paramètres
    startAutoClick(state);
}

// ==============================
// TESTS (à lancer depuis console / page test)
// ==============================

/**
 * Test 1 : active auto-click à 5 cps pendant 2 secondes.
 * Attendu : totalClicks augmente d'environ 10.
 */
export function testAutoClickBasic(state) {
    console.log("=== TEST AutoClick Basic ===");

    // reset stats min
    state.totalClicks = "0";
    state.glands = "0";

    // activer auto-click
    state.autoClick.enabled = true;
    state.autoClick.clicksPerSecond = 5;

    startAutoClick(state);

    setTimeout(() => {
        stopAutoClick();
        console.log("Clicks après 2s =", state.totalClicks, "(attendu ~10)");
        console.log("Glands =", state.glands);
    }, 2000);
}

/**
 * Test 2 : vérifie que l'auto-click déclenche des crits (si crit actif).
 * Tu peux augmenter la chance crit via state.multipliers.critChanceBps pour voir un effet.
 */
export function testAutoClickCrit(state) {
    console.log("=== TEST AutoClick Crit ===");

    state.totalClicks = "0";
    state.glands = "0";
    state.stats.crits = 0;

    // augmenter chance crit pour voir rapidement (ex: +20% => 2000 bps)
    state.multipliers.critChanceBps = 2000;

    state.autoClick.enabled = true;
    state.autoClick.clicksPerSecond = 20;

    startAutoClick(state);

    setTimeout(() => {
        stopAutoClick();
        console.log("Clicks =", state.totalClicks);
        console.log("Crits =", state.stats.crits, "(doit être > 0)");
    }, 1500);
}
