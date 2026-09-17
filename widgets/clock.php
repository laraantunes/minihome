<!-- Clock Widget -->
<div class="widget" id="clock-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">schedule</span> <?= i18n($user_lang, 'clock') ?></h2>
        <div style="display: flex; gap: 4px;">
            <button id="clock-add-tz-btn" class="icon-btn" aria-label="<?= i18n($user_lang, 'add_tz') ?>">
                <span class="material-icons-round">add</span>
            </button>
            <button class="icon-btn fullscreen-btn" aria-label="<?= i18n($user_lang, 'fullscreen') ?>" title="<?= i18n($user_lang, 'fullscreen') ?>">
                <span class="material-icons-round">fullscreen</span>
            </button>
        </div>
    </div>
    
    <div class="widget-content clock-content">
        <div class="main-clock">
            <div id="clock-main-time" class="clock-time">00:00:00</div>
            <div id="clock-main-date" class="clock-date">--</div>
        </div>

        <div id="clock-tz-list" class="tz-list">
            <!-- Extra timezones injected by JS -->
        </div>

        <div id="clock-tz-form" class="tz-form hidden">
            <label for="tz-select"><?= i18n($user_lang, 'select_tz') ?></label>
            <div style="display: flex; gap: 8px; margin-top: 5px;">
                <select id="tz-select">
                    <!-- Options populated by JS -->
                </select>
                <button id="tz-save-btn" class="btn btn-primary"><span class="material-icons-round">check</span></button>
                <button id="tz-cancel-btn" class="btn btn-secondary"><span class="material-icons-round">close</span></button>
            </div>
        </div>
    </div>
</div>
