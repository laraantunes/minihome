document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('miniplayer-input');
    const addBtn = document.getElementById('miniplayer-add-btn');
    const playlistEl = document.getElementById('miniplayer-playlist');
    const clearBtn = document.getElementById('miniplayer-clear-btn');
    const iframe = document.getElementById('miniplayer-iframe');
    const iframeContainer = document.getElementById('miniplayer-iframe-container');
    const emptyState = document.getElementById('miniplayer-empty-state');

    let playlist = App.loadData('miniplayer_playlist', []);
    let currentIndex = App.loadData('miniplayer_current', -1);

    function parseYouTubeUrl(url) {
        let videoId = null;
        let playlistId = null;

        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v');
                playlistId = urlObj.searchParams.get('list');
            } else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.substring(1);
                playlistId = urlObj.searchParams.get('list');
            }
        } catch (e) {
            // invalid URL
        }

        if (videoId || playlistId) {
            return { videoId, playlistId, original: url };
        }
        return null;
    }

    function generateEmbedUrl(data) {
        if (data.videoId) {
            let url = `https://www.youtube.com/embed/${data.videoId}`;
            if (data.playlistId) {
                url += `?list=${data.playlistId}`;
            }
            return url;
        } else if (data.playlistId) {
            return `https://www.youtube.com/embed/videoseries?list=${data.playlistId}`;
        }
        return '';
    }

    function renderPlaylist() {
        playlistEl.innerHTML = '';
        if (playlist.length === 0) {
            iframeContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            iframe.src = '';
            currentIndex = -1;
            App.saveData('miniplayer_current', -1);
            return;
        }

        playlist.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'miniplayer-item' + (index === currentIndex ? ' active' : '');
            
            let label = item.title || (item.videoId ? `Vídeo: ${item.videoId}` : `Playlist: ${item.playlistId}`);

            li.innerHTML = `
                <div class="miniplayer-item-info" style="flex: 1; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9rem;" title="${label}">
                    <span class="material-icons-round" style="font-size: 1rem; vertical-align: middle; margin-right: 4px;">${item.videoId ? 'play_arrow' : 'playlist_play'}</span>
                    ${label}
                </div>
                <button class="icon-btn miniplayer-remove" data-index="${index}" title="Remover" style="padding: 2px;">
                    <span class="material-icons-round" style="font-size: 1.1rem; color: var(--text-secondary);">close</span>
                </button>
            `;

            li.querySelector('.miniplayer-item-info').addEventListener('click', () => {
                playItem(index);
            });

            li.querySelector('.miniplayer-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                removeItem(index);
            });

            playlistEl.appendChild(li);
        });

        if (currentIndex >= 0 && currentIndex < playlist.length) {
            const expectedUrl = generateEmbedUrl(playlist[currentIndex]);
            if (iframe.src !== expectedUrl) {
                iframe.src = expectedUrl;
                emptyState.classList.add('hidden');
                iframeContainer.classList.remove('hidden');
            }
        } else if (playlist.length > 0) {
            playItem(0);
        }
    }

    function playItem(index) {
        if (index >= 0 && index < playlist.length) {
            currentIndex = index;
            App.saveData('miniplayer_current', currentIndex);
            
            iframe.src = generateEmbedUrl(playlist[index]);
            emptyState.classList.add('hidden');
            iframeContainer.classList.remove('hidden');
            
            renderPlaylist();
        }
    }

    function removeItem(index) {
        playlist.splice(index, 1);
        App.saveData('miniplayer_playlist', playlist);
        if (currentIndex === index) {
            currentIndex = -1;
        } else if (currentIndex > index) {
            currentIndex--;
        }
        App.saveData('miniplayer_current', currentIndex);
        renderPlaylist();
    }

    addBtn.addEventListener('click', async () => {
        const val = input.value.trim();
        if (!val) return;
        
        const parsed = parseYouTubeUrl(val);
        if (parsed) {
            // Attempt to fetch title
            addBtn.disabled = true;
            addBtn.innerHTML = '<span class="material-icons-round" style="animation: spin 1s linear infinite;">sync</span>';
            try {
                let fetchUrl = '';
                if (parsed.videoId) {
                    fetchUrl = `https://www.youtube.com/watch?v=${parsed.videoId}`;
                } else if (parsed.playlistId) {
                    fetchUrl = `https://www.youtube.com/playlist?list=${parsed.playlistId}`;
                }
                const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(fetchUrl)}&format=json`);
                if (response.ok) {
                    const data = await response.json();
                    parsed.title = data.title;
                }
            } catch (e) {
                console.error("Could not fetch title");
            }
            addBtn.disabled = false;
            addBtn.innerHTML = '<span class="material-icons-round">add</span>';

            playlist.push(parsed);
            App.saveData('miniplayer_playlist', playlist);
            input.value = '';
            
            if (currentIndex === -1) {
                playItem(playlist.length - 1);
            } else {
                renderPlaylist();
            }
        } else {
            alert('URL do YouTube inválida. Copie o link do vídeo ou playlist.');
        }
    });

    clearBtn.addEventListener('click', async () => {
        if (await App.confirm('Tem certeza que deseja limpar a lista de reprodução?')) {
            playlist = [];
            App.saveData('miniplayer_playlist', playlist);
            renderPlaylist();
        }
    });

    // Make playlist sortable
    if (typeof Sortable !== 'undefined') {
        new Sortable(playlistEl, {
            animation: 150,
            onEnd: function (evt) {
                if (evt.oldIndex === evt.newIndex) return;
                
                const item = playlist.splice(evt.oldIndex, 1)[0];
                playlist.splice(evt.newIndex, 0, item);
                
                if (currentIndex === evt.oldIndex) {
                    currentIndex = evt.newIndex;
                } else if (currentIndex > evt.oldIndex && currentIndex <= evt.newIndex) {
                    currentIndex--;
                } else if (currentIndex < evt.oldIndex && currentIndex >= evt.newIndex) {
                    currentIndex++;
                }
                
                App.saveData('miniplayer_playlist', playlist);
                App.saveData('miniplayer_current', currentIndex);
                renderPlaylist();
            }
        });
    }

    renderPlaylist();
});
