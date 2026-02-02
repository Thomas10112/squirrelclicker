// =========================
// COSMIQUES (Méta / end-game)
// =========================
// - Achats uniques (max 1)
// - Bonus globaux (production, prix, offline…)
// - Débloque l’Hibernation à partir de 3 cosmiques achetés
// =========================

export const cosmiques = [
    {
        id: "C01",
        nom: "Serment de la Famille",
        basePrix: 2_500_000,
        max: 1,
        bonus: { prodGlobalMult: 0.10 } // +10% prod globale
    },
    {
        id: "C02",
        nom: "Mémoire des Cachettes",
        basePrix: 9_000_000,
        max: 1,
        bonus: { prixMachinesRed: 0.05 } // -5% prix machines
    },
    {
        id: "C03",
        nom: "Pacte des Habitants de la Forêt",
        basePrix: 28_000_000,
        max: 1,
        bonus: { prixTravailleursRed: 0.05 } // -5% prix travailleurs
    },
    {
        id: "C04",
        nom: "Bénédiction du Grand Chêne",
        basePrix: 95_000_000,
        max: 1,
        bonus: { glandsParClicAdd: 1 } // +1 gland/clic
    },
    {
        id: "C05",
        nom: "Réseau Sylvestre",
        basePrix: 320_000_000,
        max: 1,
        bonus: { prodGlobalMult: 0.25 } // +25% prod globale
    },
    {
        id: "C06",
        nom: "Conseil des Anciens",
        basePrix: 1_200_000_000,
        max: 1,
        bonus: { prodGlobalMult: 0.45 } // +45% prod globale
    },
    {
        id: "C07",
        nom: "Hiver Sans Fin (Sans Faim)",
        basePrix: 4_200_000_000,
        max: 1,
        bonus: { offlineMult: 0.50 } // +50% offline
    },
    {
        id: "C08",
        nom: "Abondance Héréditaire",
        basePrix: 15_000_000_000,
        max: 1,
        bonus: { prodGlobalMult: 0.80 } // +80% prod globale
    },
    {
        id: "C09",
        nom: "Trésor du Clan",
        basePrix: 55_000_000_000,
        max: 1,
        bonus: { prixGlobalRed: 0.06 } // -6% sur tout (cap global géré côté helper)
    },
    {
        id: "C10",
        nom: "Couronne du Maître des Glands",
        basePrix: 220_000_000_000,
        max: 1,
        bonus: { prodGlobalMult: 1.20 } // +120% prod globale
    },
];

// =========================
// FONCTIONS
// =========================

export function peutAcheterCosmique(cosmique, quantite) {
    return quantite < (cosmique.max ?? 1);
}

// Multiplicateur de production global venant des cosmiques
export function multiplicateurCosmiques(cosmiques, quantiteCosmiques) {
    let mult = 1;

    for (const cosmique of cosmiques) {
        const qtePossedee = quantiteCosmiques?.[c.industrie] ?? 0;
        if (qtePossedee >= 1 && cosmique.bonus?.prodGlobalMult) {
            mult *= (1 + cosmique.bonus.prodGlobalMult);
        }
    }
    return mult;
}

// Bonus additionnel de glands/clic
export function bonusClicCosmiques(cosmiques, quantiteCosmiques) {
    let ajouter = 0;

    for (const cosmique of cosmiques) {
        const qtePossedee = quantiteCosmiques?.[cosmique.id] ?? 0;
        if (qtePossedee >= 1 && cosmique.bonus.glandsParClicAdd) {
            ajouter +=  cosmique.bonus.glandsParClicAdd;
        }
    }
    return ajouter;
}

// Réduction de prix globale
export function reductionprixCosmiques(cosmiques, quantiteCosmiques) {
    let machines = 0;
    let travailleurs = 0;
    let global = 0;

    for (const cosmique of cosmiques) {
        const qtePossedee = quantiteCosmiques?.[cosmique.id] ?? 0;
        if (qtePossedee < 1) continue;

        machines += cosmique.bonus?.prixMachinesRed ?? 0;
        travailleurs += cosmique.bonus?.prixTravailleursRed ?? 0;
        global += cosmique.bonus?.prixGlobalRed ?? 0;
    }
    return {
        machines: Math.min(machines, 0.25),
        travailleurs: Math.min(machines, 0.25),
        global: Math.min(global, 0.15),
    };
}

// Offline multiplicateur
export function offlineMultiplicateur(cosmiques, quantiteCosmiques) {
    let mult = 0;

    for (const cosmique of cosmiques) {
        const qtePossedee = quantiteCosmiques?.[cosmique.id] ?? 0;
        if (qtePossedee >= 1 && cosmique.bonus?.offlineMult) {
            mult *= (1 + cosmique.bonus?.offlineMult);
        }
    }
    return mult;
}