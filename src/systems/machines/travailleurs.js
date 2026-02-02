// =========================
// TRAVAILLEURS (Animaux)
// =========================
// - Bonus multiplicatif sur la production globale
// - Limite de travailleurs par tier
// - Prix exponentiel
// =========================

export const travailleurs = [
    // ===== Tier 1 (1–5) | cap 50 =====
    {
        id: "T01",
        nom: "Écureuil Apprenti",
        basePrix: 120,
        max: 50,
        prodMult: 0.010 }, // +1.0% / unité
    {

        id: "T02",
        nom: "Écureuil Ouvrier",
        basePrix: 280,
        max: 50,
        prodMult: 0.015 },
    {

        id: "T03",
        nom: "Écureuil Grimpeur",
        basePrix: 650,
        max: 50,
        prodMult: 0.022 },
    {

        id: "T04",
        nom: "Geai Collecteur",
        basePrix: 1500,
        max: 50,
        prodMult: 0.030 },
    {

        id: "T05",
        nom: "Castor Logisticien",
        basePrix: 3400,
        max: 50,
        prodMult: 0.040 },




    //

    // ===== Tier 2
    // (6–10) | cap 25 =====
    {
        id: "T06",
        nom: "Renard Éclaireur",
        basePrix: 7800,
        max: 25,
        prodMult: 0.055 },
    {
        id: "T07",
        nom: "Blaireau Foreur",
        basePrix: 18000,
        max: 25,
        prodMult: 0.075 },
    {
        id: "T08",
        nom: "Hibou Stratège",
        basePrix: 42000,
        max: 25,
        prodMult: 0.100 },
    {
        id: "T09",
        nom: "Cerf Porteur",
        basePrix: 98000,
        max: 25,
        prodMult: 0.140 },
    {
        id: "T10",
        nom: "Lynx Superviseur",
        basePrix: 230000,
        max: 25,
        prodMult: 0.190 },

    // ===== Tier 3 =====
    // (11–15) | cap 10 =====
    {

        id: "T11",
        nom: "Corbeau Intendant",
        basePrix: 520000,
        max: 10,
        prodMult: 0.260 },
    {

        id: "T12",
        nom: "Loutre Optimisatrice",
        basePrix: 1200000,
        max: 10,
        prodMult: 0.350 },
    {

        id: "T13",
        nom: "Sanglier Bulldozer",
        basePrix: 2800000, max: 10,
        prodMult: 0.480 },
    {

        id: "T14",
        nom: "Ours Gardien",
        basePrix: 6500000,
        max: 10,
        prodMult: 0.650 },
    {

        id: "T15",
        nom: "Aigle Patriarche",
        basePrix: 15000000,
        max: 10,
        prodMult: 0.900 },
];


// =====================
// FONCTIONS
// =====================

// Prix du prochain travailleur recruté
export function prixTravailleur(basePrix, quantite, facteur=1.14) {
    return Math.floor(basePrix * Math.pow(quantite, facteur));
}

// Vérifie la limite de travailleurs
export function peutRecruterTravailleur(travailleur, quantite) {
    return quantite < travailleur.max;
}

// Multiplication par type de travailleur
export function multiplicateurTypeTravailleur(type, quantite) {
    return 1 + type.prodMult * quantite;
}

// Multiplicateur global par travailleur
export function multiplicateurGlobalTravailleur(travailleurs, quantiteTravailleurs) {
    let mult = 1;

    for (const t of travailleurs) {
        const quantitePossedee = quantiteTravailleurs?.[t.id] ?? 0;
        mult *= multiplicateurTypeTravailleur(t,quantitePossedee);
    }
    return mult;
}





