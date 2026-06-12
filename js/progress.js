function renderProgress() {
    const canvas = document.getElementById('progressChart');

    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Contar sesiones por zona para el gráfico
    const counts = {};
    state.selectedZones.forEach(z => {
        counts[z] = state.sessions.filter(s => s.zone === z).length;
    });

    // Destruir gráfico anterior si existe para evitar duplicados
    if (progChart) progChart.destroy();

    progChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#ff4d6d', '#70a1ff', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: { 
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } 
            },
            cutout: '70%'
        }
    })

    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-items');
    container.innerHTML = "";

    if(state.sessions.length === 0){
        container.innerHTML = "<p>No hay sesiones aún.</p>";
        return;
    }

    const lastSessions = state.sessions.slice(-5).reverse();

    lastSessions.forEach(s => {
        container.innerHTML += `
            <div style="margin-bottom:8px;">
                ✅ ${s.zone} — ${new Date(s.date).toLocaleDateString()}
            </div>
        `;
    });
}