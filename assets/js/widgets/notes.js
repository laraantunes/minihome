document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('notes-tabs');
    const textarea = document.getElementById('notes-textarea');
    const addBtn = document.getElementById('notes-add-tab');
    const editBtn = document.getElementById('notes-edit-tab');
    const delBtn = document.getElementById('notes-del-tab');
    const expandBtn = document.getElementById('notes-expand-btn');
    const exportBtn = document.getElementById('notes-export-btn');
    
    const modal = document.getElementById('notes-modal');
    const modalTitle = document.getElementById('notes-modal-title');
    const modalInput = document.getElementById('notes-modal-input');
    const modalSave = document.getElementById('notes-modal-save');
    const modalCancel = document.getElementById('notes-modal-cancel');
    const delModal = document.getElementById('notes-del-modal');
    const delModalConfirm = document.getElementById('notes-del-confirm');
    const delModalCancel = document.getElementById('notes-del-cancel');
    
    const exportModal = document.getElementById('notes-export-modal');
    const exportExtSelect = document.getElementById('notes-export-ext');
    const exportCustomGroup = document.getElementById('notes-export-custom-group');
    const exportCustomInput = document.getElementById('notes-export-custom-input');
    const exportCancel = document.getElementById('notes-export-cancel');
    const exportConfirm = document.getElementById('notes-export-confirm');

    let notes = App.loadData('notes', [{ id: Date.now(), title: App.i18n('general'), content: '' }]);
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
            modalTitle.textContent = App.i18n('new_tab');
            modalInput.value = '';
        } else {
            modalTitle.textContent = App.i18n('rename_tab');
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
        notes.push({ id: Date.now(), title: App.i18n('general'), content: '' });
        activeId = notes[0].id;
        saveNotes();
    }

    // Export Logic
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (notes.length === 0) return;
            const activeNote = notes.find(n => n.id === activeId);
            if (!activeNote || !activeNote.content.trim()) {
                App.showToast(App.i18n('start_typing') || 'Note is empty');
                // Allow exporting empty notes if needed, or maybe just proceed? Let's proceed anyway.
            }
            
            // Reset modal state
            exportExtSelect.value = 'txt';
            exportCustomGroup.style.display = 'none';
            exportCustomInput.value = '';
            
            exportModal.classList.add('active');
        });
    }

    if (exportExtSelect) {
        exportExtSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                exportCustomGroup.style.display = 'block';
                exportCustomInput.focus();
            } else {
                exportCustomGroup.style.display = 'none';
            }
        });
    }

    if (exportCancel) {
        exportCancel.addEventListener('click', () => {
            exportModal.classList.remove('active');
        });
    }

    if (exportConfirm) {
        exportConfirm.addEventListener('click', async () => {
            const activeNote = notes.find(n => n.id === activeId);
            if (!activeNote) return;

            let ext = exportExtSelect.value;
            if (ext === 'custom') {
                ext = exportCustomInput.value.trim().replace(/^\./, ''); // remove leading dot if any
                if (!ext) ext = 'txt';
            }

            // Sanitize filename
            const safeTitle = (activeNote.title || 'note').replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
            const fileName = `${safeTitle}.${ext}`;
            const fileContent = activeNote.content;

            if (window.File && navigator.canShare) {
                try {
                    const file = new File([fileContent], fileName, { type: 'text/plain' });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: activeNote.title,
                            text: activeNote.title
                        });
                        exportModal.classList.remove('active');
                        return;
                    }
                } catch (error) {
                    if (error.name === 'AbortError') return;
                }
            }

            // Fallback to download
            const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            exportModal.classList.remove('active');
        });
    }

    renderTabs();
    renderContent();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) closeModal();
            if (delModal.classList.contains('active')) delModal.classList.remove('active');
            if (exportModal && exportModal.classList.contains('active')) exportModal.classList.remove('active');
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    delModal.addEventListener('click', (e) => {
        if (e.target === delModal) delModal.classList.remove('active');
    });

    if (exportModal) {
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) exportModal.classList.remove('active');
        });
    }

});
