// 4. LÓGICA DE PERFIL Y VELLO
function setHair(color) {
    document.querySelectorAll('.hair-option').forEach(o => o.classList.remove('selected'));
    if(document.getElementById(`h-${color}`)) document.getElementById(`h-${color}`).classList.add('selected');
    state.profile.hair = color;
}

function toggleSensHelper() {
    document.getElementById('sens-helper-ui').style.display = (document.getElementById('p-sens').value === 'no_se') ? 'block' : 'none';
}

function autoDetectSensitivity() {

    const checks =
        document.querySelectorAll('.s-check');

    const checkedCount =
        Array.from(checks)
        .filter(c => c.checked).length;

    const helper =
        document.getElementById('sens-helper-ui');

    // SI MARCA 2 O MÁS
    if (checkedCount >= 2) {

        document.getElementById('p-sens').value = 'alta';

        state.profile.sens = 'alta';

        helper.style.display = "none";

        persist();
    }

    // SI MARCA "NINGUNA"
    if(document.getElementById('sens-none')?.checked){

        document.getElementById('p-sens').value = 'baja';

        state.profile.sens = 'baja';

        helper.style.display = "none";

        persist();
    }
}

function selectNoSensitivity(){
    
    const none = document.getElementById('none-sensitive');

    if(none.checked){

        document.querySelectorAll('.s-check').forEach(c => {
            c.checked = false;
        });

        document.getElementById('p-sens').value = 'baja';

        state.profile.sens = 'baja';

        document.getElementById('sens-helper-ui').style.display = 'none';

        persist();

        alert("✅ Se configuró sensibilidad baja.");
    }
}

function saveProfile() {
    state.profile.skin = document.getElementById('p-skin').value;
    state.profile.clinical = document.getElementById('p-clinical').value;
    state.profile.sens = document.getElementById('p-sens').value;
    persist();
}