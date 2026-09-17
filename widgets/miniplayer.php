<!-- Miniplayer Widget -->
<div class="widget" id="miniplayer-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">play_circle</span> Miniplayer</h2>
        <div style="display: flex; gap: 4px;">
            <button class="icon-btn fullscreen-btn" aria-label="<?= i18n($user_lang, 'fullscreen') ?>" title="<?= i18n($user_lang, 'fullscreen') ?>">
                <span class="material-icons-round">fullscreen</span>
            </button>
        </div>
    </div>
    
    <div class="widget-content miniplayer-content">
        <!-- Video Player -->
        <div id="miniplayer-iframe-container" class="miniplayer-iframe-container hidden">
            <iframe id="miniplayer-iframe" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        
        <div id="miniplayer-empty-state" class="text-center">
            <span class="material-icons-round" style="font-size: 3rem; color: var(--text-secondary); opacity: 0.5;">smart_display</span>
            <p style="color: var(--text-secondary); margin-top: 8px;"><?= i18n($user_lang, 'no_video_loaded') ?></p>
        </div>

        <!-- Add Link Form -->
        <div class="miniplayer-form" style="margin-top: 1rem;">
            <div style="display: flex; gap: 8px;">
                <input type="url" id="miniplayer-input" class="form-control" placeholder="<?= i18n($user_lang, 'paste_youtube_link') ?>" style="flex: 1;">
                <button id="miniplayer-add-btn" class="btn btn-primary" title="<?= i18n($user_lang, 'add_to_playlist') ?>">
                    <span class="material-icons-round">add</span>
                </button>
            </div>
        </div>

        <!-- Playlist -->
        <div class="miniplayer-playlist-container" style="margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;"><?= i18n($user_lang, 'playback_queue') ?></h3>
                <button id="miniplayer-clear-btn" class="icon-btn" title="<?= i18n($user_lang, 'clear_list') ?>" style="color: var(--text-secondary); width: 24px; height: 24px;">
                    <span class="material-icons-round" style="font-size: 1.1rem;">delete_sweep</span>
                </button>
            </div>
            <ul id="miniplayer-playlist" class="miniplayer-list">
                <!-- Items injected by JS -->
            </ul>
        </div>
    </div>
</div>
