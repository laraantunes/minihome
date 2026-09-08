/**
 * Minihome App Core
 * Handles initialization, LocalStorage generic methods, and theme application on load.
 */

const App = {
    init() {
        this.applyTheme();
        
        // Wait for DOM
        document.addEventListener('DOMContentLoaded', () => {
            // Widgets will self-initialize in their own scripts
        });
    },

    getTheme() {
        return localStorage.getItem('minihome_theme') || 'dark';
    },

    setTheme(theme) {
        localStorage.setItem('minihome_theme', theme);
        this.applyTheme();
    },

    applyTheme() {
        const theme = this.getTheme();
        document.body.className = `theme-${theme}`;
    },

    // Local Storage Helpers
    saveData(key, data) {
        localStorage.setItem(`minihome_${key}`, JSON.stringify(data));
    },

    loadData(key, defaultValue = null) {
        const data = localStorage.getItem(`minihome_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    },

    // Backup & Restore
    async exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('minihome_')) {
                data[key] = localStorage.getItem(key);
            }
        }
        
        const jsonContent = JSON.stringify(data, null, 2);
        const fileName = `minihome-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        if (window.File && navigator.canShare) {
            try {
                const file = new File([jsonContent], fileName, { type: 'application/json' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Backup Minihome',
                        text: 'Meu backup de configurações e dados do minihome.'
                    });
                    return;
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
            }
        }
        
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    for (const key in data) {
                        if (key.startsWith('minihome_')) {
                            localStorage.setItem(key, data[key]);
                        }
                    }
                    resolve();
                } catch (err) {
                    reject('Arquivo JSON inválido.');
                }
            };
            reader.onerror = () => reject('Erro ao ler arquivo.');
            reader.readAsText(file);
        });
    },

    // UI Helpers
    showToast(message) {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Show animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Hide and remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
};

// Initialize immediately to prevent theme flash
App.init();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .catch(() => {});
  });
}
