<!-- Settings Modal -->
<div id="settings-modal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2><span class="material-icons-round">settings</span> <?= i18n($user_lang, 'settings') ?></h2>
            <button id="close-settings-btn" class="icon-btn"><span class="material-icons-round">close</span></button>
        </div>

        <div class="modal-body">
            <div class="form-group">
                <label for="lang-select"><?= i18n($user_lang, 'language') ?></label>
                <select id="lang-select">
                    <option value="pt-br"><?= i18n($user_lang, 'lang_pt') ?></option>
                    <option value="en"><?= i18n($user_lang, 'lang_en') ?></option>
                    <option value="es"><?= i18n($user_lang, 'lang_es') ?></option>
                </select>
            </div>

            <div class="form-group" style="margin-top: 15px;">
                <label for="theme-select"><?= i18n($user_lang, 'theme') ?></label>
                <select id="theme-select">
                    <option value="dark"><?= i18n($user_lang, 'theme_dark') ?></option>
                    <option value="light"><?= i18n($user_lang, 'theme_light') ?></option>
                    <option value="custom"><?= i18n($user_lang, 'theme_custom') ?></option>
                </select>
            </div>

            <div id="custom-theme-panel" class="hidden" style="margin-top: 15px; padding: 15px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600;"><?= i18n($user_lang, 'custom_theme_title') ?></h4>
                    <div style="display: flex; gap: 4px;">
                        <button id="export-theme-btn" class="icon-btn" style="padding: 4px;" aria-label="<?= i18n($user_lang, 'export') ?>" title="<?= i18n($user_lang, 'export') ?>">
                            <span class="material-icons-round" style="font-size: 18px;">download</span>
                        </button>
                        <button id="import-theme-btn" class="icon-btn" style="padding: 4px;" aria-label="<?= i18n($user_lang, 'import') ?>" title="<?= i18n($user_lang, 'import') ?>">
                            <span class="material-icons-round" style="font-size: 18px;">upload</span>
                        </button>
                        <input type="file" id="import-theme-file" accept=".json" class="hidden">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_bg') ?></label>
                        <input type="color" id="color-bg" value="#f4f5f7" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_widget') ?></label>
                        <input type="color" id="color-widget" value="#ffffff" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_text_primary') ?></label>
                        <input type="color" id="color-text-primary" value="#1e1e1e" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_text_secondary') ?></label>
                        <input type="color" id="color-text-secondary" value="#6b7280" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_accent') ?></label>
                        <input type="color" id="color-accent" value="#6d1b38" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_accent_hover') ?></label>
                        <input type="color" id="color-accent-hover" value="#8e2248" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="font-size: 0.8rem; margin-bottom: 0;"><?= i18n($user_lang, 'color_border') ?></label>
                        <input type="color" id="color-border" value="#e5e7eb" style="width: 100%; height: 30px; border: none; cursor: pointer; background: none;">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 10px;">
                    <label style="font-size: 0.8rem; margin-bottom: 4px;"><?= i18n($user_lang, 'bg_type') ?></label>
                    <select id="bg-type-select" style="font-size: 0.85rem; padding: 6px;">
                        <option value="none"><?= i18n($user_lang, 'bg_none') ?></option>
                        <option value="url"><?= i18n($user_lang, 'bg_url') ?></option>
                        <option value="upload"><?= i18n($user_lang, 'bg_upload') ?></option>
                    </select>
                </div>

                <div id="bg-url-group" class="form-group hidden" style="margin-bottom: 10px;">
                    <label style="font-size: 0.8rem; margin-bottom: 4px;"><?= i18n($user_lang, 'bg_url_label') ?></label>
                    <input type="text" id="bg-url-input" placeholder="https://..." style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--widget-bg); color: var(--text-primary); font-size: 0.85rem;">
                </div>

                <div id="bg-upload-group" class="form-group hidden" style="margin-bottom: 10px;">
                    <label style="font-size: 0.8rem; margin-bottom: 4px;"><?= i18n($user_lang, 'bg_upload_label') ?></label>
                    <input type="file" id="bg-upload-input" accept="image/*" style="width: 100%; font-size: 0.8rem; color: var(--text-secondary);">
                    <div id="bg-upload-status" style="font-size: 0.75rem; color: var(--success-color); margin-top: 4px;"></div>
                </div>

                <button id="save-custom-theme-btn" class="btn btn-primary" style="width: 100%; margin-top: 10px; padding: 8px;">
                    <span class="material-icons-round" style="font-size: 18px;">save</span> <?= i18n($user_lang, 'save_custom_theme') ?>
                </button>
            </div>
            
            <div class="form-group" style="margin-top: 15px;">
                <label for="screensaver-select"><?= i18n($user_lang, 'screensaver_model') ?></label>
                <div style="display: flex; gap: 8px;">
                    <select id="screensaver-select" style="flex-grow: 1;">
                        <option value="bolinha"><?= i18n($user_lang, 'screensaver_ball') ?></option>
                        <option value="matrix"><?= i18n($user_lang, 'screensaver_matrix') ?></option>
                        <option value="estrelas"><?= i18n($user_lang, 'screensaver_stars') ?></option>
                        <option value="chuva"><?= i18n($user_lang, 'screensaver_rain') ?></option>
                        <option value="cobrinha"><?= i18n($user_lang, 'screensaver_snake') ?></option>
                        <option value="terminal"><?= i18n($user_lang, 'screensaver_terminal') ?></option>
                    </select>
                    <button id="preview-screensaver-btn" class="icon-btn" title="Visualizar" style="background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0 10px;">
                        <span class="material-icons-round">play_arrow</span>
                    </button>
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <div class="form-group">
                <label><?= i18n($user_lang, 'backup_restore') ?></label>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--spacing-md);"><?= i18n($user_lang, 'backup_desc') ?></p>

                <div style="display: flex; gap: var(--spacing-sm);">
                    <button id="export-btn" class="btn btn-secondary">
                        <span class="material-icons-round">download</span> <?= i18n($user_lang, 'export') ?>
                    </button>
                    <button id="import-btn" class="btn btn-primary">
                        <span class="material-icons-round">upload</span> <?= i18n($user_lang, 'import') ?>
                    </button>
                    <input type="file" id="import-file" accept=".json" class="hidden">
                </div>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <div class="form-group">
                <label><?= i18n($user_lang, 'system_update') ?></label>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--spacing-md);"><?= i18n($user_lang, 'system_update_desc') ?></p>
                <button id="update-btn" class="btn btn-secondary" style="width: 100%;">
                    <span class="material-icons-round">system_update_alt</span> <?= i18n($user_lang, 'check_update') ?>
                </button>
                <div id="update-message" style="margin-top: 10px; font-size: 0.85rem; text-align: center;"></div>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <?php
            include_once __DIR__ . '/../version.php';
            ?>
            <div class="form-group" style="text-align: center;">
                <img src="assets/icon-192.png" alt="Minihome Logo" style="width: 64px; height: 64px; border-radius: 16px; margin-bottom: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <label style="display: block; margin-bottom: 0;"><?= i18n($user_lang, 'about_minihome') ?></label>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px;">
                    <p style="margin-bottom: 8px;"><?= i18n($user_lang, 'version') ?>: <strong><?= $version ?? i18n($user_lang, 'unknown') ?></strong></p>
                    <p style="margin-bottom: 8px;">
                        <a href="https://github.com/laraantunes/minihome" target="_blank" style="color: var(--accent-color); text-decoration: none;">GitHub</a> &bull; 
                        <?= i18n($user_lang, 'developed_by') ?> 💜 por <a href="https://laralabs.dev" target="_blank" style="color: var(--accent-color); text-decoration: none;">laralabs.dev</a>
                    </p>
                    <p style="margin-bottom: 4px;"><strong><?= i18n($user_lang, 'services_used') ?>:</strong></p>
                    <ul style="list-style-type: disc; list-style-position: inside; padding-left: 0; margin-left: 0;">
                        <li><a href="https://open-meteo.com/" target="_blank" style="color: var(--text-secondary); text-decoration: underline;">Open-Meteo API</a></li>
                        <li><a href="https://freesound.org/" target="_blank" style="color: var(--text-secondary); text-decoration: underline;">Freesound</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>