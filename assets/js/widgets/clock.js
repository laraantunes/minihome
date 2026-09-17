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
    let isDraggingClock = false;
    let dragStartIdxClock;

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
        if (isDraggingClock) return; // Prevent overwriting while dragging
        
        const now = new Date();
        
        // Main local time
        mainTime.textContent = now.toLocaleTimeString(App.getLang());
        mainDate.textContent = now.toLocaleDateString(App.getLang(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Extra timezones
        tzList.innerHTML = '';
        extraZones.forEach((tz, index) => {
            try {
                // Get time and short timezone name (e.g. BRT, EST)
                const formatted = new Intl.DateTimeFormat(App.getLang(), {
                    timeZone: tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }).format(now);

                const tzName = tz.split('/')[1].replace('_', ' ');

                const div = document.createElement('div');
                div.className = 'tz-item';
                div.setAttribute('draggable', 'true');
                div.setAttribute('data-index', index);
                
                div.innerHTML = `
                    <span class="material-icons-round" style="cursor: grab; color: var(--text-muted); font-size: 1.1rem; margin-right: 4px;">drag_indicator</span>
                    <span class="tz-name">${tzName}</span>
                    <span class="tz-time">${formatted}</span>
                    <button class="icon-btn tz-remove" data-index="${index}"><span class="material-icons-round" style="font-size:1rem;">delete</span></button>
                `;
                
                div.addEventListener('dragstart', (e) => {
                    isDraggingClock = true;
                    dragStartIdxClock = +e.currentTarget.getAttribute('data-index');
                    e.dataTransfer.effectAllowed = 'move';
                });
                
                div.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    return false;
                });
                
                div.addEventListener('dragenter', (e) => {
                    e.currentTarget.classList.add('drag-over');
                });
                
                div.addEventListener('dragleave', (e) => {
                    e.currentTarget.classList.remove('drag-over');
                });
                
                div.addEventListener('drop', (e) => {
                    e.stopPropagation();
                    isDraggingClock = false;
                    e.currentTarget.classList.remove('drag-over');
                    
                    const dragEndIndex = +e.currentTarget.getAttribute('data-index');
                    if (dragStartIdxClock !== dragEndIndex && dragStartIdxClock !== undefined) {
                        const item = extraZones.splice(dragStartIdxClock, 1)[0];
                        extraZones.splice(dragEndIndex, 0, item);
                        App.saveData('timezones', extraZones);
                        updateClocks();
                    }
                    return false;
                });
                
                div.addEventListener('dragend', (e) => {
                    isDraggingClock = false;
                });

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
