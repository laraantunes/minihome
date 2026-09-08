<!-- Weather Widget -->
<div class="widget" id="weather-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">cloud</span> Clima</h2>
        <button id="weather-location-btn" class="icon-btn" aria-label="Adicionar Localização">
            <span class="material-icons-round">add</span>
        </button>
    </div>
    
    <div class="widget-content weather-content">
        <div id="weather-loading" class="weather-state text-center">
            <span class="material-icons-round spinning" style="font-size: 2rem;">sync</span>
            <p>Carregando clima...</p>
        </div>
        
        <div id="weather-error" class="weather-state text-center hidden">
            <span class="material-icons-round" style="color: var(--danger-color); font-size: 2rem;">error</span>
            <p id="weather-error-msg">Não foi possível carregar.</p>
            <button id="weather-retry-btn" class="btn btn-secondary" style="margin-top: 10px;">Tentar Novamente</button>
        </div>

        <div id="weather-display" class="weather-state hidden">
            <!-- Main Location -->
            <div class="text-center" style="margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-md); position: relative; padding-right: 36px; padding-left: 36px;">
                <button id="main-forecast-btn" class="icon-btn weather-forecast-btn" data-index="0" title="Previsão 10 dias" style="position: absolute; right: -10px; top: -10px;">
                    <span class="material-icons-round">calendar_month</span>
                </button>
                <div class="weather-temp">
                    <span id="weather-temp-val">--</span>°C
                </div>
                <div class="weather-desc" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: var(--spacing-sm); flex-wrap: nowrap; white-space: nowrap;">
                    <span id="weather-icon-val" class="material-icons-round" style="font-size: 1.3rem; color: var(--accent-color);">cloud</span>
                    <span id="weather-desc-val">--</span>
                </div>
                <div class="weather-minmax" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--spacing-sm);">
                    Máx: <span id="weather-max-val">--</span>° / Mín: <span id="weather-min-val">--</span>°
                </div>
                <div class="weather-city" style="display: flex; align-items: center; justify-content: center; gap: 4px; color: var(--text-secondary); font-size: 0.9rem;">
                    <span class="material-icons-round" style="font-size: 1rem;">location_on</span>
                    <span id="weather-city-val">Localização Atual</span>
                </div>
            </div>
            
            <!-- Extra Cities List -->
            <div id="weather-cities-list" class="weather-cities-list">
                <!-- Injected via JS -->
            </div>
        </div>

        <!-- Add City Form -->
        <div id="weather-form" class="weather-form hidden">
            <label for="weather-city-input" style="font-size: 0.9rem; color: var(--text-secondary);">Adicionar cidade:</label>
            <div style="display: flex; gap: 8px; margin-top: 5px;">
                <input type="text" id="weather-city-input" placeholder="Ex: São Paulo">
                <button id="weather-search-btn" class="btn btn-primary"><span class="material-icons-round">search</span></button>
                <button id="weather-cancel-btn" class="btn btn-secondary"><span class="material-icons-round">close</span></button>
            </div>
            <button id="weather-geo-btn" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">
                <span class="material-icons-round">my_location</span> Adicionar minha localização
            </button>
        </div>
    </div>
    
</div>

<!-- Forecast Modal (Outside of widget to fix CSS stacking/transform issues) -->
<div id="weather-forecast-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 400px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="margin-bottom: var(--spacing-sm);">
            <h2 id="forecast-modal-title" style="font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                <span class="material-icons-round">calendar_month</span> Previsão 10 dias
            </h2>
            <button id="forecast-modal-close" class="icon-btn"><span class="material-icons-round">close</span></button>
        </div>
        <div id="forecast-modal-body" style="overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 8px;">
            <!-- Injected via JS -->
        </div>
    </div>
</div>
