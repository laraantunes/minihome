document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('links-list-container');
    const emptyMsg = document.getElementById('links-empty');
    
    const addBtn = document.getElementById('links-add-btn');
    
    const modal = document.getElementById('link-modal');
    const modalTitle = document.getElementById('link-modal-title');
    const modalName = document.getElementById('link-modal-name');
    const modalUrl = document.getElementById('link-modal-url');
    const modalSave = document.getElementById('link-modal-save');
    const modalCancel = document.getElementById('link-modal-cancel');
    
    const delModal = document.getElementById('link-del-modal');
    const delModalConfirm = document.getElementById('link-del-confirm');
    const delModalCancel = document.getElementById('link-del-cancel');
    
    let links = App.loadData('links', []);
    let activeId = null;
    let modalMode = 'add'; // 'add' or 'edit'

    function saveLinks() {
        App.saveData('links', links);
    }

    function renderLinks() {
        listContainer.innerHTML = '';
        
        if (links.length === 0) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
            links.forEach(link => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'space-between';
                li.style.padding = '8px 12px';
                li.style.backgroundColor = 'rgba(0,0,0,0.02)';
                li.style.borderRadius = 'var(--border-radius-sm)';
                
                // For dark mode
                if(document.body.classList.contains('theme-dark')) {
                    li.style.backgroundColor = 'rgba(255,255,255,0.02)';
                }
                
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.textContent = link.title;
                a.style.color = 'var(--accent-color)';
                a.style.textDecoration = 'none';
                a.style.fontWeight = '500';
                a.style.flex = '1';
                
                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.gap = '4px';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'icon-btn';
                editBtn.innerHTML = '<span class="material-icons-round" style="font-size:18px">edit</span>';
                editBtn.style.padding = '4px';
                editBtn.onclick = () => openModal('edit', link.id);
                
                const delBtn = document.createElement('button');
                delBtn.className = 'icon-btn';
                delBtn.innerHTML = '<span class="material-icons-round" style="font-size:18px">delete</span>';
                delBtn.style.padding = '4px';
                delBtn.style.color = 'var(--danger-color)';
                delBtn.onclick = () => {
                    activeId = link.id;
                    delModal.classList.add('active');
                };
                
                controls.appendChild(editBtn);
                controls.appendChild(delBtn);
                
                li.appendChild(a);
                li.appendChild(controls);
                listContainer.appendChild(li);
            });
        }
    }

    function openModal(mode, id = null) {
        modalMode = mode;
        activeId = id;
        
        if (mode === 'add') {
            modalTitle.textContent = 'Novo Link';
            modalName.value = '';
            modalUrl.value = '';
        } else {
            modalTitle.textContent = 'Editar Link';
            const link = links.find(l => l.id === id);
            modalName.value = link ? link.title : '';
            modalUrl.value = link ? link.url : '';
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
                links.push({ id: newId, title: title, url: url });
            } else if (modalMode === 'edit') {
                const link = links.find(l => l.id === activeId);
                if (link) {
                    link.title = title;
                    link.url = url;
                }
            }
            saveLinks();
            renderLinks();
            closeModal();
        }
    });

    addBtn.addEventListener('click', () => openModal('add'));
    
    delModalCancel.addEventListener('click', () => {
        delModal.classList.remove('active');
    });
    
    delModalConfirm.addEventListener('click', () => {
        links = links.filter(l => l.id !== activeId);
        saveLinks();
        renderLinks();
        delModal.classList.remove('active');
    });
    
    // Watch for theme changes to update li background dynamically if needed
    // The CSS would ideally handle this, but since it's inline we just re-render
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                renderLinks();
            }
        });
    });
    observer.observe(document.body, { attributes: true });

    renderLinks();
});
