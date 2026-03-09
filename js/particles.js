/* ===== Particle / Constellation Background ===== */
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles, animId;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 40 : 90;
    const CONNECTION_DIST = isMobile ? 120 : 160;
    const MOUSE_RADIUS = 220;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.8 + 0.4,
                opacity: Math.random() * 0.5 + 0.2,
                // Color variation: cyan or purple
                hue: Math.random() > 0.6 ? 270 : 190
            });
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.hue === 270) {
            ctx.fillStyle = `rgba(123, 47, 247, ${p.opacity})`;
        } else {
            ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        }
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            // Mouse connections with purple
            const mdx = particles[i].x - mouse.x;
            const mdy = particles[i].y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < MOUSE_RADIUS) {
                const opacity = (1 - mDist / MOUSE_RADIUS) * 0.25;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);

                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y, mouse.x, mouse.y
                );
                gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(123, 47, 247, ${opacity})`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }

    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse interaction: gentle attraction + repulsion at close range
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
                // Repel at close range
                p.vx += dx / dist * 0.03;
                p.vy += dy / dist * 0.03;
            } else if (dist < 200) {
                // Very subtle attraction at medium range
                p.vx -= dx / dist * 0.003;
                p.vy -= dy / dist * 0.003;
            }

            // Damping
            p.vx *= 0.998;
            p.vy *= 0.998;

            // Speed limit
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 1) {
                p.vx = (p.vx / speed) * 1;
                p.vy = (p.vy / speed) * 1;
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        update();
        drawConnections();
        particles.forEach(drawParticle);
        animId = requestAnimationFrame(animate);
    }

    // Init
    resize();
    createParticles();
    animate();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createParticles();
        }, 200);
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
})();
