<!-- Todo Widget -->
<div class="widget" id="todo-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">check_circle</span> <?= i18n($user_lang, 'tasks') ?></h2>
        <div class="todo-controls" style="display: flex; gap: 4px;">
            <button id="todo-export-csv" class="icon-btn" aria-label="<?= i18n($user_lang, 'export_csv') ?>" title="<?= i18n($user_lang, 'export_csv') ?>"><span class="material-icons-round">download</span></button>
            <button id="todo-copy-md" class="icon-btn" aria-label="<?= i18n($user_lang, 'copy_md') ?>" title="<?= i18n($user_lang, 'copy_md') ?>"><span class="material-icons-round">content_copy</span></button>
            <button id="todo-expand-btn" class="icon-btn" aria-label="<?= i18n($user_lang, 'expand') ?>" title="<?= i18n($user_lang, 'expand_collapse') ?>"><span class="material-icons-round">open_in_full</span></button>
        </div>
    </div>
    
    <div class="widget-content todo-content">
        <div class="todo-form">
            <input type="text" id="todo-input" placeholder="<?= i18n($user_lang, 'new_task') ?>">
            <button id="todo-add-btn" class="btn btn-primary"><span class="material-icons-round">add</span></button>
        </div>
        
        <div class="todo-list-container">
            <ul id="todo-list" class="todo-list">
                <!-- Tasks injected by JS -->
            </ul>
        </div>
    </div>
</div>
