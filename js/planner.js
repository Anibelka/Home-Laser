function getPhase(zone){
    const s = state.sessions.filter(x => x.zone === zone).length;

    if(s <= 4) return "Fase 1: Inicio";
    if(s <= 10) return "Fase 2: Reducción";
    return "Fase 3: Mantenimiento";
}

// Asegúrate de que generateMasterPlan use el ID correcto para el contenedor
function generateMasterPlan() {

    console.log("GENERANDO PLAN");

    const planResults =
        document.getElementById('plan-results');

    const safetyReady =
        Array.from(document.querySelectorAll('.safety-check'))
        .every(c => c.checked);

    planResults.style.display = "block";

    const res =
        document.getElementById('plan-results');

    const sunActive =
        document.getElementById('sunSwitch')?.checked;

    let medicalWarnings = [];

    if(state.profile.sens === "alta"){
    medicalWarnings.push(
        "⚠️ Piel sensible: realiza prueba en una pequeña área."
    );
}

if(state.sessions.length < 2){
    medicalWarnings.push(
        "💡 Inicio de tratamiento: sé constante cada semana."
    );
}
document.getElementById('streak-count').innerText = `${state.ai.streak || 0} días`;
document.getElementById('best-streak').innerText = `Mejor racha: ${state.ai.bestStreak || 0}`;
    res.innerHTML = "";
    if(state.selectedZones.length === 0) { res.innerHTML = "<p>No hay zonas seleccionadas.</p>"; return; }

    state.selectedZones.forEach(z => {
        const v = state.velloConfig[z] || { den: 'media', gro: 'medio' };
        let lvl = 10 - (parseInt(state.profile.skin) * 1.5);
        let ai = state.ai.enabled ? aiEngine(z) : null;
        let aiWarningsList = ai ? ai.warnings : [];
        if(ai){
            lvl += ai.lvlAdjust;
        }

        
        // 1. Lógica de Potencia (Skin + Vello)
        if(v.gro === 'grueso') lvl += 2; 
        if(v.gro === 'fino') lvl -= 1;
        
        // 2. Selección de Modo
        let modoUso = "Normal Mode";
        let instrucciones = ["Realiza 2 pasadas lentas por la zona."];
        let flashes = EST_FLASHES[z] || 45;

        if(sunActive){
            modoUso = "FAST MODE (Post-Sol)";
                instrucciones = [
                    "⚠️ Piel sensibilizada por el sol.",
                    "Usa movimientos lentos y evita repetir disparos.",
                    "Si sientes calor excesivo, detente."
                ];
        }

        if(z.includes("Piernas") || z.includes("Espalda") || z.includes("Brazos")) {
            modoUso = "SHR MODE (Rápido)";
            instrucciones.push("Mantén presionado y desliza continuamente.");
        } else if(z.includes("Íntima") || z.includes("Bikini") || v.gro === 'grueso') {
            modoUso = "HIGH MODE (Potente)";
            instrucciones.push("Presiona firmemente para enfriamiento máximo.");
        }

        // 3. Ajuste por Sensibilidad Alta
        if(state.profile.sens === 'alta') {
            lvl -= 2;
            if(lvl < 4) modoUso = "SOFT MODE (Seguro)";
            instrucciones.unshift("⚠️ Piel sensible: Inicia con disparo de prueba.");
        }

        const finalLvl = Math.max(1, Math.min(10, Math.round(lvl)));
        let intensityColor = finalLvl > 7 ? "#ff4d6d" : (finalLvl > 4 ? "#ff9800" : "#4caf50");
        const cid = `action-${z.replace(/\s/g, '').replace(/\//g, '')}`;

        const prog = getPrediction(z);
        const phase = getPhase(z);
        const warn = aiWarnings(z);
        const msg = aiMessage(z);
        const optimal = getOptimalDay(z);

        res.innerHTML += `
            <div class="card" style="border-left: 6px solid ${intensityColor}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:10px; font-weight:bold; color:${intensityColor}; text-transform:uppercase;">${modoUso}</span>
                    <span style="font-size:11px; background:#f0f0f0; padding:2px 8px; border-radius:10px; color:var(--gray)">~${flashes} disparos</span>
                </div>
                
                <h3 style="margin: 0 0 10px 0; font-size:19px;">
                    ${z}
                    ${state.ai.enabled ? `<span style="font-size:10px; background:#000; color:#fff; padding:3px 6px; border-radius:6px; margin-left:6px;">
                        AI Lv.${state.ai.adaptationLevel}
                    </span>` : ""}
                </h3>

                <p style="font-size:11px; color:var(--gray);">${phase}</p>
                <p style="font-size:12px;">📊 Progreso: <b>${prog}%</b></p>
                <p style="font-size:12px;">${msg}</p>
                <p style="font-size:12px; font-weight:600; color:var(--secondary);">
                    ${optimal}
                </p>
                ${warn ? `<div class="helper-box">${warn}</div>` : ""}
                ${aiWarningsList.length ? `<div class="helper-box">${aiWarningsList.join("<br>")}</div>` : ""}
                ${medicalWarnings.length ? `<div class="helper-box">${medicalWarnings.join("<br>")}</div>` : ""}
                
                <div style="display:flex; gap:10px; margin-bottom:12px;">
                    <div style="font-size:11px; color:var(--gray); background:#f9f9f9; padding:4px 8px; border-radius:6px; border:0.5px solid #eee;">
                        🧬 Vello: <b>${v.gro}</b>
                    </div>
                    <div style="font-size:11px; color:var(--gray); background:#f9f9f9; padding:4px 8px; border-radius:6px; border:0.5px solid #eee;">
                        🕸️ Densidad: <b>${v.den}</b>
                    </div>
                </div>

                <div style="background:#f0f0f0; height:4px; border-radius:2px; margin-bottom:4px;">
                    <div style="background:${intensityColor}; width:${finalLvl*10}%; height:100%; border-radius:2px;"></div>
                </div>
                    <p style="font-size:11px; margin:0 0 15px 0;">
                    Modo recomendado: <b>${modoUso}</b>
                    </p>

                <div class="tip-box">
                    <ul style="margin:0; padding-left:15px; font-size:12px; line-height:1.6;">
                        ${instrucciones.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>
                
                <div id="${cid}">
        <button 
        class="btn-main"

        ${sunActive
        ? "disabled style='opacity:0.5; cursor:not-allowed;'"
        : ""}

        style="margin-top:15px; font-size:14px; padding:12px;"

        onclick="this.disabled=true; registerAndPlan('${z}')">
        
            ✅ Marcar Sesión Realizada
        </button>

        <button class="btn-calendar" onclick="downloadICS('${z}', new Date().toISOString())">
            📅 Añadir a Apple Calendar
        </button>
        </div>`;
    });

    // Cuadro de protocolo post-sesión
    res.innerHTML += `
        <div class="card" style="margin-bottom:120px;">
            <h3 style="color:var(--secondary);">📘 Recomendaciones Oficiales</h3>

            <div class="tip-box">
                • No usar sobre tatuajes o lunares oscuros<br>
                • No usar en piel irritada o con heridas<br>
                • Evitar si usas medicamentos fotosensibles<br>
                • Rasurar antes del tratamiento (no depilar con cera)<br>
                • No exponer al sol 48h antes y después<br>
                • Usar protector solar SPF 15+
            </div>
        </div>
    `;

    if(document.querySelector('.screen.active').id !== 'scr-home') showScreen('scr-home');

}