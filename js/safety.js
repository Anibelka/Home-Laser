    // Punto 6: Validación de Seguridad
function checkSafety() {
    const checks = document.querySelectorAll('.safety-check');
    const allChecked = Array.from(checks).every(c => c.checked);
    const planResults = document.getElementById('plan-results');
    const safetyMsg = document.getElementById('safety-msg');
    
    if(allChecked) {

        safetyMsg.innerHTML =
            "✅ Protocolo verificado";

        safetyMsg.style.color =
            "var(--success)";

        document.getElementById('safety-card').style.display =
            "none";

        validateAccessToPlan();

    } else {

        document.getElementById('safety-card').style.opacity = "1";

        planResults.style.display = "none";

        safetyMsg.innerHTML =
            "Completa el protocolo para ver tu plan";

        safetyMsg.style.color =
            "var(--gray)";
    }
}

function checkContra(){

    const anyChecked =
        Array.from(
            document.querySelectorAll('.contra-check')
        ).some(c => c.checked);

    const msg =
        document.getElementById('contra-msg');

    if(anyChecked){

        document.getElementById('plan-results').style.display =
            "none";

        msg.innerHTML =
            "🚫 Tratamiento NO permitido";

        msg.style.color =
            "red";

        document.getElementById('noContra').checked =
            false;

    }else{

        msg.innerHTML =
            "Selecciona una opción";

        msg.style.color =
            "var(--gray)";
    }

    validateAccessToPlan();
}

function clearContra(){

    const noContra =
        document.getElementById('noContra');

    if(noContra.checked){

        document
            .querySelectorAll('.contra-check')
            .forEach(c => {
                c.checked = false;
            });

        document.getElementById('contra-card').style.border =
            "2px solid var(--success)";

        document.getElementById('contra-msg').innerHTML =
            "✅ Sin contraindicaciones detectadas.";

        document.getElementById('contra-msg').style.color =
            "var(--success)";
        
        document.getElementById('contra-card').style.display =
            "none";

        validateAccessToPlan();
    }
}

function validateAccessToPlan(){

    const safetyCompleted =
        Array.from(document.querySelectorAll('.safety-check'))
        .every(c => c.checked);

    const noContra =
        document.getElementById('noContra').checked;

    const planResults =
        document.getElementById('plan-results');

    if(safetyCompleted && noContra){

        document.getElementById('safety-card').style.display = "none";
        document.getElementById('contra-card').style.display = "none";

        generateMasterPlan();

        planResults.style.display = "block";

    }else{

        planResults.style.display = "none";
    }
}

// Punto 4: Lógica de Modo Solar
function toggleSolarMode() {

    const isSunActive =
    document.getElementById('sunSwitch').checked;

    const res =
    document.getElementById('plan-results');

    // Ocultar SOLO seguridad y contraindicaciones
    document.getElementById('contra-card').style.display =
        isSunActive ? "none" : "block";

    document.getElementById('safety-card').style.display =
        isSunActive ? "none" : "block";

    // SI ACTIVÓ MODO SOLAR
    if(isSunActive){

        res.innerHTML = `
            <div class="card" style="border-left:6px solid red; margin-top:20px;">
                
                <h2 style="color:red;">☀️ Modo Solar Activado</h2>

                <p style="font-size:14px;">
                    Detectamos exposición solar reciente.
                </p>

                <div class="helper-box" style="border-color:red;">
                    🚫 El tratamiento IPL queda bloqueado temporalmente.
                </div>

                <div class="tip-box">
                    <b>Debes regresar después de:</b><br><br>

                    ⏳ 48 horas sin exposición solar directa.
                </div>

                <div class="helper-box">
                    Riesgos evitados:
                    <br>• Quemaduras
                    <br>• Manchas
                    <br>• Irritación severa
                    <br>• Sensibilidad extrema
                </div>
            </div>
        `;

        persist();

        return;
    }

    // Si desactiva modo solar
    // limpiar resultados
    res.innerHTML = "";

    persist();
}