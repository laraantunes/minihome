document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('notes-tabs');
    const textarea = document.getElementById('notes-textarea');
    const addBtn = document.getElementById('notes-add-tab');
    const editBtn = document.getElementById('notes-edit-tab');
    const delBtn = document.getElementById('notes-del-tab');
    const expandBtn = document.getElementById('notes-expand-btn');
    
    const modal = document.getElementById('notes-modal');
    const modalTitle = document.getElementById('notes-modal-title');
    const modalInput = document.getElementById('notes-modal-input');
    const modalSave = document.getElementById('notes-modal-save');
    const modalCancel = document.getElementById('notes-modal-cancel');
    const delModal = document.getElementById('notes-del-modal');
    const delModalConfirm = document.getElementById('notes-del-confirm');
    const delModalCancel = document.getElementById('notes-del-cancel');

    let notes = App.loadData('notes', [{ id: Date.now(), title: 'Geral', content: '' }]);
    let activeId = notes[0]?.id;
    let modalMode = 'add'; // 'add' or 'edit'
    
    let isDraggingNote = false;
    let dragStartIdxNote;

    function saveNotes() {
        App.saveData('notes', notes);
    }

    function renderTabs() {
        tabsContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const btn = document.createElement('button');
            btn.className = `note-tab ${note.id === activeId ? 'active' : ''}`;
            btn.textContent = note.title;
            
            // Drag and Drop
            btn.setAttribute('draggable', 'true');
            btn.setAttribute('data-index', index);
            
            btn.addEventListener('dragstart', (e) => {
                isDraggingNote = true;
                dragStartIdxNote = +e.currentTarget.getAttribute('data-index');
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
                isDraggingNote = false;
                e.currentTarget.style.opacity = '1';
                
                const dragEndIndex = +e.currentTarget.getAttribute('data-index');
                if (dragStartIdxNote !== dragEndIndex && dragStartIdxNote !== undefined) {
                    const item = notes.splice(dragStartIdxNote, 1)[0];
                    notes.splice(dragEndIndex, 0, item);
                    saveNotes();
                    renderTabs();
                }
                return false;
            });
            
            btn.addEventListener('dragend', (e) => {
                isDraggingNote = false;
                e.currentTarget.style.opacity = '1';
            });

            btn.addEventListener('click', () => {
                if (isDraggingNote) return; // Prevent click on drag
                activeId = note.id;
                renderTabs();
                renderContent();
            });
            tabsContainer.appendChild(btn);
        });
        
        delBtn.style.display = notes.length > 1 ? 'flex' : 'none';
    }

    function renderContent() {
        const activeNote = notes.find(n => n.id === activeId);
        if (activeNote) {
            textarea.value = activeNote.content;
            textarea.disabled = false;
        } else {
            textarea.value = '';
            textarea.disabled = true;
        }
    }

    textarea.addEventListener('input', (e) => {
        const activeNote = notes.find(n => n.id === activeId);
        if (activeNote) {
            activeNote.content = e.target.value;
            saveNotes();
        }
    });

    // Modal logic
    function openModal(mode) {
        modalMode = mode;
        if (mode === 'add') {
            modalTitle.textContent = 'Nova Aba';
            modalInput.value = '';
        } else {
            modalTitle.textContent = 'Renomear Aba';
            const activeNote = notes.find(n => n.id === activeId);
            modalInput.value = activeNote ? activeNote.title : '';
        }
        modal.classList.add('active');
        modalInput.focus();
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    modalCancel.addEventListener('click', closeModal);
    
    modalSave.addEventListener('click', () => {
        const title = modalInput.value.trim();
        if (title) {
            if (modalMode === 'add') {
                const newId = Date.now();
                notes.push({ id: newId, title: title, content: '' });
                activeId = newId;
            } else if (modalMode === 'edit') {
                const activeNote = notes.find(n => n.id === activeId);
                if (activeNote) activeNote.title = title;
            }
            saveNotes();
            renderTabs();
            renderContent();
            textarea.focus();
            
            if (modalMode === 'add') {
                setTimeout(() => {
                    tabsContainer.scrollLeft = tabsContainer.scrollWidth;
                }, 50);
            }
            
            closeModal();
        }
    });

    modalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') modalSave.click();
    });

    // Buttons
    addBtn.addEventListener('click', () => openModal('add'));
    editBtn.addEventListener('click', () => openModal('edit'));
    
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            const widget = document.getElementById('notes-widget');
            if (widget) {
                widget.classList.toggle('widget-fullscreen');
                const icon = expandBtn.querySelector('.material-icons-round');
                if (widget.classList.contains('widget-fullscreen')) {
                    icon.textContent = 'close_fullscreen';
                } else {
                    icon.textContent = 'open_in_full';
                }
            }
        });
    }

    delBtn.addEventListener('click', () => {
        if (notes.length <= 1) return;
        delModal.classList.add('active');
    });
    
    delModalCancel.addEventListener('click', () => {
        delModal.classList.remove('active');
    });
    
    delModalConfirm.addEventListener('click', () => {
        notes = notes.filter(n => n.id !== activeId);
        activeId = notes[0].id;
        saveNotes();
        renderTabs();
        renderContent();
        delModal.classList.remove('active');
    });

    if (notes.length === 0) {
        notes.push({ id: Date.now(), title: 'Geral', content: '' });
        activeId = notes[0].id;
        saveNotes();
    }

    renderTabs();
    renderContent();

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
