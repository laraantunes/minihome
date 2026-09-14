document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('screensaver-btn');
    const container = document.getElementById('screensaver');
    const ball = document.getElementById('screensaver-ball');

    let x = 0, y = 0;
    let dx = 4, dy = 4;
    let animationId = null;
    let isRunning = false;

    function randomColor() {
        return `hsl(${Math.random() * 360}, 100%, 60%)`;
    }

    function update() {
        if (!isRunning) return;

        const maxX = window.innerWidth - 80; // 80 is ball width/height
        const maxY = window.innerHeight - 80;

        let hitEdge = false;

        x += dx;
        y += dy;

        if (x >= maxX || x <= 0) {
            dx = -dx;
            x = Math.max(0, Math.min(x, maxX));
            hitEdge = true;
        }

        if (y >= maxY || y <= 0) {
            dy = -dy;
            y = Math.max(0, Math.min(y, maxY));
            hitEdge = true;
        }

        if (hitEdge) {
            const color = randomColor();
            ball.style.backgroundColor = color;
            ball.style.color = color;
        }

        ball.style.transform = `translate(${x}px, ${y}px)`;

        animationId = requestAnimationFrame(update);
    }

    function startScreensaver() {
        container.classList.remove('hidden');
        isRunning = true;
        
        x = Math.random() * (window.innerWidth - 80);
        y = Math.random() * (window.innerHeight - 80);
        
        const color = randomColor();
        ball.style.backgroundColor = color;
        ball.style.color = color;
        
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
    }

    if (btn) {
        btn.addEventListener('click', startScreensaver);
    }

    window.stopScreensaver = stopScreensaver;
    window.isScreensaverRunning = () => isRunning;
});
