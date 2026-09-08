document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('sw-display');
    const startBtn = document.getElementById('sw-start-btn');
    const pauseBtn = document.getElementById('sw-pause-btn');
    const resetBtn = document.getElementById('sw-reset-btn');
    const lapBtn = document.getElementById('sw-lap-btn');
    const lapsList = document.getElementById('sw-laps-list');

    let startTime = 0;
    let elapsedTime = 0;
    let swInterval = null;
    let isRunning = false;
    let laps = [];

    function formatTime(ms) {
        const date = new Date(ms);
        const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
        const m = date.getUTCMinutes().toString().padStart(2, '0');
        const s = date.getUTCSeconds().toString().padStart(2, '0');
        const msFormatted = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${h}:${m}:${s}.${msFormatted}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(elapsedTime);
    }

    function start() {
        if (isRunning) return;
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        swInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10); // Update every 10ms for smooth centiseconds
    }

    function pause() {
        isRunning = false;
        clearInterval(swInterval);
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function reset() {
        pause();
        elapsedTime = 0;
        updateDisplay();
        laps = [];
        renderLaps();
    }

    function lap() {
        if (elapsedTime > 0) {
            laps.unshift(elapsedTime); // add to top
            renderLaps();
        }
    }

    function renderLaps() {
        lapsList.innerHTML = '';
        laps.forEach((lapTime, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>Volta ${laps.length - index}</span> <span>${formatTime(lapTime)}</span>`;
            lapsList.appendChild(li);
        });
    }

    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);
    lapBtn.addEventListener('click', lap);
});
