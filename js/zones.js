// 3. GESTIÓN DE ZONAS
function renderZonesGrid() {
    const container = document.getElementById('zones-container');
    container.innerHTML = "";
    let hidden = [];
    state.selectedZones.forEach(z => { if(HIERARCHY[z]) hidden = hidden.concat(HIERARCHY[z]); });

    ZONES_DB.forEach(z => {
        if(hidden.includes(z)) return;
        const div = document.createElement('div');
        div.className = `zone-item ${state.selectedZones.includes(z) ? 'selected' : ''}`;
        div.innerText = z;
        div.onclick = () => {
            state.selectedZones.includes(z) ? 
                state.selectedZones = state.selectedZones.filter(i => i !== z) : 
                state.selectedZones.push(z);
            if(HIERARCHY[z]) state.selectedZones = state.selectedZones.filter(i => !HIERARCHY[z].includes(i));
            persist(); renderZonesGrid();
        };
        container.appendChild(div);
    });
}

function goToVelloDetails() {
    if(state.selectedZones.length === 0) return alert("Selecciona al menos una zona.");
    const list = document.getElementById('vello-details-list');
    list.innerHTML = "";
    state.selectedZones.forEach(z => {
        if(!state.velloConfig[z]) state.velloConfig[z] = { den: 'media', gro: 'medio' };
        list.innerHTML += `
            <div class="card">
                <h3 style="color:var(--primary)">${z}</h3>
                <label>Densidad Folicular</label>
                <select onchange="updateVello('${z}', 'den', this.value)">
                    <option value="media" ${state.velloConfig[z].den==='media'?'selected':''}>Media (Vello normal)</option>
                    <option value="mucha" ${state.velloConfig[z].den==='mucha'?'selected':''}>Mucha (Zonas muy pobladas)</option>
                    <option value="poca" ${state.velloConfig[z].den==='poca'?'selected':''}>Poca (Vello disperso)</option>
                </select>
                <label>Grosor del Vello</label>
                <select onchange="updateVello('${z}', 'gro', this.value)">
                    <option value="medio" ${state.velloConfig[z].gro==='medio'?'selected':''}>Medio</option>
                    <option value="grueso" ${state.velloConfig[z].gro==='grueso'?'selected':''}>Grueso / Raíz Fuerte</option>
                    <option value="fino" ${state.velloConfig[z].gro==='fino'?'selected':''}>Fino / Tipo Pelusa</option>
                </select>
            </div>`;
    });
    showScreen('scr-details');
}
function updateVello(zone, key, val) { state.velloConfig[zone][key] = val; persist(); }

function aiEngine(zone){
    const v = state.velloConfig[zone] || { gro: 'medio', den: 'media' };
    const sesiones = state.sessions.filter(s => s.zone === zone).length;

    let decision = {
        lvlAdjust: 0,
        freqAdjust: 0,
        warnings: [],
        modeOverride: null
    };

    if(sesiones > 5){
        decision.freqAdjust -= 1;
    }

    if(v.gro === "grueso"){
        decision.lvlAdjust += 1;
    }

    if(v.gro === "fino"){
        decision.freqAdjust += 2;
    }

    if(state.ai.consistencyScore < 60){
        decision.warnings.push("⚠️ Baja constancia detectada.");
    }

    if(state.ai.consistencyScore < 50){
    decision.warnings.push("💡 Te recomiendo crear una rutina fija para mejores resultados.");
    }

    if(state.ai.skinRecovery){
        decision.lvlAdjust -= 2;
        decision.freqAdjust += 3;
        decision.modeOverride = "SOFT MODE";
    }

    if(document.getElementById('sunSwitch')?.checked){
        decision.lvlAdjust = Math.min(decision.lvlAdjust, -3);
        decision.modeOverride = "SAFE MODE";
    }

    return decision;
}