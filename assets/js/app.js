/**
 * Minihome App Core
 * Handles initialization, LocalStorage generic methods, and theme application on load.
 */

const App = {
    i18nData: window.I18N_PRELOAD || {},

    init() {
        this.applyTheme();
        
        // Wait for DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.initWidgetsUI();
            // Widgets will self-initialize in their own scripts
        });
    },

    i18n(key) {
        return this.i18nData[key] !== undefined ? this.i18nData[key] : key;
    },

    getLang() {
        return localStorage.getItem('minihome_lang') || 'pt-br';
    },

    setLang(lang) {
        localStorage.setItem('minihome_lang', lang);
        document.cookie = `minihome_lang=${lang};path=/;max-age=31536000`;
        window.location.reload();
    },

    initWidgetsUI() {
        const grid = document.querySelector('.dashboard-grid');
        if (!grid) return;

        const widgetsOrder = this.loadData('widgets_order', []);
        const widgetsHidden = this.loadData('widgets_hidden', []);

        // Sort DOM elements based on widgetsOrder
        if (widgetsOrder.length > 0) {
            widgetsOrder.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    grid.appendChild(el);
                }
            });
        }

        // Initialize SortableJS
        if (typeof Sortable !== 'undefined') {
            new Sortable(grid, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: () => {
                    const newOrder = Array.from(grid.children).map(el => el.id).filter(id => id);
                    this.saveData('widgets_order', newOrder);
                }
            });
        }

        // Inject widget footers
        document.querySelectorAll('.widget').forEach(widget => {
            const id = widget.id;
            
            // Check visibility
            if (widgetsHidden.includes(id)) {
                widget.classList.add('hidden');
            }

            const dragBtn = document.createElement('button');
            dragBtn.className = 'icon-btn drag-handle';
            dragBtn.innerHTML = '<span class="material-icons-round">drag_indicator</span>';
            dragBtn.title = App.i18n('move_widget');
            
            const hideBtn = document.createElement('button');
            hideBtn.className = 'icon-btn hide-widget-btn';
            hideBtn.innerHTML = '<span class="material-icons-round">visibility_off</span>';
            hideBtn.title = App.i18n('hide_widget');
            
            hideBtn.addEventListener('click', () => {
                widget.classList.add('hidden');
                let hidden = this.loadData('widgets_hidden', []);
                if (!hidden.includes(id)) {
                    hidden.push(id);
                    this.saveData('widgets_hidden', hidden);
                }
                
                // Dispatch event so top menu can update
                window.dispatchEvent(new CustomEvent('widgetHiddenChanged'));
            });

            const footer = document.createElement('div');
            footer.className = 'widget-footer';
            footer.appendChild(dragBtn);
            footer.appendChild(hideBtn);
            
            widget.appendChild(footer);
        });

        this.initWidgetsMenu();
    },

    initWidgetsMenu() {
        const btn = document.getElementById('widgets-menu-btn');
        const menu = document.getElementById('widgets-menu');
        const list = document.getElementById('widgets-menu-list');

        if (!btn || !menu || !list) return;

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });

        const updateMenu = () => {
            list.innerHTML = '';
            const widgetsHidden = this.loadData('widgets_hidden', []);
            
            document.querySelectorAll('.widget').forEach(widget => {
                const id = widget.id;
                const titleEl = widget.querySelector('.widget-header h2');
                const titleHTML = titleEl ? titleEl.innerHTML : id;
                
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                
                const isHidden = widgetsHidden.includes(id);
                
                item.innerHTML = `
                    <label>
                        <input type="checkbox" ${!isHidden ? 'checked' : ''}>
                        <span style="display: flex; align-items: center; gap: 8px;">${titleHTML}</span>
                    </label>
                `;
                
                const checkbox = item.querySelector('input');
                checkbox.addEventListener('change', (e) => {
                    let hidden = this.loadData('widgets_hidden', []);
                    if (e.target.checked) {
                        // Show widget
                        widget.classList.remove('hidden');
                        hidden = hidden.filter(h => h !== id);
                    } else {
                        // Hide widget
                        widget.classList.add('hidden');
                        if (!hidden.includes(id)) hidden.push(id);
                    }
                    this.saveData('widgets_hidden', hidden);
                });
                
                list.appendChild(item);
            });
        };

        updateMenu();
        window.addEventListener('widgetHiddenChanged', updateMenu);
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

        let styleTag = document.getElementById('custom-theme-styles');
        if (styleTag) styleTag.remove();
        
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        
        if (theme === 'custom') {
            const customData = this.loadData('custom_theme', {});
            if (customData.colors) {
                const css = `
                    body.theme-custom {
                        --bg-color: ${customData.colors.bg};
                        --widget-bg: ${customData.colors.widget};
                        --text-primary: ${customData.colors.textPrimary};
                        --text-secondary: ${customData.colors.textSecondary};
                        --accent-color: ${customData.colors.accent};
                        --accent-hover: ${customData.colors.accentHover};
                        --border-color: ${customData.colors.border};
                    }
                `;
                styleTag = document.createElement('style');
                styleTag.id = 'custom-theme-styles';
                styleTag.textContent = css;
                document.head.appendChild(styleTag);
            }
            
            if (customData.bgType === 'url' && customData.bgUrl) {
                document.body.style.backgroundImage = `url('${customData.bgUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            } else if (customData.bgType === 'upload' && window.MinihomeDB) {
                window.MinihomeDB.loadImage('bg_image').then(blob => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        document.body.style.backgroundImage = `url('${url}')`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                    }
                }).catch(err => console.error("Error loading bg image", err));
            }
        }
    },

    // Local Storage Helpers
    saveData(key, data) {
        localStorage.setItem(`minihome_${key}`, JSON.stringify(data));
    },

    confirm(message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const msgEl = document.getElementById('confirm-message');
            const yesBtn = document.getElementById('confirm-yes-btn');
            const noBtn = document.getElementById('confirm-no-btn');
            
            if (!modal || !msgEl || !yesBtn || !noBtn) {
                // Fallback to native if not found
                resolve(window.confirm(message));
                return;
            }

            msgEl.textContent = message;
            modal.classList.add('active');
            
            const cleanup = () => {
                modal.classList.remove('active');
                yesBtn.removeEventListener('click', onYes);
                noBtn.removeEventListener('click', onNo);
            };
            
            const onYes = () => { cleanup(); resolve(true); };
            const onNo = () => { cleanup(); resolve(false); };
            
            yesBtn.addEventListener('click', onYes);
            noBtn.addEventListener('click', onNo);
        });
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
                        title: App.i18n('backup_title'),
                        text: App.i18n('backup_desc')
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
                    reject(App.i18n('invalid_json'));
                }
            };
            reader.onerror = () => reject(App.i18n('error_reading_file'));
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

// Global Fullscreen Handlers
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fullscreen-btn');
    if (btn) {
        const widget = btn.closest('.widget');
        if (widget) {
            widget.classList.toggle('fullscreen');
            const icon = btn.querySelector('.material-icons-round');
            if (icon) {
                if (widget.classList.contains('fullscreen')) {
                    icon.textContent = 'fullscreen_exit';
                } else {
                    icon.textContent = 'fullscreen';
                }
            }
        }
    }
});

// Global ESC Handler for exiting fullscreen and screensaver
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Exit screensaver
        if (typeof window.isScreensaverRunning === 'function' && window.isScreensaverRunning()) {
            window.stopScreensaver();
        }
        
        // Exit any fullscreen widget
        const fullscreenWidgets = document.querySelectorAll('.widget.fullscreen');
        fullscreenWidgets.forEach(widget => {
            widget.classList.remove('fullscreen');
            const icon = widget.querySelector('.fullscreen-btn .material-icons-round');
            if (icon) {
                icon.textContent = 'fullscreen';
            }
        });
        
        // Exit any expanded widget (Tarefas, Notas, RSS)
        const expandedWidgets = document.querySelectorAll('.widget.widget-fullscreen');
        expandedWidgets.forEach(widget => {
            widget.classList.remove('widget-fullscreen');
            const icons = widget.querySelectorAll('.material-icons-round');
            icons.forEach(icon => {
                if (icon.textContent === 'close_fullscreen') {
                    icon.textContent = 'open_in_full';
                }
            });
        });
    }
});

// Global Click Handler for exiting fullscreen
document.addEventListener('click', (e) => {
    // Check if we have any fullscreen widget (.widget-fullscreen is used by Tasks, Notes, RSS)
    const expandedWidget = document.querySelector('.widget.widget-fullscreen');
    
    // Check if we have any fullscreen widget (.fullscreen is used by Timer/Stopwatch)
    const fullscreenWidget = document.querySelector('.widget.fullscreen');
    
    if (expandedWidget || fullscreenWidget) {
        // If click is inside a modal, do nothing (allow interacting with modals)
        if (e.target.closest('.modal-overlay.active')) return;
        
        // If click is inside the fullscreen widget, do nothing
        const path = e.composedPath();
        if (expandedWidget && path.includes(expandedWidget)) return;
        if (fullscreenWidget && path.includes(fullscreenWidget)) return;
        
        // If click is on an expand button itself, do nothing
        if (e.target.closest('[id$="-expand-btn"]') || e.target.closest('.fullscreen-btn')) return;
        
        // Otherwise, close the widgets
        if (expandedWidget) {
            expandedWidget.classList.remove('widget-fullscreen');
            const icons = expandedWidget.querySelectorAll('.material-icons-round');
            icons.forEach(icon => {
                if (icon.textContent === 'close_fullscreen') {
                    icon.textContent = 'open_in_full';
                }
            });
        }
        
        if (fullscreenWidget) {
            fullscreenWidget.classList.remove('fullscreen');
            const icon = fullscreenWidget.querySelector('.fullscreen-btn .material-icons-round');
            if (icon) {
                icon.textContent = 'fullscreen';
            }
        }
    }
});
