document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shortener-form');
    const input = document.getElementById('shortener-input');
    const clearBtn = document.getElementById('shortener-clear-btn');
    const submitBtn = document.getElementById('shortener-submit-btn');
    const resultContainer = document.getElementById('shortener-result-container');
    const resultRow = document.getElementById('shortener-result-row');
    const resultInput = document.getElementById('shortener-result-input');
    const copyBtn = document.getElementById('shortener-copy-btn');
    const errorMsg = document.getElementById('shortener-error-msg');

    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
        resultContainer.style.display = 'none';
        errorMsg.style.display = 'none';
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        resultContainer.style.display = 'none';
        errorMsg.style.display = 'none';
        input.focus();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = input.value.trim();
        if (!url) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-icons-round">hourglass_empty</span>';
        errorMsg.style.display = 'none';
        resultContainer.style.display = 'none';
        resultRow.style.display = 'flex';

        try {
            const response = await fetch('widgets/shortener_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (response.ok) {
                resultInput.value = data.link;
                resultContainer.style.display = 'flex';
                copyBtn.innerHTML = '<span class="material-icons-round">content_copy</span>';
            } else {
                errorMsg.textContent = data.error || 'Ocorreu um erro ao encurtar o link.';
                errorMsg.style.display = 'block';
                resultContainer.style.display = 'flex';
                resultRow.style.display = 'none';
            }
        } catch (err) {
            errorMsg.textContent = 'Erro de conexão.';
            errorMsg.style.display = 'block';
            resultContainer.style.display = 'flex';
            resultRow.style.display = 'none';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="material-icons-round">content_cut</span>';
        }
    });

    copyBtn.addEventListener('click', () => {
        if (resultInput.value) {
            navigator.clipboard.writeText(resultInput.value).then(() => {
                copyBtn.innerHTML = '<span class="material-icons-round">check</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<span class="material-icons-round">content_copy</span>';
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar: ', err);
            });
        }
    });
});
