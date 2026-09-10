document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const resetBtn = document.getElementById('timer-reset-btn');
    const setBtn = document.getElementById('timer-set-btn');
    const minInput = document.getElementById('timer-min-input');
    const secInput = document.getElementById('timer-sec-input');
    const alarmAudio = document.getElementById('timer-alarm-audio');
    
    let totalSeconds = 0;
    let currentSeconds = 0;
    let timerInterval = null;
    let isRunning = false;

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(currentSeconds);
    }

    function setTime(seconds) {
        totalSeconds = seconds;
        currentSeconds = seconds;
        updateDisplay();
        stopTimer();
        display.classList.remove('timer-finished');
        if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
        }
    }

    function startTimer() {
        if (currentSeconds <= 0 || isRunning) return;
        isRunning = true;
        display.classList.remove('timer-finished');
        
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');

        timerInterval = setInterval(() => {
            currentSeconds--;
            updateDisplay();
            
            if (currentSeconds <= 0) {
                stopTimer();
                display.classList.add('timer-finished');
                if (alarmAudio) {
                    alarmAudio.currentTime = 0;
                    alarmAudio.play().catch(e => console.log('Autoplay blocked:', e));
                }
            }
        }, 1000);
    }

    function stopTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function resetTimer() {
        stopTimer();
        currentSeconds = totalSeconds;
        updateDisplay();
        display.classList.remove('timer-finished');
        if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
        }
    }

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);

    document.querySelectorAll('.timer-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const time = parseInt(e.target.getAttribute('data-time'));
            setTime(time);
        });
    });

    setBtn.addEventListener('click', () => {
        const m = parseInt(minInput.value) || 0;
        const s = parseInt(secInput.value) || 0;
        const total = (m * 60) + s;
        if (total > 0) setTime(total);
        minInput.value = '';
        secInput.value = '';
    });
});
