document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('todo-add-btn');
    const list = document.getElementById('todo-list');

    let todos = App.loadData('todos', []);

    function renderTodos() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.done) li.classList.add('done');

            li.innerHTML = `
                <label class="todo-item-label">
                    <input type="checkbox" class="todo-check" data-index="${index}" ${todo.done ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                </label>
                <button class="icon-btn todo-delete" data-index="${index}"><span class="material-icons-round" style="font-size: 1.1rem;">delete</span></button>
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
