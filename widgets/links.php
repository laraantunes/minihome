<!-- Links Widget -->
<div class="widget" id="links-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">link</span> Links</h2>
        <div class="links-controls notes-controls">
            <button id="links-add-btn" class="icon-btn" aria-label="Novo Link"><span class="material-icons-round">add</span></button>
        </div>
    </div>
    
    <div class="widget-content links-content" style="display: flex; flex-direction: column; overflow-y: auto; max-height: 250px;">
        <ul id="links-list-container" style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
            <!-- Links added via JS -->
        </ul>
        <div id="links-empty" style="text-align: center; color: var(--text-secondary); padding: 20px; display: none;">Nenhum link adicionado.</div>
    </div>
</div>

<!-- Link Modal -->
<div id="link-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 id="link-modal-title" style="font-size: 1.1rem;">Novo Link</h2>
        </div>
        <div class="form-group" style="margin-bottom: 10px;">
            <input type="text" id="link-modal-name" placeholder="Título do Link (ex: Google)">
        </div>
        <div class="form-group">
            <input type="url" id="link-modal-url" placeholder="URL (ex: https://google.com)">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 15px;">
            <button id="link-modal-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="link-modal-save" class="btn btn-primary">Salvar</button>
        </div>
    </div>
</div>

<!-- Link Delete Modal -->
<div id="link-del-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;">Excluir Link?</h2>
        </div>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);">Tem certeza que deseja excluir este link?</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="link-del-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="link-del-confirm" class="btn btn-primary" style="background-color: var(--danger-color);">Excluir</button>
        </div>
    </div>
</div>
