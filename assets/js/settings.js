document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const themeSelect = document.getElementById('theme-select');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // Open/Close Modal
    settingsBtn.addEventListener('click', () => {
        themeSelect.value = App.getTheme();
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
            App.showToast('Dados importados com sucesso! A página será recarregada.');
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            App.showToast(err);
        }
        
        // Reset input
        importFile.value = '';
    });
});
