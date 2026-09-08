<!-- Settings Modal -->
<div id="settings-modal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2><span class="material-icons-round">settings</span> Configurações</h2>
            <button id="close-settings-btn" class="icon-btn"><span class="material-icons-round">close</span></button>
        </div>

        <div class="modal-body">
            <div class="form-group">
                <label for="theme-select">Tema da Aplicação</label>
                <select id="theme-select">
                    <option value="dark">Escuro</option>
                    <option value="light">Claro</option>
                </select>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <div class="form-group">
                <label>Backup e Restauração</label>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--spacing-md);">Exporte
                    todos os seus dados (notas, tarefas, configurações) para um arquivo JSON, ou importe um backup
                    anterior.</p>

                <div style="display: flex; gap: var(--spacing-sm);">
                    <button id="export-btn" class="btn btn-secondary">
                        <span class="material-icons-round">download</span> Exportar
                    </button>
                    <button id="import-btn" class="btn btn-primary">
                        <span class="material-icons-round">upload</span> Importar
                    </button>
                    <input type="file" id="import-file" accept=".json" class="hidden">
                </div>
            </div>
        </div>
    </div>
</div>