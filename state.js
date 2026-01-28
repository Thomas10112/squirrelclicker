// state.js

export const STATE_VERSION = 1;

export function createInitialState() {
    return {
        version: STATE_VERSION,
        createdAt: Date.now(),
        lastSaveAt: Date.now(),

        glands: "0",
        totalGlandsEarned: "0",
        totalGlandsSpent: "0",

        baseClick: "1",
        totalClicks: "0",

        cpsBase: "0",
        cpsNatureBase: "0",
        cpsFinal: "0",

        recordCpsAllTime: "0",
        recordCpsAvg10s: "0",

        timePlayedMs: 0,

        buildings: {},
        workers: {},
        workersMeta: {},

        multipliers: {
            clickBps: 10000,
            natureWorkerBps: 10000,
            prestigeBps: 10000
        },

        upgrades: {
            owned: [],
            trees: {
                nature: [],
                industry: [],
                cosmic: []
            }
        },

        prestige: {
            hibernations: 0,
            souvenirs: "0",
            ssrUnlocked: []
        },

        unlocks: {
            buildings: [],
            workers: [],
            upgrades: []
        },

        autoClick: {
            enabled: false,
            clicksPerSecond: 0,
            canCrit: true
        },

        stats: {
            bestClick: "0",
            crits: 0,
            autoClicks: 0
        },

        settings: {
            sound: true,
            animations: true,
            numberFormat: "auto",
            accessibility: {
                highContrast: false,
                reduceMotion: false
            }
        }
    };
}
