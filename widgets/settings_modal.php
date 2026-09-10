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

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <div class="form-group">
                <label>Atualização do Sistema</label>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: var(--spacing-md);">Baixa a última versão do GitHub e atualiza os arquivos do sistema automaticamente (não afeta seus dados).</p>
                <button id="update-btn" class="btn btn-secondary" style="width: 100%;">
                    <span class="material-icons-round">system_update_alt</span> Verificar e Atualizar
                </button>
                <div id="update-message" style="margin-top: 10px; font-size: 0.85rem; text-align: center;"></div>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: var(--spacing-lg) 0;">

            <?php
            include_once __DIR__ . '/../version.php';
            ?>
            <div class="form-group" style="text-align: center;">
                <img src="assets/icon-192.png" alt="Minihome Logo" style="width: 64px; height: 64px; border-radius: 16px; margin-bottom: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <label style="display: block; margin-bottom: 0;">Sobre o Minihome</label>
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 8px;">
                    <p style="margin-bottom: 8px;">Versão: <strong><?= $version ?? 'Desconhecida' ?></strong></p>
                    <p style="margin-bottom: 8px;">
                        <a href="https://github.com/laraantunes/minihome" target="_blank" style="color: var(--accent-color); text-decoration: none;">GitHub</a> &bull; 
                        Desenvolvido com 💜 por <a href="https://laralabs.dev" target="_blank" style="color: var(--accent-color); text-decoration: none;">laralabs.dev</a>
                    </p>
                    <p style="margin-bottom: 4px;"><strong>Serviços Utilizados:</strong></p>
                    <ul style="list-style-type: disc; list-style-position: inside; padding-left: 0; margin-left: 0;">
                        <li><a href="https://open-meteo.com/" target="_blank" style="color: var(--text-secondary); text-decoration: underline;">Open-Meteo API</a></li>
                        <li><a href="https://freesound.org/" target="_blank" style="color: var(--text-secondary); text-decoration: underline;">Freesound</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>