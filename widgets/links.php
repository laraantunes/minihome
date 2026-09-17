<!-- Links Widget -->
<div class="widget" id="links-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">link</span> <?= i18n($user_lang, 'links') ?></h2>
        <div class="links-controls notes-controls">
            <button id="links-add-btn" class="icon-btn" aria-label="<?= i18n($user_lang, 'new_link') ?>"><span class="material-icons-round">add</span></button>
        </div>
    </div>
    
    <div class="widget-content links-content" style="display: flex; flex-direction: column; overflow-y: auto; max-height: 250px;">
        <ul id="links-list-container" style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
            <!-- Links added via JS -->
        </ul>
        <div id="links-empty" style="text-align: center; color: var(--text-secondary); padding: 20px; display: none;"><?= i18n($user_lang, 'no_links') ?></div>
    </div>
</div>

<!-- Link Modal -->
<div id="link-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 id="link-modal-title" style="font-size: 1.1rem;"><?= i18n($user_lang, 'new_link') ?></h2>
        </div>
        <div class="form-group" style="margin-bottom: 10px;">
            <input type="text" id="link-modal-name" placeholder="<?= i18n($user_lang, 'link_title_ex') ?>">
        </div>
        <div class="form-group">
            <input type="url" id="link-modal-url" placeholder="<?= i18n($user_lang, 'link_url_ex') ?>">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 15px;">
            <button id="link-modal-cancel" class="btn btn-secondary"><?= i18n($user_lang, 'cancel') ?></button>
            <button id="link-modal-save" class="btn btn-primary"><?= i18n($user_lang, 'save') ?></button>
        </div>
    </div>
</div>

<!-- Link Delete Modal -->
<div id="link-del-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;"><?= i18n($user_lang, 'delete_link') ?></h2>
        </div>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);"><?= i18n($user_lang, 'delete_link_confirm') ?></p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="link-del-cancel" class="btn btn-secondary"><?= i18n($user_lang, 'cancel') ?></button>
            <button id="link-del-confirm" class="btn btn-primary" style="background-color: var(--danger-color);"><?= i18n($user_lang, 'delete') ?></button>
        </div>
    </div>
</div>
