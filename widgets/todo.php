<!-- Todo Widget -->
<div class="widget" id="todo-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">check_circle</span> Tarefas</h2>
        <div class="todo-controls" style="display: flex; gap: 4px;">
            <button id="todo-export-csv" class="icon-btn" aria-label="Exportar CSV" title="Exportar para CSV"><span class="material-icons-round">download</span></button>
            <button id="todo-copy-md" class="icon-btn" aria-label="Copiar Markdown" title="Copiar como Markdown"><span class="material-icons-round">content_copy</span></button>
        </div>
    </div>
    
    <div class="widget-content todo-content">
        <div class="todo-form">
            <input type="text" id="todo-input" placeholder="Nova tarefa...">
            <button id="todo-add-btn" class="btn btn-primary"><span class="material-icons-round">add</span></button>
        </div>
        
        <div class="todo-list-container">
            <ul id="todo-list" class="todo-list">
                <!-- Tasks injected by JS -->
            </ul>
        </div>
    </div>
</div>
