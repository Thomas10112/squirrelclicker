// =========================
// state.js
// =========================
// État initial du jeu
// Source de vérité unique
// =========================

export const initialState = {
    // -------------------------
    // Monnaie
    // -------------------------
    glands: 0,
    glandsTotal: 0,

    // -------------------------
    // Clic
    // -------------------------
    nbClics: 0,
    glandsParClic: 1,

    // -------------------------
    // Quantités possédées
    // -------------------------
    machines: {},        // ex: { I01: 0, I02: 3 }
    travailleurs: {},    // ex: { T01: 2 }
    cosmiques: {},       // ex: { C01: 1 }

    // -------------------------
    // Bonus globaux (paliers / hibernation)
    // -------------------------
    bonus: {
        prodGlobalMult: 0,   // +% prod
        clickAdd: 0,         // +glands/clic
        prixMachinesRed: 0,  // % réduction
        prixTravailleursRed: 0
    },

    // -------------------------
    // Déblocages (shop)
    // -------------------------
    unlocks: {
        machines: new Set(["I01"]), // seule la 1re machine est dispo
        travailleurs: new Set(),
        cosmiques: new Set()
    },

    // -------------------------
    // Paliers
    // -------------------------
    paliersFaits: {}, // { P100: true }

    // -------------------------
    // Hibernation (prestige)
    // -------------------------
    hibernation: {
        points: 0,
        nb: 0
    },

    // -------------------------
    // Sauvegarde / offline
    // -------------------------
    lastSave: Date.now()
};
