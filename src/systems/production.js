import { industries } from '/machines/industries';
import { multiplicateurGlobalTravailleurs } from "./machines/travailleurs.js";
import { multiplicateurCosmiques, bonusClicCosmiques} from "./machines/cosmiques";

// === CALCUL GPS des machines
export function gpsMachines(state) {
    let gps = 0;

    for (const industrie of industries) {
        const q = state.machines?.[industrie.id] ?? 0;
        gps += industrie.gps * q;
    }
    return gps;
}

// Multiplicateur global (bonus.prodGlobalMult"
export function multiplicateurBonusGlobal(state) {
    const b = state.bonus?.prodGlobalMult ?? 0;
    return 1 + b;
}

// Multiplicateur total des travailleurs
export function multiplicateurTravailleurs(state) {
    return multiplicateurGlobalTravailleurs(
        state.data?.travailleurs ?? null,
        state.travailleurs
    );
}

// Multiplicateur total cosmiques
export function multiplicateurProductionCosmiques(state) {
    return multiplicateurCosmiques(
        state.data?.cosmiques ?? null,
        state.cosmiques
    );
}

// == GPS GLOBAL ==
export function gpsGlobal(state) {
    const base = gpsMachines(state);
    const multBonus = multiplicateurBonusGlobal(state);
    const multT = multiplicateurTravailleurs(state);
    const multC = multiplicateurProductionCosmiques(state);

    return base * multB * multT * multC;
}

// == GAIN PAR CLIC ==
export function gainParClic(state) {
    const base = state.glandsParClic ?? 1;
    const addCosmique = bonusClicCosmiques(cosmiques, state.cosmiques);

    const addBonus = state.bonus?.clickAdd ?? 0;

    return base + addCosmique + addBonus;
}

export function appliquerClic(state) {
    const gain = gainParClic(state);

    state.nbClics = (state.nbClics ?? 0) + 1;
    state.glands += gain;
    state.glandsTotal += gain;

    return gain;
}
