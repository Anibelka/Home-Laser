function registerAndPlan(zone) {
    const contraActive = Array.from(document.querySelectorAll('.contra-check'))
    .some(c => c.checked);
    if(contraActive){
        alert("🚫 No puedes usar el dispositivo debido a contraindicaciones activas.");
        return;
    }

    if(document.getElementById('sunSwitch')?.checked){
    alert("🚫 No puedes registrar una sesión después de exposición solar reciente. Espera 48 horas.");
    return;
    }

    try {
        // 1. Fecha actual "limpia" (sin horas para que el calendario no se confunda)
        const hoy = new Date();
        const fechaHoyISO = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
        const yaHoy = state.sessions.some(s => 
            s.zone === zone && new Date(s.date).toDateString() === hoy.toDateString()
        );

        if (yaHoy) {
            alert("⚠️ Ya registraste esta zona hoy. No debes repetir sesión el mismo día.");
            return;
        }

        if (!state.sessions) state.sessions = [];
        const duplicate = state.sessions.find(s => 
            s.zone === zone &&
            new Date(s.date).toDateString() === new Date().toDateString()
        );

        if(duplicate){
            alert("Ya registraste esta zona hoy.");
            return;
        }
        state.sessions.push({ zone: zone, date: fechaHoyISO });
        if(state.sessions.length > 500){
            state.sessions.shift();
        }

        // 2. Cálculos para la siguiente sesión
        const sesionesEnZona = state.sessions.filter(s => s.zone === zone).length;
        const v = state.velloConfig[zone] || { den: 'media', gro: 'medio' };
        
        let diasParaSiguiente = 2; 
        if (sesionesEnZona > 6 && sesionesEnZona <= 10) diasParaSiguiente = 4;
        if (sesionesEnZona > 10) diasParaSiguiente = 15;

        if (state.profile.clinical === 'si') diasParaSiguiente += 2;
        if (v.gro === 'fino') diasParaSiguiente += 3;
        if (state.profile.sens === 'alta') diasParaSiguiente += 1;

         if(sesionesEnZona > 5 && v.den === "mucha"){
        diasParaSiguiente -= 1; // acelera plan
        }

        if(state.profile.sens === "alta"){
        diasParaSiguiente += 2; // protege piel
        }

        // 3. Crear fecha futura "limpia"
        const next = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + diasParaSiguiente);
        
        if (!state.scheduled) state.scheduled = [];
        // Filtramos para que una zona solo tenga una fecha futura (la más reciente)
        state.scheduled = state.scheduled.filter(s => s.zone !== zone);
        state.scheduled.push({ zone: zone, date: next.toISOString() });

        if(state.ai.enabled && Math.random() < 0.2){
        state.ai.skinRecovery = true;
        }

        renderCalendar();
        persist();

        setTimeout(() => {
        state.ai.skinRecovery = false;
        persist();
        }, 1000 * 60 * 60 * 24 * 2); // 2 días


        // 4. Actualizar Interfaz
        const cid = `action-${zone.replace(/\s/g, '').replace(/\//g, '')}`;
        const contenedor = document.getElementById(cid);
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="success-card" style="padding:10px; font-size:12px;">
                    ✅ Sesión #${sesionesEnZona}<br>
                    📅 Próxima: <b>${next.toLocaleDateString()}</b>
                </div>

                <button class="btn-calendar" onclick="downloadICS('${zone}', '${next.toISOString()}')">
                    📅 Añadir próxima sesión
                </button>
            `;
        }

        renderCalendar();
    } catch (e) {
        alert("Error: " + e.message);
    }

    updateConsistency();

    if(state.ai.enabled){
    updateStreak();
    }
}

function updateConsistency(){
    const total = state.sessions.length;
    const expected = state.scheduled.length || 1;

    state.ai.consistencyScore = Math.round((total / expected) * 100);

    // 🔥 NIVEL DE IA DINÁMICO
    state.ai.adaptationLevel = Math.min(5, Math.floor(total / 5));
}

function updateStreak(){

    const today = new Date().toDateString();

    if(state.ai.lastSessionDate === today){
        return;
    }

    if(!state.ai.lastSessionDate){

        state.ai.streak = 1;

    } else {

        const last = new Date(state.ai.lastSessionDate);

        const now = new Date(today);

        const diff = Math.floor(
            (now - last) / (1000 * 60 * 60 * 24)
        );

        if(diff === 1){

            state.ai.streak += 1;

        } else {

            state.ai.streak = 1;
        }
    }

    state.ai.lastSessionDate = today;

    if(state.ai.streak > state.ai.bestStreak){
        state.ai.bestStreak = state.ai.streak;
    }

    persist();
}