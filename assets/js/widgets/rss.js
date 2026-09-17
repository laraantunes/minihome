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
    

    let feeds = App.loadData('rss_feeds', []);
    let activeId = feeds.length > 0 ? feeds[0].id : null;
    let modalMode = 'add'; // 'add' or 'edit'
    
    let isDraggingRss = false;
    let dragStartIdxRss;

    function saveFeeds() {
        App.saveData('rss_feeds', feeds);
    }

    function renderTabs() {
        tabsContainer.innerHTML = '';
        feeds.forEach((feed, index) => {
            const btn = document.createElement('button');
            btn.className = `note-tab ${feed.id === activeId ? 'active' : ''}`;
            btn.textContent = feed.title;
            
            // Drag and Drop
            btn.setAttribute('draggable', 'true');
            btn.setAttribute('data-index', index);
            
            btn.addEventListener('dragstart', (e) => {
                isDraggingRss = true;
                dragStartIdxRss = +e.currentTarget.getAttribute('data-index');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            btn.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                return false;
            });
            
            btn.addEventListener('dragenter', (e) => {
                e.currentTarget.style.opacity = '0.5';
            });
            
            btn.addEventListener('dragleave', (e) => {
                e.currentTarget.style.opacity = '1';
            });
            
            btn.addEventListener('drop', (e) => {
                e.stopPropagation();
                isDraggingRss = false;
                e.currentTarget.style.opacity = '1';
                
                const dragEndIndex = +e.currentTarget.getAttribute('data-index');
                if (dragStartIdxRss !== dragEndIndex && dragStartIdxRss !== undefined) {
                    const item = feeds.splice(dragStartIdxRss, 1)[0];
                    feeds.splice(dragEndIndex, 0, item);
                    saveFeeds();
                    renderTabs();
                }
                return false;
            });
            
            btn.addEventListener('dragend', (e) => {
                isDraggingRss = false;
                e.currentTarget.style.opacity = '1';
            });

            btn.addEventListener('click', () => {
                if (isDraggingRss) return; // Prevent click on drag
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
            modalTitle.textContent = App.i18n('new_subscription');
            modalName.value = '';
            modalUrl.value = '';
        } else {
            modalTitle.textContent = App.i18n('edit_subscription');
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
        const widget = document.getElementById('rss-widget');
        if (widget) {
            widget.classList.toggle('widget-fullscreen');
            const icon = maximizeBtn.querySelector('.material-icons-round');
            if (widget.classList.contains('widget-fullscreen')) {
                icon.textContent = 'close_fullscreen';
            } else {
                icon.textContent = 'open_in_full';
            }
        }
    });

    renderTabs();
    loadFeed();

    // Escape and outside click handlers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) closeModal();
            if (delModal.classList.contains('active')) delModal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    delModal.addEventListener('click', (e) => {
        if (e.target === delModal) delModal.classList.remove('active');
    });

});
