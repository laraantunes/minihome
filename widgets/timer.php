<!-- Timer Widget -->
<div class="widget" id="timer-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">timer</span> Timer</h2>
    </div>
    
    <div class="widget-content timer-content">
        <div id="timer-display" class="timer-display">00:00</div>
        
        <div class="timer-quick-btns">
            <button class="btn btn-secondary timer-quick" data-time="30">30s</button>
            <button class="btn btn-secondary timer-quick" data-time="60">1m</button>
            <button class="btn btn-secondary timer-quick" data-time="300">5m</button>
            <button class="btn btn-secondary timer-quick" data-time="600">10m</button>
        </div>

        <div class="timer-custom">
            <input type="number" id="timer-min-input" placeholder="Min" min="0" max="99">
            <span style="font-weight: bold;">:</span>
            <input type="number" id="timer-sec-input" placeholder="Seg" min="0" max="59">
            <button id="timer-set-btn" class="btn btn-secondary"><span class="material-icons-round">edit</span></button>
        </div>

        <div class="timer-controls">
            <button id="timer-start-btn" class="btn btn-primary"><span class="material-icons-round">play_arrow</span></button>
            <button id="timer-pause-btn" class="btn btn-secondary hidden"><span class="material-icons-round">pause</span></button>
            <button id="timer-reset-btn" class="btn btn-secondary"><span class="material-icons-round">replay</span></button>
        </div>
    </div>
    <audio id="timer-alarm-audio" src="assets/sound/611821__syntheffects__timer-alarm-detector-bleeping-beeping.wav" preload="auto"></audio>
</div>
