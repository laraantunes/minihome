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
        if (!state.frameCount) state.frameCount = 0;
        state.frameCount++;
        // Atualiza a animação a cada 4 frames para ficar mais lento sem borrar
        if (state.frameCount < 4) return;
        state.frameCount = 0;

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
        
        const colors = ['#ffffff', '#ffffff', '#a855f7', '#4ade80', '#60a5fa', '#fde047', '#fb923c'];
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5, // slightly larger so colors are visible
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25,
                color: colors[Math.floor(Math.random() * colors.length)]
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
            ctx.fillStyle = star.color;
            ctx.fill();
            
            star.x += star.vx / 100;
            star.y += star.vy / 100;
            
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
                speed: Math.random() * 2 + 1
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
            food: {
                x: Math.floor(Math.random() * Math.floor(canvas.width/gridSize)), 
                y: Math.floor(Math.random() * Math.floor(canvas.height/gridSize))
            },
            frameCount: 0
        };
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateCobrinha() {
        state.frameCount++;
        if (state.frameCount < 8) return;
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
            let nx = head.x + d.x;
            let ny = head.y + d.y;
            if (nx >= cols) nx = 0;
            if (nx < 0) nx = cols - 1;
            if (ny >= rows) ny = 0;
            if (ny < 0) ny = rows - 1;
            return !state.snake.some(s => s.x === nx && s.y === ny);
        });

        if (possibleDirs.length > 0) {
            let bestDir = possibleDirs[0];
            let minDist = Infinity;
            possibleDirs.forEach(d => {
                let nx = head.x + d.x;
                let ny = head.y + d.y;
                if (nx >= cols) nx = 0;
                if (nx < 0) nx = cols - 1;
                if (ny >= rows) ny = 0;
                if (ny < 0) ny = rows - 1;
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
        
        // Verifica colisão com o próprio corpo
        const isCollision = state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
        if (isCollision) {
            initCobrinha();
            return;
        }
        
        state.snake.unshift(newHead);
        
        if (newHead.x === state.food.x && newHead.y === state.food.y) {
            let newFood;
            while (true) {
                newFood = {
                    x: Math.floor(Math.random() * cols),
                    y: Math.floor(Math.random() * rows)
                };
                if (!state.snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
            }
            state.food = newFood;
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

    // -- TERMINAL ANIMATION --
    function initTerminal() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');
        
        state = {
            lines: [
                "MinihomeOS v2.1.2",
                "Login: admin",
                "Password: ***",
                "Welcome to MinihomeOS!",
                ""
            ],
            commands: [
                { cmd: "sudo apt-get update", out: ["Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease", "Get:2 http://security.ubuntu.com/ubuntu focal-security InRelease [114 kB]", "Fetched 114 kB in 1s (120 kB/s)", "Reading package lists... Done"] },
                { cmd: "ls -la", out: ["total 42", "drwxr-xr-x 2 admin admin 4096 Sep 22 10:00 .", "drwxr-xr-x 3 admin admin 4096 Sep 22 09:00 ..", "-rw-r--r-- 1 admin admin  220 Sep 22 09:00 .bash_logout", "-rw-r--r-- 1 admin admin 3771 Sep 22 09:00 .bashrc"] },
                { cmd: "ping -c 3 8.8.8.8", out: ["PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.", "64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms", "64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=13.5 ms", "64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=15.1 ms", "--- 8.8.8.8 ping statistics ---", "3 packets transmitted, 3 received, 0% packet loss, time 2003ms"] },
                { cmd: "top -b -n 1 | head -n 5", out: ["top - 11:15:00 up 2 days,  1:30,  1 user,  load average: 0.00, 0.00, 0.00", "Tasks: 120 total,   1 running, 119 sleeping,   0 stopped,   0 zombie", "%Cpu(s):  0.5 us,  0.5 sy,  0.0 ni, 99.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st", "KiB Mem :  8192000 total,  4500000 free,  2100000 used,  1592000 buff/cache"] },
                { cmd: "docker ps", out: ["CONTAINER ID   IMAGE         COMMAND                  CREATED       STATUS       PORTS                               NAMES", "c9f8e4d2a1b3   nginx:latest  \"/docker-entrypoint.…\"   2 hours ago   Up 2 hours   0.0.0.0:80->80/tcp, :::80->80/tcp   web_server", "a1b2c3d4e5f6   mysql:8.0     \"docker-entrypoint.s…\"   2 hours ago   Up 2 hours   3306/tcp                            db_server"] },
                { cmd: "tail -f /var/log/syslog", out: ["Sep 22 11:10:01 minihome CRON[1234]: (root) CMD (/usr/local/bin/backup.sh)", "Sep 22 11:12:30 minihome systemd[1]: Started Session 42 of user admin.", "Sep 22 11:15:22 minihome kernel: [ 1234.567890] usb 1-1: new high-speed USB device number 3 using xhci_hcd"] }
            ],
            cmdIndex: 0,
            charIndex: 0,
            outIndex: 0,
            phase: 'typing', // typing, outputting, waiting
            timer: 0,
            frameCount: 0
        };
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateTerminal() {
        state.frameCount++;
        if (state.frameCount % 2 !== 0) return; // limit speed
        
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "16px monospace";
        const lineHeight = 20;
        const maxLines = Math.floor(canvas.height / lineHeight) - 1;
        
        let displayLines = [...state.lines];
        let currentCommandObj = state.commands[state.cmdIndex];
        
        if (state.phase === 'typing') {
            if (state.timer > 0) {
                state.timer--;
            } else {
                state.charIndex++;
                // Velocidade de digitação variável e mais lenta
                state.timer = Math.floor(Math.random() * 3) + 2; 
                
                if (state.charIndex > currentCommandObj.cmd.length) {
                    state.phase = 'outputting';
                    state.timer = 10;
                }
            }
        } else if (state.phase === 'outputting') {
            if (state.timer > 0) {
                state.timer--;
            } else {
                if (state.outIndex === 0) {
                    state.lines.push("admin@minihome:~$ " + currentCommandObj.cmd);
                }
                
                if (state.outIndex < currentCommandObj.out.length) {
                    state.lines.push(currentCommandObj.out[state.outIndex]);
                    state.outIndex++;
                    state.timer = 2; // small delay between lines
                } else {
                    state.phase = 'waiting';
                    state.timer = 30; // wait before next command
                }
            }
        } else if (state.phase === 'waiting') {
            if (state.timer > 0) {
                state.timer--;
            } else {
                state.cmdIndex = (state.cmdIndex + 1) % state.commands.length;
                state.charIndex = 0;
                state.outIndex = 0;
                state.phase = 'typing';
                state.timer = 10;
            }
        }
        
        if (state.lines.length > maxLines * 2) {
            state.lines = state.lines.slice(state.lines.length - maxLines);
        }
        
        let promptLine = "admin@minihome:~$ ";
        if (state.phase === 'typing' || state.phase === 'waiting') {
            promptLine += currentCommandObj.cmd.substring(0, state.charIndex);
            if (Math.floor(state.frameCount / 15) % 2 === 0) {
                promptLine += "█";
            }
        }
        
        let linesToDraw = [...state.lines];
        if (state.phase === 'typing' || state.phase === 'waiting') {
             linesToDraw.push(promptLine);
        }
        
        if (linesToDraw.length > maxLines) {
            linesToDraw = linesToDraw.slice(linesToDraw.length - maxLines);
        }
        
        for (let i = 0; i < linesToDraw.length; i++) {
            let text = linesToDraw[i];
            if (text.startsWith("admin@minihome:~$")) {
                ctx.fillStyle = "#0F0";
                ctx.fillText("admin@minihome:~$", 10, 20 + i * lineHeight);
                ctx.fillStyle = "#CCC";
                ctx.fillText(text.substring(17), 10 + ctx.measureText("admin@minihome:~$").width, 20 + i * lineHeight);
            } else {
                ctx.fillStyle = "#CCC";
                ctx.fillText(text, 10, 20 + i * lineHeight);
            }
        }
    }

    function update() {
        if (!isRunning) return;

        if (type === 'bolinha') updateBolinha();
        else if (type === 'matrix') updateMatrix();
        else if (type === 'estrelas') updateEstrelas();
        else if (type === 'chuva') updateChuva();
        else if (type === 'cobrinha') updateCobrinha();
        else if (type === 'terminal') updateTerminal();

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
        else if (type === 'terminal') initTerminal();
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
    window.startScreensaver = startScreensaver;
    window.isScreensaverRunning = () => isRunning;
});
