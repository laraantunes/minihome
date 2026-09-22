document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const themeSelect = document.getElementById('theme-select');
    const langSelect = document.getElementById('lang-select');
    const screensaverSelect = document.getElementById('screensaver-select');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // Open/Close Modal
    settingsBtn.addEventListener('click', () => {
        themeSelect.value = App.getTheme();
        if (langSelect) {
            langSelect.value = App.getLang();
        }
        if (screensaverSelect) {
            screensaverSelect.value = App.loadData('screensaver_type', 'bolinha');
        }
        
        // Custom Theme Panel Init
        const customThemePanel = document.getElementById('custom-theme-panel');
        if (customThemePanel) {
            if (themeSelect.value === 'custom') {
                customThemePanel.classList.remove('hidden');
                const customData = App.loadData('custom_theme', {});
                if (customData.colors) {
                    document.getElementById('color-bg').value = customData.colors.bg || '#f4f5f7';
                    document.getElementById('color-widget').value = customData.colors.widget || '#ffffff';
                    document.getElementById('color-text-primary').value = customData.colors.textPrimary || '#1e1e1e';
                    document.getElementById('color-text-secondary').value = customData.colors.textSecondary || '#6b7280';
                    document.getElementById('color-accent').value = customData.colors.accent || '#6d1b38';
                    document.getElementById('color-accent-hover').value = customData.colors.accentHover || '#8e2248';
                    document.getElementById('color-border').value = customData.colors.border || '#e5e7eb';
                }
                if (customData.bgType) {
                    document.getElementById('bg-type-select').value = customData.bgType;
                }
                if (customData.bgUrl) {
                    document.getElementById('bg-url-input').value = customData.bgUrl;
                }
                
                const bgType = document.getElementById('bg-type-select').value;
                document.getElementById('bg-url-group').classList.toggle('hidden', bgType !== 'url');
                document.getElementById('bg-upload-group').classList.toggle('hidden', bgType !== 'upload');
            } else {
                customThemePanel.classList.add('hidden');
            }
        }
        
        settingsModal.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    // Close on overlay click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
            settingsModal.classList.remove('active');
        }
    });

    // Theme Change
    themeSelect.addEventListener('change', (e) => {
        App.setTheme(e.target.value);
        
        const customThemePanel = document.getElementById('custom-theme-panel');
        if (customThemePanel) {
            if (e.target.value === 'custom') {
                customThemePanel.classList.remove('hidden');
            } else {
                customThemePanel.classList.add('hidden');
            }
        }
    });

    // Custom Theme BG Type Change
    const bgTypeSelect = document.getElementById('bg-type-select');
    if (bgTypeSelect) {
        bgTypeSelect.addEventListener('change', (e) => {
            const bgType = e.target.value;
            document.getElementById('bg-url-group').classList.toggle('hidden', bgType !== 'url');
            document.getElementById('bg-upload-group').classList.toggle('hidden', bgType !== 'upload');
        });
    }

    // Custom Theme File Upload
    const bgUploadInput = document.getElementById('bg-upload-input');
    if (bgUploadInput) {
        bgUploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            const statusEl = document.getElementById('bg-upload-status');
            if (file) {
                try {
                    statusEl.style.color = "var(--text-secondary)";
                    statusEl.textContent = "Salvando...";
                    if (window.MinihomeDB) {
                        await window.MinihomeDB.saveImage('bg_image', file);
                        statusEl.style.color = "var(--success-color)";
                        statusEl.textContent = "Salvo com sucesso!";
                    } else {
                        throw new Error("DB indisponível");
                    }
                } catch (err) {
                    statusEl.style.color = "var(--danger-color)";
                    statusEl.textContent = "Erro ao salvar imagem.";
                }
            }
        });
    }

    // Save Custom Theme
    const saveCustomThemeBtn = document.getElementById('save-custom-theme-btn');
    if (saveCustomThemeBtn) {
        saveCustomThemeBtn.addEventListener('click', () => {
            const customData = {
                colors: {
                    bg: document.getElementById('color-bg').value,
                    widget: document.getElementById('color-widget').value,
                    textPrimary: document.getElementById('color-text-primary').value,
                    textSecondary: document.getElementById('color-text-secondary').value,
                    accent: document.getElementById('color-accent').value,
                    accentHover: document.getElementById('color-accent-hover').value,
                    border: document.getElementById('color-border').value,
                },
                bgType: document.getElementById('bg-type-select').value,
                bgUrl: document.getElementById('bg-url-input').value
            };
            App.saveData('custom_theme', customData);
            App.applyTheme(); 
            App.showToast("Tema customizado salvo!");
        });
    }

    // Language Change
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            App.setLang(e.target.value);
        });
    }

    // Screensaver Change
    if (screensaverSelect) {
        screensaverSelect.addEventListener('change', (e) => {
            App.saveData('screensaver_type', e.target.value);
        });
    }

    const previewScreensaverBtn = document.getElementById('preview-screensaver-btn');
    if (previewScreensaverBtn) {
        previewScreensaverBtn.addEventListener('click', () => {
            if (window.startScreensaver) {
                window.startScreensaver();
            }
        });
    }

    // Export Data
    exportBtn.addEventListener('click', () => {
        App.exportData();
    });

    // Import Data
    importBtn.addEventListener('click', () => {
        importFile.click();
    });

    importFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await App.importData(file);
            App.showToast(App.i18n('import_success_reload'));
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            App.showToast(err);
        }
        
        // Reset input
        importFile.value = '';
    });

    // Update System
    const updateBtn = document.getElementById('update-btn');
    const updateMsg = document.getElementById('update-message');

    if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
            if (!(await App.confirm(App.i18n('confirm_update_system')))) {
                return;
            }

            const originalHtml = updateBtn.innerHTML;
            updateBtn.disabled = true;
            updateBtn.innerHTML = '<span class="material-icons-round spinning">sync</span> ' + App.i18n('updating');
            updateMsg.textContent = '';
            updateMsg.style.color = 'var(--text-primary)';

            try {
                const response = await fetch('update_action.php', { method: 'POST' });
                const data = await response.json();

                if (data.success) {
                    updateMsg.style.color = 'var(--success-color)';
                    updateMsg.textContent = data.message;
                    setTimeout(() => window.location.reload(), 3000);
                } else {
                    updateMsg.style.color = 'var(--danger-color)';
                    updateMsg.textContent = data.message || App.i18n('unknown_error');
                }
            } catch (err) {
                updateMsg.style.color = 'var(--danger-color)';
                updateMsg.textContent = App.i18n('server_comm_fail');
            } finally {
                updateBtn.disabled = false;
                updateBtn.innerHTML = originalHtml;
            }
        });
    }
});
