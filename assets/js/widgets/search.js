document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const engineSelect = document.getElementById('search-engine-select');

    // Load saved preference
    const savedEngine = App.loadData('search_engine', 'ddg');
    engineSelect.value = savedEngine;
    updateEngineAction(savedEngine);

    function updateEngineAction(engine) {
        if (engine === 'google') {
            form.action = 'https://www.google.com/search';
            input.name = 'q';
        } else if (engine === 'wikipedia') {
            form.action = 'https://pt.wikipedia.org/w/index.php';
            input.name = 'search';
        } else {
            form.action = 'https://duckduckgo.com/';
            input.name = 'q';
        }
    }

    engineSelect.addEventListener('change', (e) => {
        const engine = e.target.value;
        updateEngineAction(engine);
        App.saveData('search_engine', engine);
    });

    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        input.focus();
    });
});
