<!-- Stopwatch Widget -->
<div class="widget" id="stopwatch-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">timer_10</span> <?= i18n($user_lang, 'stopwatch') ?></h2>
        <button class="icon-btn fullscreen-btn" aria-label="<?= i18n($user_lang, 'fullscreen') ?>" title="<?= i18n($user_lang, 'fullscreen') ?>">
            <span class="material-icons-round">fullscreen</span>
        </button>
    </div>
    
    <div class="widget-content stopwatch-content">
        <div id="sw-display" class="sw-display">00:00:00.00</div>
        
        <div class="sw-controls">
            <button id="sw-start-btn" class="btn btn-primary"><span class="material-icons-round">play_arrow</span></button>
            <button id="sw-pause-btn" class="btn btn-secondary hidden"><span class="material-icons-round">pause</span></button>
            <button id="sw-lap-btn" class="btn btn-secondary"><span class="material-icons-round">flag</span></button>
            <button id="sw-reset-btn" class="btn btn-secondary"><span class="material-icons-round">replay</span></button>
        </div>

        <div class="sw-laps">
            <ul id="sw-laps-list">
                <!-- Laps added via JS -->
            </ul>
        </div>
    </div>
</div>
