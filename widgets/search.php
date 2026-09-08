<!-- Search Widget -->
<div class="widget" id="search-widget">
    <div class="widget-header">
        <h2><span class="material-icons-round">travel_explore</span> Busca</h2>
    </div>
    <div class="widget-content" style="display: flex; flex-direction: column; justify-content: center; min-height: 100px;">
        <form id="search-form" action="https://duckduckgo.com/" method="GET" target="_blank" style="width: 100%; display: flex; flex-direction: column; gap: 12px; align-items: stretch;">
            
            <select id="search-engine-select" aria-label="Provedor de Busca" style="width: 100%; padding: 10px 12px; border-radius: var(--border-radius-sm); background: rgba(0,0,0,0.1); color: var(--text-primary); border: 1px solid var(--border-color); font-size: 0.95rem; cursor: pointer; outline: none; appearance: auto; -webkit-appearance: auto;">
                <option value="ddg" style="color: #000;">DuckDuckGo</option>
                <option value="google" style="color: #000;">Google</option>
                <option value="wikipedia" style="color: #000;">Wikipedia</option>
            </select>
            
            <div style="display: flex; gap: 8px; width: 100%;">
                <div style="position: relative; flex: 1; display: flex;">
                    <input type="text" name="q" id="search-input" placeholder="O que você procura?" required
                           style="width: 100%; padding: 12px 40px 12px 16px; font-size: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.1); color: var(--text-primary); outline: none;">
                    <button type="button" id="search-clear-btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer; display: none; padding: 0;">
                        <span class="material-icons-round" style="font-size: 1.2rem;">close</span>
                    </button>
                </div>
                <button type="submit" class="btn btn-primary" aria-label="Pesquisar" style="padding: 0 16px; display: flex; align-items: center; justify-content: center;">
                    <span class="material-icons-round">search</span>
                </button>
            </div>
            
        </form>
    </div>
</div>
