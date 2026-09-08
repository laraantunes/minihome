document.addEventListener('DOMContentLoaded', () => {
    const mainTime = document.getElementById('clock-main-time');
    const mainDate = document.getElementById('clock-main-date');
    const tzList = document.getElementById('clock-tz-list');
    const addTzBtn = document.getElementById('clock-add-tz-btn');
    const tzForm = document.getElementById('clock-tz-form');
    const tzSelect = document.getElementById('tz-select');
    const tzSaveBtn = document.getElementById('tz-save-btn');
    const tzCancelBtn = document.getElementById('tz-cancel-btn');

    let extraZones = App.loadData('timezones', []);

    const commonTimezones = [
        'America/Sao_Paulo', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
        'America/Mexico_City', 'America/Bogota', 'America/Toronto',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
        'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai', 'Asia/Singapore',
        'Australia/Sydney', 'Pacific/Auckland'
    ];

    // Populate select
    commonTimezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.split('/')[1].replace('_', ' ');
        tzSelect.appendChild(option);
    });

    function updateClocks() {
        const now = new Date();
        
        // Main local time
        mainTime.textContent = now.toLocaleTimeString('pt-BR');
        mainDate.textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Extra timezones
        tzList.innerHTML = '';
        extraZones.forEach((tz, index) => {
            try {
                // Get time and short timezone name (e.g. BRT, EST)
                const formatted = new Intl.DateTimeFormat('pt-BR', {
                    timeZone: tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }).format(now);

                const tzName = tz.split('/')[1].replace('_', ' ');

                const div = document.createElement('div');
                div.className = 'tz-item';
                div.innerHTML = `
                    <span class="tz-name">${tzName}</span>
                    <span class="tz-time">${formatted}</span>
                    <button class="icon-btn tz-remove" data-index="${index}"><span class="material-icons-round" style="font-size:1rem;">delete</span></button>
                `;
                tzList.appendChild(div);
            } catch (e) {
                // Invalid timezone
            }
        });

        // Attach remove events
        document.querySelectorAll('.tz-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                extraZones.splice(idx, 1);
                App.saveData('timezones', extraZones);
                updateClocks();
            });
        });
    }

    // Tick every second
    setInterval(updateClocks, 1000);
    updateClocks();

    addTzBtn.addEventListener('click', () => {
        tzForm.classList.remove('hidden');
    });

    tzCancelBtn.addEventListener('click', () => {
        tzForm.classList.add('hidden');
    });

    tzSaveBtn.addEventListener('click', () => {
        const tz = tzSelect.value;
        if (!extraZones.includes(tz)) {
            extraZones.push(tz);
            App.saveData('timezones', extraZones);
            updateClocks();
        }
        tzForm.classList.add('hidden');
    });
});
