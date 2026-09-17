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
    });

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
