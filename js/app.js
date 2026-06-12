
function init() {
    renderZonesGrid();
    document.getElementById('p-skin').value = state.profile.skin;
    document.getElementById('p-clinical').value = state.profile.clinical;
    document.getElementById('p-sens').value = state.profile.sens;
    setHair(state.profile.hair);

    if(state.selectedZones.length > 0) {
        document.getElementById('welcome-action-area').innerHTML = `
            <button class="btn-main" onclick="showScreen('scr-home')">Ver Mi Plan Personalizado</button>
            <p onclick="showScreen('scr-profile')" style="color:var(--primary); font-size:13px; margin-top:15px; font-weight:600; cursor:pointer; text-decoration:underline;">Editar Perfil Biométrico</p>
        `;
    }
}

init();