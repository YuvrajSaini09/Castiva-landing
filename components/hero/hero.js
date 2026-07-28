// Hero Component Scripts

// Discover Button Nebula Script
(function() {
    const canvas = document.getElementById('nebulaCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.life = Math.random() * 100;
            this.maxLife = 100 + Math.random() * 100;
            this.alpha = 0;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;

            if (this.life < 50) {
                this.alpha = (this.life / 50) * this.baseAlpha;
            } else if (this.life > this.maxLife - 50) {
                this.alpha = ((this.maxLife - this.life) / 50) * this.baseAlpha;
            } else {
                this.alpha = this.baseAlpha;
            }

            if (this.life >= this.maxLife || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.life = 0;
                this.maxLife = 100 + Math.random() * 100;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha)})`;
            ctx.fill();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        }
    }

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    const smokeLayer = document.getElementById('smokeLayer');
    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        time += 0.01;
        const offsetX = Math.sin(time) * 10;
        const offsetY = Math.cos(time * 0.8) * 10;
        if(smokeLayer) smokeLayer.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${time * 5}deg)`;

        requestAnimationFrame(animate);
    }

    animate();
})();

// Hero animations (GSAP)
if (window.gsap) {
  const tl = gsap.timeline();
  tl.fromTo('.gs-blur-reveal', 
    { opacity: 0, y: 35, filter: 'blur(12px)' }, 
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.2, ease: 'power3.out' }
  );
}
