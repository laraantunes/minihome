document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('rss-tabs');
    const feedContainer = document.getElementById('rss-feed-container');
    const loadingEl = document.getElementById('rss-loading');
    const errorEl = document.getElementById('rss-error');
    
    const addBtn = document.getElementById('rss-add-tab');
    const editBtn = document.getElementById('rss-edit-tab');
    const delBtn = document.getElementById('rss-del-tab');
    const maximizeBtn = document.getElementById('rss-maximize-btn');
    const reloadBtn = document.getElementById('rss-reload-btn');
    
    const modal = document.getElementById('rss-modal');
    const modalTitle = document.getElementById('rss-modal-title');
    const modalName = document.getElementById('rss-modal-name');
    const modalUrl = document.getElementById('rss-modal-url');
    const modalSave = document.getElementById('rss-modal-save');
    const modalCancel = document.getElementById('rss-modal-cancel');
    
    const delModal = document.getElementById('rss-del-modal');
    const delModalConfirm = document.getElementById('rss-del-confirm');
    const delModalCancel = document.getElementById('rss-del-cancel');
    
    const maxModal = document.getElementById('rss-maximize-modal');
    const maxModalClose = document.getElementById('rss-maximize-close');
    const maxModalBody = document.getElementById('rss-maximize-body');

    let feeds = App.loadData('rss_feeds', []);
    let activeId = feeds.length > 0 ? feeds[0].id : null;
    let modalMode = 'add'; // 'add' or 'edit'

    function saveFeeds() {
        App.saveData('rss_feeds', feeds);
    }

    function renderTabs() {
        tabsContainer.innerHTML = '';
        feeds.forEach(feed => {
            const btn = document.createElement('button');
            btn.className = `note-tab ${feed.id === activeId ? 'active' : ''}`;
            btn.textContent = feed.title;
            btn.addEventListener('click', () => {
                activeId = feed.id;
                renderTabs();
                loadFeed();
            });
            tabsContainer.appendChild(btn);
        });
        
        delBtn.style.display = feeds.length > 0 ? 'flex' : 'none';
        editBtn.style.display = feeds.length > 0 ? 'flex' : 'none';
        maximizeBtn.style.display = feeds.length > 0 ? 'flex' : 'none';
    }

    async function loadFeed() {
        const activeFeed = feeds.find(f => f.id === activeId);
        if (!activeFeed) {
            feedContainer.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">Nenhuma assinatura. Adicione uma no botão +</div>';
            return;
        }

        // Keep loading elements inside container, but clear items
        Array.from(feedContainer.children).forEach(child => {
            if (child !== loadingEl && child !== errorEl) {
                child.remove();
            }
        });

        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';

        try {
            const response = await fetch(`widgets/rss_proxy.php?url=${encodeURIComponent(activeFeed.url)}`);
            if (!response.ok) throw new Error('Failed to fetch feed');
            
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            const items = xmlDoc.querySelectorAll('item');
            loadingEl.style.display = 'none';
            
            if (items.length === 0) {
                throw new Error('No items found');
            }

            Array.from(items).slice(0, 15).forEach(item => {
                const title = item.querySelector('title')?.textContent || 'Sem título';
                const link = item.querySelector('link')?.textContent || '#';
                const description = item.querySelector('description')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                
                // Try to find image (media:content, enclosure, or inside description)
                let imgUrl = '';
                const mediaContent = item.getElementsByTagName('media:content')[0] || item.getElementsByTagNameNS('*', 'content')[0];
                const enclosure = item.querySelector('enclosure[type^="image"]');
                
                if (mediaContent && mediaContent.getAttribute('url')) {
                    imgUrl = mediaContent.getAttribute('url');
                } else if (enclosure) {
                    imgUrl = enclosure.getAttribute('url');
                } else {
                    // Try to parse img tag from description
                    const div = document.createElement('div');
                    div.innerHTML = description;
                    const img = div.querySelector('img');
                    if (img) imgUrl = img.src;
                }

                // Clean description HTML
                const cleanDesc = description.replace(/<[^>]*>?/gm, '').trim();
                
                // Format date
                const dateObj = new Date(pubDate);
                const dateStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.className = 'rss-item';
                
                let imgHtml = imgUrl ? `<img src="${imgUrl}" alt="${title}" class="rss-item-img" onerror="this.style.display='none'">` : '';
                
                a.innerHTML = `
                    ${imgHtml}
                    <div class="rss-item-content">
                        <div class="rss-item-title">${title}</div>
                        ${dateStr ? `<div class="rss-item-date">${dateStr}</div>` : ''}
                        ${cleanDesc ? `<div class="rss-item-desc">${cleanDesc}</div>` : ''}
                    </div>
                `;
                
                feedContainer.appendChild(a);
            });
            
        } catch (error) {
            console.error('RSS Error:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
        }
    }

    // Modal logic
    function openModal(mode) {
        modalMode = mode;
        if (mode === 'add') {
            modalTitle.textContent = 'Nova Assinatura';
            modalName.value = '';
            modalUrl.value = '';
        } else {
            modalTitle.textContent = 'Editar Assinatura';
            const activeFeed = feeds.find(f => f.id === activeId);
            modalName.value = activeFeed ? activeFeed.title : '';
            modalUrl.value = activeFeed ? activeFeed.url : '';
        }
        modal.classList.add('active');
        modalName.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    modalCancel.addEventListener('click', closeModal);
    
    modalSave.addEventListener('click', () => {
        const title = modalName.value.trim();
        const url = modalUrl.value.trim();
        
        if (title && url) {
            if (modalMode === 'add') {
                const newId = Date.now();
                feeds.push({ id: newId, title: title, url: url });
                activeId = newId;
            } else if (modalMode === 'edit') {
                const activeFeed = feeds.find(f => f.id === activeId);
                if (activeFeed) {
                    activeFeed.title = title;
                    activeFeed.url = url;
                }
            }
            saveFeeds();
            renderTabs();
            loadFeed();
            closeModal();
        }
    });

    // Buttons
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            if (feeds.length > 0) loadFeed();
        });
    }

    addBtn.addEventListener('click', () => openModal('add'));
    
    editBtn.addEventListener('click', () => {
        if (feeds.length > 0) openModal('edit');
    });

    delBtn.addEventListener('click', () => {
        if (feeds.length === 0) return;
        delModal.classList.add('active');
    });
    
    delModalCancel.addEventListener('click', () => {
        delModal.classList.remove('active');
    });
    
    delModalConfirm.addEventListener('click', () => {
        feeds = feeds.filter(f => f.id !== activeId);
        activeId = feeds.length > 0 ? feeds[0].id : null;
        saveFeeds();
        renderTabs();
        loadFeed();
        delModal.classList.remove('active');
    });
    
    maximizeBtn.addEventListener('click', () => {
        if (feeds.length === 0) return;
        const activeFeed = feeds.find(f => f.id === activeId);
        document.getElementById('rss-maximize-title').innerHTML = `<span class="material-icons-round">rss_feed</span> ${activeFeed.title}`;
        
        // Clone the content of the feed container (excluding loading and error els)
        maxModalBody.innerHTML = '';
        Array.from(feedContainer.children).forEach(child => {
            if (child !== loadingEl && child !== errorEl && child.tagName === 'A') {
                maxModalBody.appendChild(child.cloneNode(true));
            }
        });
        
        maxModal.classList.add('active');
    });
    
    maxModalClose.addEventListener('click', () => {
        maxModal.classList.remove('active');
    });

    renderTabs();
    loadFeed();

    // Escape and outside click handlers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) closeModal();
            if (delModal.classList.contains('active')) delModal.classList.remove('active');
            if (maxModal.classList.contains('active')) maxModal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    delModal.addEventListener('click', (e) => {
        if (e.target === delModal) delModal.classList.remove('active');
    });
    
    maxModal.addEventListener('click', (e) => {
        if (e.target === maxModal) maxModal.classList.remove('active');
    });
});
