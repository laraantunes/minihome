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

    // -- BATIDA SONORA ANIMATION --
    function initBatida() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');

        state = {
            time: 0,
            waves: [
                { color: '#00f3ff', speed: 0.05, amp: 80, freq: 0.01, subFreq: 0.035, offset: 0 },
                { color: '#ff007f', speed: -0.065, amp: 105, freq: 0.008, subFreq: 0.028, offset: 2 },
                { color: '#b500ff', speed: 0.04, amp: 65, freq: 0.014, subFreq: 0.042, offset: 4 },
                { color: '#00ff88', speed: -0.075, amp: 55, freq: 0.018, subFreq: 0.05, offset: 1 }
            ]
        };

        ctx.fillStyle = "#05000a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateBatida() {
        ctx.save();
        state.time += 0.06;

        // Pulso rítmico contínuo e suave, sem flashes ou piscadas aleatórias
        const pulse = (Math.sin(state.time * 1.5) + 1) * 0.5;

        ctx.fillStyle = "rgba(5, 0, 14, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerY = canvas.height / 2;
        const step = 12;

        // Somente o movimento contínuo das linhas no meio
        state.waves.forEach(wave => {
            wave.offset += wave.speed;
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2.5 + pulse * 1.5;
            ctx.shadowColor = wave.color;
            ctx.shadowBlur = 15;

            for (let x = 0; x <= canvas.width + step; x += step) {
                const env = Math.sin((x / canvas.width) * Math.PI);
                const mainWave = Math.sin(x * wave.freq + wave.offset) * wave.amp * (0.5 + pulse * 0.6);
                const harmonic = Math.cos(x * wave.subFreq - wave.offset * 1.8) * (wave.amp * 0.35) * env;
                const y = centerY + mainWave + harmonic;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        ctx.restore();
    }

    // -- ROCK ANIMATION --
    function createRockLightning(w, h, colors) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const points = [];
        const segments = Math.floor(Math.random() * 8) + 8;

        // Raios verticais/diagonais agressivos estilo palco de Rock
        let x = Math.random() * w;
        let y = 0;
        const targetX = x + (Math.random() - 0.5) * (w * 0.5);
        const dx = (targetX - x) / segments;
        const dy = h / segments;

        points.push({ x, y });
        for (let i = 0; i < segments; i++) {
            x += dx + (Math.random() - 0.5) * 90;
            y += dy + (Math.random() - 0.2) * 20;
            points.push({ x, y });
        }

        return {
            points,
            color,
            alpha: 1,
            decay: Math.random() * 0.07 + 0.05,
            width: Math.random() * 4 + 2.5
        };
    }

    function initRock() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');

        const colors = ['#ff0022', '#ff4500', '#ff8c00', '#ffcc00', '#e11d48'];
        // 6 cordas de guitarra com distorção
        const strings = [];
        const stringColors = ['#ff0022', '#ff3300', '#ff5500', '#ff7700', '#ffaa00', '#ffcc00'];
        for (let i = 0; i < 6; i++) {
            strings.push({
                color: stringColors[i],
                thickness: 3.5 - i * 0.35,
                vibration: 0,
                phase: Math.random() * Math.PI * 2,
                freq: 0.015 + i * 0.004
            });
        }

        state = {
            time: 0,
            chordHit: 0,
            colors,
            strings,
            bolts: [],
            sparks: []
        };

        ctx.fillStyle = "#0a0202";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateRock() {
        ctx.save();
        state.time++;

        // Ritmo de bateria e power chords de Rock (bumbo/caixa pesados + riffs rápidos)
        const isPowerChord = state.time % 28 === 0 || state.time % 28 === 12;
        const isRiffNote = state.time % 6 === 0;

        if (isPowerChord) {
            state.chordHit = 1.0;
            // Vibra todas as cordas com força no power chord
            state.strings.forEach(s => {
                s.vibration = 1.0;
            });
            // Dispara raios rasgados de palco
            const boltCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < boltCount; i++) {
                state.bolts.push(createRockLightning(canvas.width, canvas.height, state.colors));
            }
            // Explosão de faíscas de pirotecnia
            const sparkX = Math.random() * canvas.width;
            const sparkY = canvas.height * (0.3 + Math.random() * 0.4);
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 12 + 3;
                state.sparks.push({
                    x: sparkX,
                    y: sparkY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    color: state.colors[Math.floor(Math.random() * state.colors.length)],
                    alpha: 1,
                    size: Math.random() * 3 + 1.5
                });
            }
        } else if (isRiffNote) {
            state.chordHit = Math.max(state.chordHit, 0.45);
            // Toca 1 ou 2 cordas específicas no riff rápido
            const strIdx = Math.floor(Math.random() * state.strings.length);
            state.strings[strIdx].vibration = 0.85;
            if (Math.random() > 0.4) {
                state.bolts.push(createRockLightning(canvas.width, canvas.height, state.colors));
            }
        }

        state.chordHit *= 0.85;

        // Fundo preto-avermelhado com rastro
        ctx.fillStyle = "rgba(10, 2, 2, 0.32)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (state.chordHit > 0.65) {
            ctx.fillStyle = "rgba(255, 20, 0, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Desenha as 6 cordas de guitarra com onda de distorção (sawtooth/jagged)
        const spacing = canvas.height / 7;
        const step = 14;
        state.strings.forEach((str, idx) => {
            const baseY = spacing * (idx + 1);
            str.phase += 0.35 + str.vibration * 0.4;
            str.vibration *= 0.9;

            ctx.beginPath();
            ctx.strokeStyle = str.color;
            ctx.lineWidth = str.thickness + str.vibration * 2.5;
            ctx.shadowColor = str.color;
            ctx.shadowBlur = 10 + str.vibration * 25;

            for (let x = 0; x <= canvas.width + step; x += step) {
                // Mais amplitude no centro da corda, presa nas pontas
                const env = Math.sin((x / canvas.width) * Math.PI);
                const wave = Math.sin(x * str.freq + str.phase) * (str.vibration * 55) * env;
                // Distorção agressiva pontiaguda típica de guitarra de rock
                const distortion = ((x / step) % 2 === 0 ? 1 : -1) * (str.vibration * 28) * Math.random() * env;
                const y = baseY + wave + distortion;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Desenha os raios pesados de palco
        for (let i = state.bolts.length - 1; i >= 0; i--) {
            const b = state.bolts[i];
            ctx.beginPath();
            b.points.forEach((pt, idx) => {
                const jx = pt.x + (Math.random() - 0.5) * 18;
                const jy = pt.y + (Math.random() - 0.5) * 10;
                if (idx === 0) ctx.moveTo(jx, jy);
                else ctx.lineTo(jx, jy);
            });

            ctx.globalAlpha = Math.max(0, b.alpha);
            ctx.strokeStyle = b.color;
            ctx.lineWidth = b.width + 2;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 30;
            ctx.stroke();

            ctx.strokeStyle = "#fff5e6";
            ctx.lineWidth = Math.max(1, b.width * 0.45);
            ctx.shadowBlur = 6;
            ctx.stroke();

            b.alpha -= b.decay;
            if (b.alpha <= 0) {
                state.bolts.splice(i, 1);
            }
        }

        // Desenha faíscas pirotécnicas
        for (let i = state.sparks.length - 1; i >= 0; i--) {
            const sp = state.sparks[i];
            ctx.globalAlpha = Math.max(0, sp.alpha);
            ctx.fillStyle = sp.color;
            ctx.shadowColor = sp.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();

            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.25; // gravidade leve
            sp.alpha -= 0.04;
            if (sp.alpha <= 0) {
                state.sparks.splice(i, 1);
            }
        }

        ctx.restore();
    }

    // -- TUNEL ANIMATION --
    function createTunnelLight(maxZ, colors) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 180 + 40;
        const z = Math.random() * maxZ + 1;
        return {
            angle,
            radius,
            z,
            prevZ: z,
            speed: Math.random() * 3.5 + 3.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 2.5 + 1.5
        };
    }

    function initTunel() {
        if (ball) ball.classList.add('hidden');
        if (canvas) canvas.classList.remove('hidden');

        const colors = ['#00f3ff', '#a855f7', '#ec4899', '#3b82f6', '#4ade80', '#fde047', '#ffffff'];
        const maxZ = 1000;
        const lights = [];
        for (let i = 0; i < 220; i++) {
            lights.push(createTunnelLight(maxZ, colors));
        }

        const rings = [];
        const numRings = 10;
        for (let i = 0; i < numRings; i++) {
            rings.push({
                z: (i / numRings) * maxZ + 1,
                color: colors[i % colors.length]
            });
        }

        state = {
            time: 0,
            maxZ,
            colors,
            lights,
            rings
        };

        ctx.fillStyle = "#000005";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function updateTunel() {
        ctx.save();
        state.time += 0.008;

        // Fundo escuro com rastro suave para alongar os feixes de luz
        ctx.fillStyle = "rgba(0, 0, 8, 0.22)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ponto central com leve movimento orgânico de curva do túnel
        const cx = canvas.width / 2 + Math.cos(state.time * 0.8) * 35;
        const cy = canvas.height / 2 + Math.sin(state.time * 1.1) * 25;
        const fov = Math.min(canvas.width, canvas.height) * 0.85;

        // Brilho no ponto central de origem
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 90);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
        grad.addColorStop(0.4, "rgba(168, 85, 247, 0.12)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 90, 0, Math.PI * 2);
        ctx.fill();

        // Anéis de profundidade do túnel saindo do centro
        state.rings.forEach(ring => {
            ring.z -= 3.5;
            if (ring.z <= 10) {
                ring.z = state.maxZ;
                ring.color = state.colors[Math.floor(Math.random() * state.colors.length)];
            }

            const scale = fov / ring.z;
            const r = 120 * scale;
            const alpha = Math.min(0.45, (1 - ring.z / state.maxZ) * 0.6);

            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = ring.color;
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.lineWidth = Math.max(1, 2.5 * (1 - ring.z / state.maxZ));
            ctx.shadowColor = ring.color;
            ctx.shadowBlur = 12;
            ctx.stroke();
        });

        // Feixes de luz saindo do ponto central em direção às bordas
        ctx.lineCap = "round";
        state.lights.forEach(light => {
            light.prevZ = light.z;
            light.z -= light.speed;
            light.angle += 0.0015; // leve rotação espiral no túnel

            if (light.z <= 5) {
                light.z = state.maxZ;
                light.prevZ = state.maxZ;
                light.angle = Math.random() * Math.PI * 2;
                light.radius = Math.random() * 180 + 35;
                light.color = state.colors[Math.floor(Math.random() * state.colors.length)];
            }

            const scale = fov / light.z;
            const prevScale = fov / light.prevZ;

            const x = cx + Math.cos(light.angle) * light.radius * scale;
            const y = cy + Math.sin(light.angle) * light.radius * scale;
            const px = cx + Math.cos(light.angle) * light.radius * prevScale;
            const py = cy + Math.sin(light.angle) * light.radius * prevScale;

            const depthRatio = 1 - light.z / state.maxZ;
            ctx.globalAlpha = Math.min(1, depthRatio * 1.3);
            ctx.strokeStyle = light.color;
            ctx.lineWidth = Math.max(1, light.size * depthRatio * 3.2);
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 15;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        ctx.restore();
    }

    function update() {
        if (!isRunning) return;

        if (type === 'bolinha') updateBolinha();
        else if (type === 'matrix') updateMatrix();
        else if (type === 'estrelas') updateEstrelas();
        else if (type === 'chuva') updateChuva();
        else if (type === 'cobrinha') updateCobrinha();
        else if (type === 'terminal') updateTerminal();
        else if (type === 'batida') updateBatida();
        else if (type === 'rock') updateRock();
        else if (type === 'tunel') updateTunel();

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
        else if (type === 'batida') initBatida();
        else if (type === 'rock') initRock();
        else if (type === 'tunel') initTunel();
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
