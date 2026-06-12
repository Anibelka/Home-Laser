// 1. DATA MASTER & CONFIGURACIÓN INICIAL
const ZONES_DB = ["Rostro(Bozzo/Menton)", "Patilla", "Axilas", "Brazos", "Línea de Alba", "Abdomen", "Bikini", "Zona Íntima", "Muslos", "Pantorrillas", "Piernas Completas", "Espalda", "Gluteos", "Manos/Pies"];
const EST_FLASHES = { "Rostro(Bozzo/Menton)": 15, "Axilas": 30, "Piernas Completas": 200, "Zona Íntima": 50, "Brazos": 80, "Gluteos": 60, "Espalda": 150 };

const HIERARCHY = {
    "Piernas Completas": ["Muslos", "Pantorrillas"],
    "Abdomen": ["Línea de Alba"]
};

let currentViewDate = new Date(); // Para navegar entre meses

let progChart = null; // Variable global para el gráfico

let state;

try {

    state = JSON.parse(localStorage.getItem('ulike_ultra_db'));

} catch(e){

    state = null;

}

if(!state){

state = {
    profile: {
        skin: "1",
        clinical: "no",
        hair: "negro",
        sens: "baja",

        age: 25,
        hormonalIssues: false,
        hydration: "media",
        painTolerance: "media",
        sunExposure: false
    },
    selectedZones: [],
    velloConfig: {},
    sessions: [],
    scheduled: [],

    ai: {
        enabled: false,
        adaptationLevel: 1,
        skinRecovery: false,
        consistencyScore: 100,

        streak: 0,
        lastSessionDate: null,
        bestStreak: 0,
    },
};
}

// VALIDACIÓN DE SEGURIDAD: Si el usuario ya tenía la app, forzamos la creación de scheduled
if (!state.scheduled) {
    state.scheduled = [];
};