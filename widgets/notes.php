<!-- Notes Widget -->
<div class="widget" id="notes-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">edit_note</span> <?= i18n($user_lang, 'fast_notes') ?></h2>
        <div class="notes-controls">
            <button id="notes-add-tab" class="icon-btn" aria-label="<?= i18n($user_lang, 'new_tab') ?>"><span class="material-icons-round">add</span></button>
            <button id="notes-edit-tab" class="icon-btn" aria-label="<?= i18n($user_lang, 'rename_tab') ?>"><span class="material-icons-round">edit</span></button>
            <button id="notes-export-btn" class="icon-btn" aria-label="<?= i18n($user_lang, 'export_note') ?>" title="<?= i18n($user_lang, 'export_note') ?>"><span class="material-icons-round">download</span></button>
            <button id="notes-del-tab" class="icon-btn" aria-label="<?= i18n($user_lang, 'delete_tab') ?>" style="color: var(--danger-color);"><span class="material-icons-round">delete</span></button>
            <button id="notes-expand-btn" class="icon-btn" aria-label="<?= i18n($user_lang, 'expand') ?>" title="<?= i18n($user_lang, 'expand_collapse') ?>"><span class="material-icons-round">open_in_full</span></button>
        </div>
    </div>
    
    <div class="widget-content notes-content">
        <div class="notes-tabs" id="notes-tabs">
            <!-- Tabs added via JS -->
        </div>
        
        <textarea id="notes-textarea" class="notes-textarea" placeholder="<?= i18n($user_lang, 'start_typing') ?>"></textarea>
    </div>
</div>

<!-- Notes Modal -->
<div id="notes-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 id="notes-modal-title" style="font-size: 1.1rem;"><?= i18n($user_lang, 'tab_name') ?></h2>
        </div>
        <div class="form-group">
            <input type="text" id="notes-modal-input" placeholder="<?= i18n($user_lang, 'type_name') ?>">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="notes-modal-cancel" class="btn btn-secondary"><?= i18n($user_lang, 'cancel') ?></button>
            <button id="notes-modal-save" class="btn btn-primary"><?= i18n($user_lang, 'save') ?></button>
        </div>
    </div>
</div>


<!-- Notes Delete Modal -->
<div id="notes-del-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;"><?= i18n($user_lang, 'delete_tab_q') ?></h2>
        </div>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);"><?= i18n($user_lang, 'delete_tab_confirm') ?></p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="notes-del-cancel" class="btn btn-secondary"><?= i18n($user_lang, 'cancel') ?></button>
            <button id="notes-del-confirm" class="btn btn-primary" style="background-color: var(--danger-color);"><?= i18n($user_lang, 'delete') ?></button>
        </div>
    </div>
</div>

<!-- Notes Export Modal -->
<div id="notes-export-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;"><?= i18n($user_lang, 'choose_extension') ?></h2>
        </div>
        <div class="form-group" style="margin-bottom: 15px;">
            <select id="notes-export-ext" class="form-control" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary);">
                <option value="txt">txt (<?= i18n($user_lang, 'default') ?>)</option>
                <option value="md">md</option>
                <option value="custom"><?= i18n($user_lang, 'custom_extension') ?></option>
            </select>
        </div>
        <div class="form-group" id="notes-export-custom-group" style="display: none; margin-bottom: 15px;">
            <input type="text" id="notes-export-custom-input" placeholder="<?= i18n($user_lang, 'type_extension') ?>" class="form-control" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary);">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="notes-export-cancel" class="btn btn-secondary"><?= i18n($user_lang, 'cancel') ?></button>
            <button id="notes-export-confirm" class="btn btn-primary"><?= i18n($user_lang, 'export') ?></button>
        </div>
    </div>
</div>
