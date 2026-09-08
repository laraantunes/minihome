document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('notes-tabs');
    const textarea = document.getElementById('notes-textarea');
    const addBtn = document.getElementById('notes-add-tab');
    const editBtn = document.getElementById('notes-edit-tab');
    const delBtn = document.getElementById('notes-del-tab');
    
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

    function saveNotes() {
        App.saveData('notes', notes);
    }

    function renderTabs() {
        tabsContainer.innerHTML = '';
        notes.forEach(note => {
            const btn = document.createElement('button');
            btn.className = `note-tab ${note.id === activeId ? 'active' : ''}`;
            btn.textContent = note.title;
            btn.addEventListener('click', () => {
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
            closeModal();
        }
    });

    modalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') modalSave.click();
    });

    // Buttons
    addBtn.addEventListener('click', () => openModal('add'));
    editBtn.addEventListener('click', () => openModal('edit'));

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
