<!-- RSS Widget -->
<div class="widget" id="rss-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">rss_feed</span> Notícias (RSS)</h2>
        <div class="rss-controls notes-controls">
            <button id="rss-reload-btn" class="icon-btn" aria-label="Recarregar"><span class="material-icons-round">refresh</span></button>
            <button id="rss-maximize-btn" class="icon-btn" aria-label="Maximizar"><span class="material-icons-round">open_in_full</span></button>
            <button id="rss-add-tab" class="icon-btn" aria-label="Nova Assinatura"><span class="material-icons-round">add</span></button>
            <button id="rss-edit-tab" class="icon-btn" aria-label="Editar Assinatura"><span class="material-icons-round">edit</span></button>
            <button id="rss-del-tab" class="icon-btn" aria-label="Excluir Assinatura" style="color: var(--danger-color);"><span class="material-icons-round">delete</span></button>
        </div>
    </div>
    
    <div class="widget-content rss-content" style="display: flex; flex-direction: column;">
        <div class="notes-tabs" id="rss-tabs">
            <!-- Tabs added via JS -->
        </div>
        
        <div id="rss-feed-container" class="rss-feed-container" style="overflow-y: auto; flex-grow: 1; padding-top: 10px; display: flex; flex-direction: column; gap: 10px;">
            <!-- Feed items added via JS -->
            <div id="rss-loading" style="text-align: center; color: var(--text-secondary); display: none; padding: 20px;">Carregando...</div>
            <div id="rss-error" style="text-align: center; color: var(--danger-color); display: none; padding: 20px;">Erro ao carregar o feed.</div>
        </div>
    </div>
</div>

<!-- RSS Modal -->
<div id="rss-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 id="rss-modal-title" style="font-size: 1.1rem;">Nova Assinatura RSS</h2>
        </div>
        <div class="form-group" style="margin-bottom: 10px;">
            <input type="text" id="rss-modal-name" placeholder="Nome do Feed (ex: Meu Feed)">
        </div>
        <div class="form-group">
            <input type="url" id="rss-modal-url" placeholder="URL do XML (ex: https://meufeed/rss)">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 15px;">
            <button id="rss-modal-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="rss-modal-save" class="btn btn-primary">Salvar</button>
        </div>
    </div>
</div>

<!-- RSS Delete Modal -->
<div id="rss-del-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 350px;">
        <div class="modal-header" style="margin-bottom: 15px;">
            <h2 style="font-size: 1.1rem;">Excluir Assinatura?</h2>
        </div>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-secondary);">Tem certeza que deseja excluir esta assinatura RSS?</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="rss-del-cancel" class="btn btn-secondary">Cancelar</button>
            <button id="rss-del-confirm" class="btn btn-primary" style="background-color: var(--danger-color);">Excluir</button>
        </div>
    </div>
</div>

<!-- RSS Maximize Modal -->
<div id="rss-maximize-modal" class="modal-overlay">
    <div class="modal-content" style="max-width: 600px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="margin-bottom: var(--spacing-sm);">
            <h2 id="rss-maximize-title" style="font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                <span class="material-icons-round">rss_feed</span> Feed
            </h2>
            <button id="rss-maximize-close" class="icon-btn"><span class="material-icons-round">close</span></button>
        </div>
        <div id="rss-maximize-body" style="overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 10px; flex-grow: 1;">
            <!-- Injected via JS -->
        </div>
    </div>
</div>
