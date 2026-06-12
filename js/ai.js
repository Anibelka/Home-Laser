function aiWarnings(zone){
    const sesiones = state.sessions.filter(s => s.zone === zone);

    if(sesiones.length >= 2){
        let last = new Date(sesiones[sesiones.length -1].date);
        let prev = new Date(sesiones[sesiones.length -2].date);

        let diff = (last - prev) / (1000*60*60*24);

        if(diff < 2){
            return "⚠️ Uso demasiado frecuente.";
        }
    }

    return null;
}

function aiMessage(zone){
    const prog = getPrediction(zone);

    if(prog < 30) return "✨ Vas empezando, sé constante.";
    if(prog < 70) return "💖 Ya hay progreso real.";
    return "🔥 Estás en modo glow up.";
}

function getPrediction(zone){
    const sesiones = state.sessions.filter(s => s.zone === zone).length;
    const v = state.velloConfig[zone] || { gro: 'medio' };

    let progreso = sesiones * 9;

    if(v.gro === "grueso") progreso -= 15;
    if(v.gro === "fino") progreso += 10;

    if(state.ai.enabled) progreso += 10;

    return Math.max(5, Math.min(95, progreso));
}

function getOptimalDay(zone){
    const sesiones = state.sessions.filter(s => s.zone === zone);

    if(sesiones.length === 0) return "Hoy puedes empezar";

    const last = new Date(sesiones[sesiones.length -1].date);

    let diasIdeal = 3;

    const v = state.velloConfig[zone] || { gro: 'medio' };

    if(v.gro === "grueso") diasIdeal = 2;
    if(v.gro === "fino") diasIdeal = 5;

    if(state.profile.sens === "alta") diasIdeal += 2;

    const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + diasIdeal);

    const hoy = new Date();
    const diff = Math.ceil((next - hoy) / (1000 * 60 * 60 * 24));

    if(diff <= 0) return "🔥 Hoy es día ideal";
    if(diff === 1) return "⏳ Mañana es ideal";
    return `📅 En ${diff} días`;
}

function toggleAI(){
    state.ai.enabled = document.getElementById("aiSwitch").checked;
    persist();
    generateMasterPlan();
}

function aiEngine(zone){

    const sesiones = state.sessions.filter(s => s.zone === zone);

    let response = {
        lvlAdjust: 0,
        warnings: []
    };

    // MUCHAS sesiones seguidas
    if(sesiones.length >= 2){

        const last = new Date(sesiones[sesiones.length -1].date);
        const prev = new Date(sesiones[sesiones.length -2].date);

        const diff = (last - prev)/(1000*60*60*24);

        if(diff < 2){
            response.lvlAdjust = -2;

            response.warnings.push(
                "⚠️ La IA detectó sesiones demasiado frecuentes."
            );
        }
    }

    // Sensibilidad alta
    if(state.profile.sens === "alta"){

        response.lvlAdjust -= 1;

        response.warnings.push(
            "🩷 Modo protección activado por piel sensible."
        );
    }

    // Poca hidratación
    if(state.profile.hydration === "baja"){

        response.warnings.push(
            "💧 Tu piel puede irritarse más fácilmente."
        );
    }

    return response;
}