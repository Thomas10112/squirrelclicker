import {createInitialState} from "./state.js";
import { clickGland } from "./crit.js";


// ==============================
// SUPABASE INIT (OBLIGATOIRE EN PREMIER)
// ==============================
const SUPABASE_URL = "https://kuvhhpecuskmkqjbnvzo.supabase.co";
const SUPABASE_KEY = "sb_publishable_rqiVvytH1h4PjLLb04MM_g_j5Onkqni";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
let state = null; // IMPORTANT : état global, pas encore prêt


async function getCurrentUser() {
    const {data: {user}} = await sb.auth.getUser();
    return user;
}

async function loadCloud() {
    const user = await getCurrentUser();
    if (!user) return null;

    const {data, error} = await sb
        .from("saves")
        .select("state_json")
        .limit(1);

    // Aucun save encore → normal
    if (!data || data.length === 0) {
        console.log("Aucune sauvegarde cloud");
        return null;
    }

    console.log("Sauvegarde cloud chargée");
    return data[0].state_json;
}


async function saveCloud() {
    // garde-fou ABSOLU
    if (!state) {
        console.warn("saveCloud ignoré : state non prêt");
        return;
    }

    const user = await getCurrentUser();
    if (!user) return;

    await sb.from("saves").upsert({
        user_id: user.id,
        state_json: state,
        version: state.version
    });

    console.log("Cloud save OK");
}

async function initGame() {
    console.log("Init game...");

    // 1. Local
    const raw = localStorage.getItem("gland_clicker_state");
    const localState = raw ? JSON.parse(raw) : null;

    // 2. Cloud
    const cloudState = await loadCloud();

    // 3. Choix (temporaire)
    state = localState || cloudState || createInitialState();

    // 4. Normalisation
    localStorage.setItem("gland_clicker_state", JSON.stringify(state));

    console.log("State initialisé");

    // 5. DÉMARRER LES TIMERS ICI SEULEMENT
    startAutoSaves();
}

function startAutoSaves() {
    // Local
    setInterval(() => {
        if (!state) return;
        state.lastSaveAt = Date.now();
        localStorage.setItem("gland_clicker_state", JSON.stringify(state));
    }, 3000);

    // Cloud
    setInterval(() => {
        saveCloud();
    }, 60000);
}


initGame();
