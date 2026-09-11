document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const list = document.getElementById('todo-list');

    let todos = App.loadData('todos', []);

    let dragStartIndex;

    function handleDragStart(e) {
        dragStartIndex = +e.currentTarget.getAttribute('data-index');
        e.dataTransfer.effectAllowed = 'move';
        // Opcional: e.currentTarget.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
        e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
        
        const dragEndIndex = +e.currentTarget.getAttribute('data-index');
        
        if (dragStartIndex !== dragEndIndex && dragStartIndex !== undefined) {
            const item = todos.splice(dragStartIndex, 1)[0];
            todos.splice(dragEndIndex, 0, item);
            App.saveData('todos', todos);
            renderTodos();
        }
        return false;
    }

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.done) li.classList.add('done');
            
            li.setAttribute('draggable', 'true');
            li.setAttribute('data-index', index);
            
            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('drop', handleDrop);
            li.addEventListener('dragenter', handleDragEnter);
            li.addEventListener('dragleave', handleDragLeave);

            li.innerHTML = `
                <span class="material-icons-round drag-handle" title="Mover tarefa" style="cursor: grab; color: var(--text-muted); font-size: 1.1rem; margin-right: 4px;">drag_indicator</span>
                <label class="todo-item-label" style="flex: 1; display: flex; align-items: center; min-width: 0;">
                    <input type="checkbox" class="todo-check" data-index="${index}" ${todo.done ? 'checked' : ''}>
                    <span class="todo-text" spellcheck="false" data-index="${index}" style="outline: none; flex: 1; padding: 2px 4px; border-radius: 4px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${todo.text}</span>
                </label>
                <div style="display: flex; gap: 4px;">
                    <button class="icon-btn todo-edit" data-index="${index}" title="Editar"><span class="material-icons-round" style="font-size: 1.1rem;">edit</span></button>
                    <button class="icon-btn todo-delete" data-index="${index}" title="Excluir"><span class="material-icons-round" style="font-size: 1.1rem;">delete</span></button>
                </div>
            `;
            list.appendChild(li);
        });

        // Checkbox events
        document.querySelectorAll('.todo-check').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const idx = e.target.getAttribute('data-index');
                todos[idx].done = e.target.checked;
                App.saveData('todos', todos);
                renderTodos();
            });
        });

        // Edit button events
        document.querySelectorAll('.todo-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = e.currentTarget.getAttribute('data-index');
                const span = document.querySelector(`.todo-text[data-index="${idx}"]`);
                
                span.setAttribute('contenteditable', 'true');
                span.style.whiteSpace = 'normal';
                span.style.textOverflow = 'clip';
                span.style.overflow = 'visible';
                span.focus();
                
                // Move cursor to end
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(span);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        });

        // Edit events (for the span)
        document.querySelectorAll('.todo-text').forEach(span => {
            span.addEventListener('click', (e) => {
                if (span.getAttribute('contenteditable') === 'true') {
                    e.preventDefault(); // Prevent label click
                }
            });
            span.addEventListener('blur', (e) => {
                span.removeAttribute('contenteditable');
                const idx = e.target.getAttribute('data-index');
                const newText = e.target.innerText.trim();
                
                // Restaura o visual truncado
                e.target.style.whiteSpace = 'nowrap';
                e.target.style.textOverflow = 'ellipsis';
                e.target.style.overflow = 'hidden';

                if (newText !== todos[idx].text) {
                    if (newText === '') {
                        todos.splice(idx, 1);
                    } else {
                        todos[idx].text = newText;
                    }
                    App.saveData('todos', todos);
                    renderTodos();
                }
            });
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                }
            });
        });

        // Delete events
        document.querySelectorAll('.todo-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                todos.splice(idx, 1);
                App.saveData('todos', todos);
                renderTodos();
            });
        });
    }

    function addTodo() {
        const text = input.value.trim();
        if (text) {
            todos.push({ text, done: false });
            App.saveData('todos', todos);
            input.value = '';
            renderTodos();
        }
    }

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // --- Export CSV Logic ---
    const exportCsvBtn = document.getElementById('todo-export-csv');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async () => {
            if (todos.length === 0) {
                App.showToast('Nenhuma tarefa para exportar.');
                return;
            }
            
            let csvContent = 'Status,Tarefa\n';
            todos.forEach(todo => {
                const status = todo.done ? 'Concluída' : 'Pendente';
                let text = todo.text.replace(/"/g, '""');
                if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                    text = `"${text}"`;
                }
                csvContent += `${status},${text}\n`;
            });
            
            const fileName = 'tarefas.csv';
            
            // Only try Web Share if File API and Share API are available and we can share a file
            if (window.File && navigator.canShare) {
                try {
                    const file = new File([csvContent], fileName, { type: 'text/csv' });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: 'Tarefas',
                            text: 'Minhas tarefas exportadas.'
                        });
                        return;
                    }
                } catch (error) {
                    if (error.name === 'AbortError') return;
                }
            }
            
            // Fallback to download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // --- Copy Markdown Logic ---
    const copyMdBtn = document.getElementById('todo-copy-md');
    if (copyMdBtn) {
        copyMdBtn.addEventListener('click', () => {
            if (todos.length === 0) {
                App.showToast('Nenhuma tarefa para copiar.');
                return;
            }
            
            let mdContent = '## Minhas Tarefas\n\n';
            todos.forEach(todo => {
                const checkbox = todo.done ? '[x]' : '[ ]';
                mdContent += `- ${checkbox} ${todo.text}\n`;
            });
            
            const fallbackCopyTextToClipboard = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    if (document.execCommand('copy')) {
                        App.showToast('Tarefas copiadas como Markdown!');
                    } else {
                        App.showToast('Não foi possível copiar as tarefas.');
                    }
                } catch (err) {
                    App.showToast('Erro ao copiar as tarefas.');
                }
                document.body.removeChild(textArea);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(mdContent)
                    .then(() => App.showToast('Tarefas copiadas como Markdown!'))
                    .catch(err => {
                        fallbackCopyTextToClipboard(mdContent);
                    });
            } else {
                fallbackCopyTextToClipboard(mdContent);
            }
        });
    }

    renderTodos();
});
