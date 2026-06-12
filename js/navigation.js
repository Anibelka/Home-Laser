// 2. NAVEGACIÓN Y PERSISTENCIA
function persist() { localStorage.setItem('ulike_ultra_db', JSON.stringify(state)); }

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.getElementById('bottom-nav').style.display = (['scr-home', 'scr-progress', 'scr-profile'].includes(id)) ? 'flex' : 'none';
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(id === 'scr-home') {

    try{
        generateMasterPlan();
    }catch(e){
        console.error(e);
    }

    document.querySelector('.nav-btn:nth-child(1)').classList.add('active');
}
    if(id === 'scr-progress') { renderProgress(); document.querySelector('.nav-btn:nth-child(2)').classList.add('active'); }
    if(id === 'scr-profile') document.querySelector('.nav-btn:nth-child(3)').classList.add('active');
    window.scrollTo(0,0);
}

function resetApp() { if(confirm("¿Seguro que quieres borrar todo tu progreso y perfil?")) { localStorage.clear(); location.reload(); } }

init();

function changeMonth(offset) {
    currentViewDate.setMonth(currentViewDate.getMonth() + offset);
    renderCalendar();
}