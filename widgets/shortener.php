<!-- Shortener Widget -->
<div class="widget" id="shortener-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">link</span> Encurtar URL</h2>
    </div>
    <div class="widget-content" style="display: flex; flex-direction: column; justify-content: center; min-height: 100px;">
        <form id="shortener-form" style="width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: stretch;" onsubmit="return false;">
            
            <div style="display: flex; gap: 8px; width: 100%;">
                <div style="position: relative; flex: 1; display: flex;">
                    <input type="url" id="shortener-input" placeholder="Cole sua URL aqui..." required
                           style="width: 100%; padding: 12px 40px 12px 16px; font-size: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.1); color: var(--text-primary); outline: none;">
                    <button type="button" id="shortener-clear-btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer; display: none; padding: 0;">
                        <span class="material-icons-round" style="font-size: 1.2rem;">close</span>
                    </button>
                </div>
                <button type="submit" id="shortener-submit-btn" class="btn btn-primary" aria-label="Encurtar" style="padding: 0 16px; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons-round">content_cut</span>
                </button>
            </div>
            
            <div id="shortener-result-container" style="display: none; flex-direction: column; gap: 8px;">
                <div id="shortener-result-row" style="display: flex; gap: 8px; width: 100%;">
                    <input type="text" id="shortener-result-input" readonly
                           style="flex: 1; padding: 10px 12px; font-size: 0.95rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); background: rgba(255,255,255,0.05); color: var(--text-primary); outline: none;">
                    <button type="button" id="shortener-copy-btn" class="btn" aria-label="Copiar" style="padding: 0 16px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); color: var(--text-primary); cursor: pointer;">
                        <span class="material-icons-round">content_copy</span>
                    </button>
                </div>
                <span id="shortener-error-msg" style="color: #ff6b6b; font-size: 0.85rem; display: none;"></span>
            </div>
            
            <div style="text-align: center; margin-top: 4px;">
                <span style="font-size: 0.8rem; color: var(--text-secondary);">
                    Via <a href="https://ctln.link/" target="_blank" style="color: var(--text-primary); text-decoration: none; font-weight: 500;">Central Link</a>
                </span>
            </div>
        </form>
    </div>
</div>
