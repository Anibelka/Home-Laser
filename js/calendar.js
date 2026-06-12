function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('current-month-year');
    const details = document.getElementById('day-details');
    grid.innerHTML = "";
    
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    label.innerText = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentViewDate);
    
    ['D','L','M','X','J','V','S'].forEach(d => {
        grid.innerHTML += `<div style="font-weight:bold; color:var(--gray); padding-bottom:5px;">${d}</div>`;
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for(let i=0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const dateStr = dateObj.toISOString().split('T')[0];
        
        // Buscar sesiones pasadas y futuras
        const sessionsToday = state.sessions.filter(s => {
            return new Date(s.date).toISOString().split('T')[0] === dateStr;
        });

        const scheduledToday = state.scheduled.filter(s => {
            return new Date(s.date).toISOString().split('T')[0] === dateStr;
        });
        
        const hasSession = sessionsToday.length > 0;
        const hasScheduled = scheduledToday.length > 0;
        const isToday = new Date().toLocaleDateString() === dateStr;
        
        const dayEl = document.createElement('div');
        
        // LÓGICA DE COLORES
        let bgColor = "transparent";
        let textColor = "inherit";
        let border = "none";

        if (hasSession) {
            bgColor = "var(--primary)"; // Rosa: Realizado
            textColor = "white";
        } else if (hasScheduled) {
            bgColor = "#70a1ff"; // Azul: Pendiente/Futuro
            textColor = "white";
        } else if (isToday) {
            border = "1px solid var(--primary)";
            textColor = "var(--primary)";
        }

        dayEl.style.cssText = `padding: 8px 0; border-radius: 10px; cursor: pointer; background: ${bgColor}; color: ${textColor}; border: ${border}; font-weight: ${(hasSession || hasScheduled) ? 'bold' : 'normal'};`;
        dayEl.innerText = d;
        
        // DETALLES AL HACER CLIC
        dayEl.onclick = () => {
            let msg = `<b>${dateStr}:</b> `;
            if (hasSession) msg += `<br>✅ Realizado: ${sessionsToday.map(s => s.zone).join(", ")}`;
            if (hasScheduled) msg += `<br>📅 Toca hoy: ${scheduledToday.map(s => s.zone).join(", ")}`;
            if (!hasSession && !hasScheduled) msg += "Sin registros.";
            details.innerHTML = msg;
        };
        
        grid.appendChild(dayEl);
    }
}

function scheduleCalendar(zone, iso) {
    const d = new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=Láser+Ulike:+${encodeURIComponent(zone)}&dates=${d}/${d}&details=Recuerda+afeitarte+12h+antes.`;
    window.open(url, '_blank');
}

function downloadICS(zone, dateISO) {
    const date = new Date(dateISO);

    const start = date.toISOString().replace(/[-:]/g, "").split(".")[0];
    const endDate = new Date(date.getTime() + 30 * 60000);
    const end = endDate.toISOString().replace(/[-:]/g, "").split(".")[0];

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Láser Ulike: ${zone}
DTSTART:${start}
DTEND:${end}
DESCRIPTION:Sesión de depilación láser. Recuerda rasurar 12h antes.
END:VEVENT
END:VCALENDAR
`;

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `laser-${zone}.ics`;
    a.click();
}