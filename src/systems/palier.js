export const paliers = [
    {
        id: "PC01",
        nom: "Premier effort",
        condition: { type: "glandsTotal", valeur: 25 },
        bonus: { type: "clickAdd", valeur: 1 }, // Ajoute +1 par clic
        message: "Ton écureuil faible passe la barre de ses 100 glands récoltés. Keep going !"
    },
    {
        id: "PC02",
        nom: "Récolteur",
        condition: { type: "glandsTotal", valeur: 75 },
        bonus: { type: "prodGlobalMult", valeur: 0.1 }, // +10% production globale
        message: "Tu gagnes 10% de production de glands par seconde !"
    },
    {
        id: "PC03",
        nom: "Cliqueur Fou",
        condition: { type: "glandsTotal", valeur: 100 },
        bonus: { type: "clickAdd", valeur: 2 },
        message: "Félicitation ! Tes clics valent maintenant 3 !"
    },

    {
        id: "PC04",
        nom: "Saute écureuil !",
        condition : { type: "glandsTotal", valeur: 300 },
        bonus: {},
        message: "Je suis un écureuil qui sauteeeee",
    }
];

