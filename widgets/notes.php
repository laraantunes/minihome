<!-- Notes Widget -->
<div class="widget" id="notes-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">edit_note</span> Notas Rápidas</h2>
        <div class="notes-controls">
            <button id="notes-add-tab" class="icon-btn" aria-label="Nova Aba"><span class="material-icons-round">add</span></button>
            <button id="notes-edit-tab" class="icon-btn" aria-label="Renomear Aba"><span class="material-icons-round">edit</span></button>
            <button id="notes-del-tab" class="icon-btn" aria-label="Excluir Aba" style="color: var(--danger-color);"><span class="material-icons-round">delete</span></button>
        </div>
    </div>
    
    <div class="widget-content notes-content">
        <div class="notes-tabs" id="notes-tabs">
            <!-- Tabs added via JS -->
        </div>
        
        <textarea id="notes-textarea" class="notes-textarea" placeholder="Comece a digitar..."></textarea>
    </div>
</div>

<!-- Notes Modal -->
<div id="notes-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 id="notes-modal-title" style="font-size: 1.1rem;">Nome da Aba</h2>
        </div>
        <div class="form-group">
            <input type="text" id="notes-modal-input" placeholder="Digite o nome...">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="notes-modal-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="notes-modal-save" class="btn btn-primary">Salvar</button>
        </div>
    </div>
</div>


<!-- Notes Delete Modal -->
<div id="notes-del-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;">Excluir Aba?</h2>
        </div>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);">Tem certeza que deseja excluir esta aba?</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="notes-del-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="notes-del-confirm" class="btn btn-primary" style="background-color: var(--danger-color);">Excluir</button>
        </div>
    </div>
</div>
