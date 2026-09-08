document.addEventListener('DOMContentLoaded', () => {
    const UI = {
        loading: document.getElementById('weather-loading'),
        error: document.getElementById('weather-error'),
        errorMsg: document.getElementById('weather-error-msg'),
        display: document.getElementById('weather-display'),
        form: document.getElementById('weather-form'),
        citiesList: document.getElementById('weather-cities-list'),
        tempVal: document.getElementById('weather-temp-val'),
        descVal: document.getElementById('weather-desc-val'),
        iconVal: document.getElementById('weather-icon-val'),
        cityVal: document.getElementById('weather-city-val'),
        maxVal: document.getElementById('weather-max-val'),
        minVal: document.getElementById('weather-min-val'),
        locationBtn: document.getElementById('weather-location-btn'),
        retryBtn: document.getElementById('weather-retry-btn'),
        cityInput: document.getElementById('weather-city-input'),
        searchBtn: document.getElementById('weather-search-btn'),
        cancelBtn: document.getElementById('weather-cancel-btn'),
        geoBtn: document.getElementById('weather-geo-btn')
    };

    let locations = App.loadData('weather_locs', []);
    let lastWeatherResults = [];
    const forecastModal = document.getElementById('weather-forecast-modal');
    const forecastModalClose = document.getElementById('forecast-modal-close');
    const forecastModalBody = document.getElementById('forecast-modal-body');
    const forecastModalTitle = document.getElementById('forecast-modal-title');

    function showState(state) {
        UI.loading.classList.add('hidden');
        UI.error.classList.add('hidden');
        UI.display.classList.add('hidden');
        UI.form.classList.add('hidden');
        
        if (state === 'display') {
            UI.display.classList.remove('hidden');
        } else if (state === 'loading') {
            UI.loading.classList.remove('hidden');
        } else if (state === 'error') {
            UI.error.classList.remove('hidden');
        } else if (state === 'form') {
            if (locations.length > 0) UI.display.classList.remove('hidden');
            UI.form.classList.remove('hidden');
        }
    }

    function getWeatherIcon(code) {
        if (code <= 1) return 'light_mode';
        if (code === 2) return 'partly_cloudy_day';
        if (code === 3) return 'cloud';
        if (code === 45 || code === 48) return 'foggy';
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
        if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'ac_unit';
        if (code >= 95) return 'thunderstorm';
        return 'cloud';
    }

    const weatherCodes = {
        0: 'Limpo', 1: 'Limpo', 2: 'Parc. Nublado', 3: 'Nublado',
        45: 'Nevoeiro', 48: 'Nevoeiro', 
        51: 'Chuvisco', 53: 'Chuvisco', 55: 'Chuvisco',
        56: 'Chuvisco Cong.', 57: 'Chuvisco Cong.',
        61: 'Chuva Leve', 63: 'Chuva Mod.', 65: 'Chuva Forte',
        66: 'Chuva Cong.', 67: 'Chuva Cong.',
        71: 'Neve', 73: 'Neve', 75: 'Neve', 77: 'Neve',
        80: 'Pancadas', 81: 'Pancadas', 82: 'Pancadas Fortes',
        85: 'Nevasca', 86: 'Nevasca Forte',
        95: 'Trovoada', 96: 'Trovoada/Granizo', 99: 'Trovoada/Granizo'
    };

    async function fetchWeatherData(lat, lon) {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=10`);
        if (!response.ok) throw new Error('Falha na API de clima');
        return await response.json();
    }

    async function refreshAllWeather() {
        if (locations.length === 0) {
            getGeoLocation(true);
            return;
        }

        showState('loading');
        try {
            const promises = locations.map(loc => fetchWeatherData(loc.lat, loc.lon));
            const results = await Promise.all(promises);
            lastWeatherResults = results;

            // Render primary (index 0)
            const mainWeather = results[0].current_weather;
            const mainDaily = results[0].daily;
            UI.tempVal.textContent = Math.round(mainWeather.temperature);
            UI.descVal.textContent = weatherCodes[mainWeather.weathercode] || 'Desc.';
            if (UI.iconVal) UI.iconVal.textContent = getWeatherIcon(mainWeather.weathercode);
            UI.cityVal.textContent = locations[0].name;
            UI.maxVal.textContent = Math.round(mainDaily.temperature_2m_max[0]);
            UI.minVal.textContent = Math.round(mainDaily.temperature_2m_min[0]);

            // Render extra cities
            UI.citiesList.innerHTML = '';
            for (let i = 1; i < results.length; i++) {
                const weather = results[i].current_weather;
                const daily = results[i].daily;
                const temp = Math.round(weather.temperature);
                const max = Math.round(daily.temperature_2m_max[0]);
                const min = Math.round(daily.temperature_2m_min[0]);
                const desc = weatherCodes[weather.weathercode] || 'Desc.';
                
                const div = document.createElement('div');
                div.className = 'weather-list-item';
                div.innerHTML = `
                    <div class="weather-list-info">
                        <span class="weather-list-name">${locations[i].name}</span>
                        <span class="weather-list-desc" style="display: flex; align-items: center; gap: 4px;">
                            <span class="material-icons-round" style="font-size: 0.9rem;">${getWeatherIcon(weather.weathercode)}</span> 
                            ${desc} • ${max}°/${min}°
                        </span>
                    </div>
                    <span class="weather-list-temp" style="margin-left: auto; margin-right: 10px;">${temp}°C</span>
                    <div style="display: flex;">
                        <button class="icon-btn weather-forecast-btn" data-index="${i}" title="Previsão 10 dias"><span class="material-icons-round" style="font-size:1rem;">calendar_month</span></button>
                        <button class="icon-btn weather-remove" data-index="${i}" title="Remover"><span class="material-icons-round" style="font-size:1rem;">delete</span></button>
                    </div>
                `;
                UI.citiesList.appendChild(div);
            }

            // Attach remove events
            document.querySelectorAll('.weather-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    locations.splice(idx, 1);
                    App.saveData('weather_locs', locations);
                    refreshAllWeather();
                });
            });

            document.querySelectorAll('.weather-forecast-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                    openForecastModal(idx);
                });
            });

            showState('display');
        } catch (err) {
            UI.errorMsg.textContent = 'Erro ao atualizar clima.';
            showState('error');
        }
    }

    async function searchCity(city) {
        showState('loading');
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                addLocation(result.latitude, result.longitude, result.name);
            } else {
                throw new Error('Cidade não encontrada.');
            }
        } catch (err) {
            UI.errorMsg.textContent = err.message || 'Erro na busca.';
            showState('error');
        }
    }

    function getDayOfWeek(dateString) {
        const date = new Date(dateString + 'T12:00:00');
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days[date.getDay()];
    }

    function formatDate(dateString) {
        const parts = dateString.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
        return dateString;
    }

    function openForecastModal(index) {
        if (!lastWeatherResults[index]) return;
        
        const loc = locations[index];
        const data = lastWeatherResults[index];
        const daily = data.daily;
        
        forecastModalTitle.innerHTML = `<span class="material-icons-round">calendar_month</span> ${loc.name} - 10 Dias`;
        forecastModalBody.innerHTML = '';
        
        for (let i = 0; i < daily.time.length; i++) {
            const date = daily.time[i];
            const max = Math.round(daily.temperature_2m_max[i]);
            const min = Math.round(daily.temperature_2m_min[i]);
            const code = daily.weathercode[i];
            const desc = weatherCodes[code] || 'Desc.';
            
            const isToday = i === 0;
            const dayLabel = isToday ? 'Hoje' : getDayOfWeek(date);
            
            const item = document.createElement('div');
            item.className = 'weather-list-item';
            item.innerHTML = `
                <div style="display: flex; flex-direction: column; width: 60px;">
                    <span style="font-weight: 600; font-size: 0.95rem;">${dayLabel}</span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${formatDate(date)}</span>
                </div>
                <div style="flex: 1; padding-left: 10px; display: flex; align-items: center; gap: 8px; overflow: hidden;">
                    <span class="material-icons-round" style="font-size: 1.2rem; color: var(--text-secondary); flex-shrink: 0;">${getWeatherIcon(code)}</span>
                    <span style="font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${desc}</span>
                </div>
                <div style="display: flex; gap: 10px; font-weight: 500; font-size: 0.95rem; white-space: nowrap;">
                    <span style="color: var(--text-secondary);">${min}°</span>
                    <span>${max}°</span>
                </div>
            `;
            forecastModalBody.appendChild(item);
        }
        
        forecastModal.classList.add('active');
    }

    if (forecastModalClose) {
        forecastModalClose.addEventListener('click', () => {
            forecastModal.classList.remove('active');
        });
    }
    
    if (forecastModal) {
        forecastModal.addEventListener('click', (e) => {
            if (e.target === forecastModal) {
                forecastModal.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && forecastModal && forecastModal.classList.contains('active')) {
            forecastModal.classList.remove('active');
        }
    });

    // Bind main forecast button if exists
    const mainForecastBtn = document.getElementById('main-forecast-btn');
    if (mainForecastBtn) {
        mainForecastBtn.addEventListener('click', () => openForecastModal(0));
    }

    function addLocation(lat, lon, name) {
        locations.push({ lat, lon, name });
        App.saveData('weather_locs', locations);
        refreshAllWeather();
    }

    function getGeoLocation(isFirstTime = false) {
        showState('loading');
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    if (isFirstTime) {
                        locations = [{ lat: position.coords.latitude, lon: position.coords.longitude, name: 'Localização Atual' }];
                        App.saveData('weather_locs', locations);
                        refreshAllWeather();
                    } else {
                        addLocation(position.coords.latitude, position.coords.longitude, 'Minha Localização');
                    }
                },
                err => {
                    if (isFirstTime) {
                        showState('form');
                    } else {
                        alert('Permissão de localização negada.');
                        showState('display');
                    }
                }
            );
        } else {
            if (isFirstTime) showState('form');
        }
    }

    UI.locationBtn.addEventListener('click', () => {
        showState('form');
    });

    UI.cancelBtn.addEventListener('click', () => {
        if (locations.length > 0) {
            showState('display');
        } else {
            alert('Adicione pelo menos uma cidade.');
        }
    });

    UI.retryBtn.addEventListener('click', () => {
        refreshAllWeather();
    });

    UI.searchBtn.addEventListener('click', () => {
        const val = UI.cityInput.value.trim();
        if (val) searchCity(val);
        UI.cityInput.value = '';
    });

    UI.geoBtn.addEventListener('click', () => {
        getGeoLocation(locations.length === 0);
    });
    
    UI.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') UI.searchBtn.click();
    });

    refreshAllWeather();
});
