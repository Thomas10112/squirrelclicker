// =========================
// INDUSTRIES (Machines)
// =========================
// - Production passive de glands
// - Limite d'industries par tier
// - Prix exponentiel
// =========================

export const industries = [

    // ===== Tier 1 (1–10) | cap 50 =====
    {
        id: "I01",
        nom: "Gland-Collecteur Manuel",
        basePrix: 60,
        max: 50,
        gps: 0.10 },
    {
        id: "I02",
        nom: "Ramasse-Glands Assisté",
        basePrix: 140,
        max: 50,
        gps: 0.20 },
    {
        id: "I03",
        nom: "Trieur à Glands",
        basePrix: 320,
        max: 50,
        gps: 0.35 },
    {
        id: "I04",
        nom: "Décortiqueur Forestier",
        basePrix: 700,
        max: 50,
        gps: 0.55 },
    {
        id: "I05",
        nom: "Moulin à Glands",
        basePrix: 1500,
        max: 50,
        gps: 0.80 },
    {
        id: "I06",
        nom: "Presse à Glands",
        basePrix: 3200,
        max: 50,
        gps: 1.15 },
    {
        id: "I07",
        nom: "Séchoir Sylvestre",
        basePrix: 6800,
        max: 50,
        gps: 1.60 },
    {
        id: "I08",
        nom: "Gland-Collecteur Automatisé",
        basePrix: 14000,
        max: 50,
        gps: 2.20 },
    {
        id: "I09",
        nom: "Chaîne de Décorticage",
        basePrix: 29000,
        max: 50,
        gps: 3.00 },
    {
        id: "I10",
        nom: "Raffineur de Glands",
        basePrix: 60000,
        max: 50,
        gps: 4.10 },

    // ===== Tier 2 (11–20) | cap 25 =====
    {
        id: "I11",
        nom: "Centrale de Traitement Sylvestre",
        basePrix: 125000,
        max: 25,
        gps: 5.60 },
    {
        id: "I12",
        nom: "Optimiseur de Récolte",
        basePrix: 260000,
        max: 25,
        gps: 7.60 },
    {
        id: "I13",
        nom: "Convertisseur Bio-Gland",
        basePrix: 540000,
        max: 25,
        gps: 10.30 },
    {
        id: "I14",
        nom: "Accélérateur Sylvestre",
        basePrix: 1120000,
        max: 25,
        gps: 14.00 },
    {
        id: "I15",
        nom: "Synthétiseur de Glands",
        basePrix: 2300000,
        max: 25,
        gps: 19.00 },
    {
        id: "I16",
        nom: "Générateur Glandulaire",
        basePrix: 4700000,
        max: 25,
        gps: 26.00 },
    {
        id: "I17",
        nom: "Compresseur Méga-Gland",
        basePrix: 9600000,
        max: 25,
        gps: 35.00 },
    {
        id: "I18",
        nom: "Réacteur Sylvestre",
        basePrix: 19500000,
        max: 25,
        gps: 47.00 },
    {
        id: "I19",
        nom: "Extracteur Quantique de Chêne",
        basePrix: 39500000,
        max: 25,
        gps: 63.00 },
    {
        id: "I20",
        nom: "Distorsionneur de Glands",
        basePrix: 80000000,
        max: 25,
        gps: 85.00 },

    // ===== Tier 3 (21–30) | cap 10 =====
    {
        id: "I21",
        nom: "Réplicateur Sylva-Temporel",
        basePrix: 160000000,
        max: 10,
        gps: 115.00 },
    {

        id: "I22",
        nom: "Forge Dimensionnelle à Glands",
        basePrix: 320000000,
        max: 10,
        gps: 155.00 },
    {

        id: "I23",
        nom: "Accélérateur de Réalité Sylvestre",
        basePrix: 640000000,
        max: 10,
        gps: 210.00 },
    {

        id: "I24",
        nom: "Noyau de Création Glandique",
        basePrix: 1280000000,
        max: 10,
        gps: 285.00 },
    {

        id: "I25",
        nom: "Moteur du Grand Chêne",
        basePrix: 2550000000,
        max: 10,
        gps: 385.00 },
    {

        id: "I26",
        nom: "Condensateur d’Univers Forestier",
        basePrix: 5100000000,
        max: 10,
        gps: 520.00 },
    {

        id: "I27",
        nom: "Générateur Infini de Glands",
        basePrix: 10200000000,
        max: 10,
        gps: 705.00 },
    {

        id: "I28",
        nom: "Singularity Glandulaire",
        basePrix: 20400000000,
        max: 10,
        gps: 950.00 },
    {

        id: "I29",
        nom: "Moteur de l’Écureuil Suprême",
        basePrix: 40800000000,
        max: 10,
        gps: 1280.00 },
    {

        id: "I30",
        nom: "Origine du Gland",
        basePrix: 81600000000,
        max: 10,
        gps: 1725.00 }
];

export function prixIndustries(basePrix, quantite, facteur= 1.13) {
    return Math.floor(basePrix * Math.pow(quantite, facteur));
}

export function peutAcheterIndustrie(industrie, quantite) {
    return quantite < industrie.max;
}
