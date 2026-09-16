document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('screensaver-btn');
    const container = document.getElementById('screensaver');
    const ball = document.getElementById('screensaver-ball');
    const closeBtn = document.getElementById('screensaver-close');
    const canvas = document.getElementById('screensaver-canvas');
    let ctx = canvas ? canvas.getContext('2d') : null;

    let animationId = null;
    let isRunning = false;
    let type = 'bolinha';

    // State for different animations
    let state = {};

    function randomColor() {
        return `hsl(${Math.random() * 360}, 100%, 60%)`;
    }

    function resizeCanvas() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    
    window.addEventListener('resize', resizeCanvas);

    // -- BOLINHA ANIMATION --
    function initBolinha() {
        if (ball) ball.classList.remove('hidden');
        if (canvas) canvas.classList.add('hidden');
        state = {
            x: Math.random() * (window.innerWidth - 80),
            y: Math.random() * (window.innerHeight - 80),
            dx: 4,
            dy: 4
        };
        const color = randomColor();
        if (ball) {
            ball.style.backgroundColor = color;
            ball.style.color = color;
        }
    }

    function updateBolinha() {
        if (!ball) return;
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        let hitEdge = false;

        state.x += state.dx;
        state.y += state.dy;

        if (state.x >= maxX || state.x <= 0) {
            state.dx = -state.dx;
            state.x = Math.max(0, Math.min(state.x, maxX));
            hitEdge = true;
        }

        if (state.y >= maxY || state.y <= 0) {
            state.dy = -state.dy;
            state.y = Math.max(0, Math.min(state.y, maxY));
            hitEdge = true;
        }

        if (hitEdge) {
            const color = randomColor();
            ball.style.backgroundColor = color;
            ball.style.color = color;
        }

        ball.style.transform = `translate(${state.x}px, ${state.y}px)`;
    }

    // -- MATRIX ANIMATION --
    function initMatrix() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*]*";
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize) + 1;
        const drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100; // Start at random negative Y
        }
        
        state = { chars, fontSize, drops };
        
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#0F0"; // Green text
        ctx.font = state.fontSize + "px monospace";
        
        for (let i = 0; i < state.drops.length; i++) {
            const text = state.chars.charAt(Math.floor(Math.random() * state.chars.length));
            ctx.fillText(text, i * state.fontSize, state.drops[i] * state.fontSize);
            
            if (state.drops[i] * state.fontSize > canvas.height && Math.random() > 0.975) {
                state.drops[i] = 0;
            }
            state.drops[i]++;
        }
    }

    // -- ESTRELAS ANIMATION --
    function initEstrelas() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }
        
        state = { stars };
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateEstrelas() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        state.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FFF";
            ctx.fill();
            
            star.x += star.vx / 30;
            star.y += star.vy / 30;
            
            if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
            if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
        });
    }

    // -- CHUVA ANIMATION --
    function initChuva() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        
        const drops = [];
        for (let i = 0; i < 500; i++) {
            drops.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 10 + 5
            });
        }
        
        state = { drops };
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateChuva() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "rgba(174, 194, 224, 0.5)";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        
        state.drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();
            
            drop.y += drop.speed;
            
            if (drop.y > canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * canvas.width;
            }
        });
    }

    // -- COBRINHA ANIMATION --
    function initCobrinha() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        
        const gridSize = 20;
        state = {
            gridSize: gridSize,
            snake: [
                {x: 10, y: 10},
                {x: 9, y: 10},
                {x: 8, y: 10}
            ],
            dir: {x: 1, y: 0},
            food: {x: Math.floor(Math.random() * (canvas.width/gridSize)), y: Math.floor(Math.random() * (canvas.height/gridSize))},
            frameCount: 0
        };
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateCobrinha() {
        state.frameCount++;
        if (state.frameCount < 5) return;
        state.frameCount = 0;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const cols = Math.floor(canvas.width / state.gridSize);
        const rows = Math.floor(canvas.height / state.gridSize);
        
        const head = state.snake[0];
        
        let possibleDirs = [
            {x: 1, y: 0}, {x: -1, y: 0},
            {x: 0, y: 1}, {x: 0, y: -1}
        ];
        
        possibleDirs = possibleDirs.filter(d => !(d.x === -state.dir.x && d.y === -state.dir.y));
        possibleDirs = possibleDirs.filter(d => {
            const nx = head.x + d.x;
            const ny = head.y + d.y;
            return nx >= 0 && nx < cols && ny >= 0 && ny < rows;
        });

        if (possibleDirs.length > 0) {
            let bestDir = possibleDirs[0];
            let minDist = Infinity;
            possibleDirs.forEach(d => {
                const nx = head.x + d.x;
                const ny = head.y + d.y;
                const dist = Math.abs(nx - state.food.x) + Math.abs(ny - state.food.y);
                if (dist < minDist) {
                    minDist = dist;
                    bestDir = d;
                }
            });
            
            if (Math.random() > 0.8 && possibleDirs.length > 1) {
                const others = possibleDirs.filter(d => d !== bestDir);
                state.dir = others[Math.floor(Math.random() * others.length)];
            } else {
                state.dir = bestDir;
            }
        }
        
        const newHead = {
            x: head.x + state.dir.x,
            y: head.y + state.dir.y
        };
        
        if (newHead.x >= cols) newHead.x = 0;
        if (newHead.x < 0) newHead.x = cols - 1;
        if (newHead.y >= rows) newHead.y = 0;
        if (newHead.y < 0) newHead.y = rows - 1;
        
        state.snake.unshift(newHead);
        
        if (newHead.x === state.food.x && newHead.y === state.food.y) {
            state.food = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
        } else {
            state.snake.pop(); 
        }
        
        ctx.fillStyle = "red";
        ctx.fillRect(state.food.x * state.gridSize, state.food.y * state.gridSize, state.gridSize - 2, state.gridSize - 2);
        
        ctx.fillStyle = "lime";
        state.snake.forEach((segment, i) => {
            if (i === 0) ctx.fillStyle = "green"; 
            else ctx.fillStyle = "lime";
            ctx.fillRect(segment.x * state.gridSize, segment.y * state.gridSize, state.gridSize - 2, state.gridSize - 2);
        });
    }

    function update() {
        if (!isRunning) return;

        if (type === 'bolinha') updateBolinha();
        else if (type === 'matrix') updateMatrix();
        else if (type === 'estrelas') updateEstrelas();
        else if (type === 'chuva') updateChuva();
        else if (type === 'cobrinha') updateCobrinha();

        animationId = requestAnimationFrame(update);
    }

    function startScreensaver() {
        container.classList.remove('hidden');
        isRunning = true;
        resizeCanvas();
        
        type = typeof App !== 'undefined' ? App.loadData('screensaver_type', 'bolinha') : 'bolinha';
        
        if (type === 'bolinha') initBolinha();
        else if (type === 'matrix') initMatrix();
        else if (type === 'estrelas') initEstrelas();
        else if (type === 'chuva') initChuva();
        else if (type === 'cobrinha') initCobrinha();
        else {
            type = 'bolinha';
            initBolinha();
        }
        
        if (!animationId) {
            update();
        }
    }

    function stopScreensaver() {
        container.classList.add('hidden');
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    if (btn) {
        btn.addEventListener('click', startScreensaver);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', stopScreensaver);
    }

    window.stopScreensaver = stopScreensaver;
    window.isScreensaverRunning = () => isRunning;
});
