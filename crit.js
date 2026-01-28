// ==============================
// CRIT SYSTEM (Gland Clicker)
// Objectif : crit sur clic uniquement, scalable via upgrades
// BigInt only, avec tests console
// ==============================

// ---------- CONFIG CRIT (tu ajusteras plus tard) ----------
const CRIT_CONFIG = {
    // chance en basis points (bps): 100 = 1%, 250 = 2.5%
    baseChanceBps: 100,     // 1% de base
    // multiplicateur crit en bps: 20000 = x2.00, 35000 = x3.50
    baseMultBps: 20000      // x2 de base
};

// ---------- HELPERS BigInt ----------
const BI = (v) => BigInt(v);

/**
 * Applique un multiplicateur en bps à une valeur BigInt-string.
 * @param {string} valueStr BigInt en string
 * @param {number} multBps multiplicateur en bps (10000=x1)
 * @returns {string} BigInt en string
 */
function applyBps(valueStr, multBps) {
    return (BI(valueStr) * BigInt(multBps) / 10000n).toString();
}

/**
 * Addition BigInt-string.
 */
function addStr(a, b) {
    return (BI(a) + BI(b)).toString();
}

// ---------- RNG sécurisé simple ----------
/**
 * Tire un nombre entier entre 0 et 9999 inclus (pour bps).
 */
function rollBps() {
    return Math.floor(Math.random() * 10000);
}

// ---------- Crit state init (ajouter dans ton state si pas déjà) ----------
// Ajoute dans state.stats si tu veux : crits, bestClick déjà présent.
// Ici on utilise : state.stats.crits (int) et state.stats.bestClick (BigInt string).

/**
 * Calcule la chance crit actuelle (bps)
 * Scalability via upgrades: tu augmenteras state.multipliers.critChanceBps par exemple.
 * Pour l'instant, on utilise CRIT_CONFIG + un bonus stocké dans state (optionnel).
 */
function getCritChanceBps(state) {
    const bonus = state.multipliers?.critChanceBps ?? 0; // number
    return CRIT_CONFIG.baseChanceBps + bonus;
}

/**
 * Calcule le multiplicateur crit actuel (bps)
 * Scalability via upgrades: state.multipliers.critMultBps
 */
function getCritMultBps(state) {
    const bonus = state.multipliers?.critMultBps ?? 0; // number
    return CRIT_CONFIG.baseMultBps + bonus;
}

/**
 * Applique un crit (ou non) sur un gain de clic.
 * @returns {{ finalGain: string, isCrit: boolean, rolled: number, chance: number, mult: number }}
 */
function applyCritOnClick(state, baseGainStr) {
    const chance = getCritChanceBps(state);  // bps
    const mult = getCritMultBps(state);      // bps
    const rolled = rollBps();

    const isCrit = rolled < chance;

    const finalGain = isCrit ? applyBps(baseGainStr, mult) : baseGainStr;

    return {finalGain, isCrit, rolled, chance, mult};
}

// ---------- Intégration dans clickGland ----------
/**
 * Gain par clic = baseClick × clickBps × prestigeBps (déjà chez toi)
 * puis crit éventuel.
 *
 * Ici on suppose que tu as déjà une fonction getClickGainSansCrit(state)
 * qui renvoie le gain "normal" sans crit.
 */
function getClickGainSansCrit(state) {
    // Exemple minimal : baseClick + multiplicateurs existants
    let gain = state.baseClick;

    // multiplicateur clic global
    gain = applyBps(gain, state.multipliers.clickBps);

    // prestige
    gain = applyBps(gain, state.multipliers.prestigeBps);

    return gain;
}

/**
 * Clic principal (manuel ou auto-clic simulé)
 */
/**
 * @param {object} state
 * @param {object} options
 * @param {boolean} options.allowCrit - true pour clic manuel, false pour auto-clic
 */
export function clickGland(state, { allowCrit = true } = {}) {
    // 1) Gain normal
    const baseGain = getClickGainSansCrit(state);

    let finalGain = baseGain;
    let isCrit = false;

    // 2) Crit UNIQUEMENT si autorisé
    if (allowCrit) {
        const critResult = applyCritOnClick(state, baseGain);
        finalGain = critResult.finalGain;
        isCrit = critResult.isCrit;

        if (isCrit) {
            state.stats.crits = (state.stats.crits || 0) + 1;
        }
    }

    // 3) Appliquer les gains
    state.glands = addStr(state.glands, finalGain);
    state.totalGlandsEarned = addStr(state.totalGlandsEarned, finalGain);
    state.totalClicks = addStr(state.totalClicks, "1");

    // 4) Best click
    if (BigInt(finalGain) > BigInt(state.stats.bestClick)) {
        state.stats.bestClick = finalGain;
    }
}



// ==============================
// TESTS CONSOLE
// ==============================

/**
 * Test 1 : vérifier que ça clique sans casser le state
 */
function testCritBasic(state) {
    console.log("=== TEST 1 Crit Basic ===");
    const before = state.glands;
    clickGland(state);
    console.log("Glands avant:", before, "après:", state.glands);
}

/**
 * Test 2 : forcer un crit (chance=10000) pour vérifier multiplication
 */
function testCritForce(state) {
    console.log("=== TEST 2 Crit Force ===");

    // sauvegarder anciens bonus
    const oldChance = state.multipliers.critChanceBps ?? 0;
    const oldMult = state.multipliers.critMultBps ?? 0;

    // Forcer 100% crit (10000 bps)
    state.multipliers.critChanceBps = 10000 - CRIT_CONFIG.baseChanceBps;
    // Forcer mult x3 (30000 bps) au total
    state.multipliers.critMultBps = 30000 - CRIT_CONFIG.baseMultBps;

    // baseClick = 10, clickBps=10000, prestige=10000 => baseGain=10
    state.baseClick = "10";
    state.multipliers.clickBps = 10000;
    state.multipliers.prestigeBps = 10000;

    // click
    const before = BI(state.glands);
    clickGland(state);
    const after = BI(state.glands);

    console.log("Delta glands =", (after - before).toString(), "(attendu 30)");

    // restore
    state.multipliers.critChanceBps = oldChance;
    state.multipliers.critMultBps = oldMult;
}

/**
 * Test 3 : statistiques sur 10k clics (approx)
 * (log uniquement la synthèse)
 */
function testCritStats(state) {
    console.log("=== TEST 3 Crit Stats ===");

    // reset stats
    state.stats.crits = 0;
    state.totalClicks = "0";
    state.glands = "0";
    state.baseClick = "1";
    state.multipliers.clickBps = 10000;
    state.multipliers.prestigeBps = 10000;

    // chance de base 1% => ~100 crits sur 10k
    const N = 10000;
    for (let i = 0; i < N; i++) clickGland(state);

    console.log("Clicks:", state.totalClicks);
    console.log("Crits:", state.stats.crits, "≈ attendu ~", N * (CRIT_CONFIG.baseChanceBps / 10000));
}

// Appels de tests (à lancer manuellement si tu veux)
// testCritBasic(state);
// testCritForce(state);
// testCritStats(state);
export {
    getClickGainSansCrit,
    applyCritOnClick,
    getCritChanceBps,
    getCritMultBps
};
