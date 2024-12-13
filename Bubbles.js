const c = document.querySelector('canvas');
const ctx = c.getContext('2d');
let cw = c.width = innerWidth;
let ch = c.height = innerHeight;
const bubbles = [];
const debounce = gsap.to(window, { duration: 0.07 });
const m = { x: 0, y: 0 };

window.onpointerdown = window.onpointermove = (e) => {
    m.x = e.x;
    m.y = e.y;
    makeBubble();
};

function makeBubble(auto) {
    if (debounce.progress() == 1 || auto) {
        debounce.play(0);

        const dist = gsap.utils.random(100, 200);
        const scale = gsap.utils.random(0.4, 0.8);
        const b = {
            dur: gsap.utils.random(3, 7),
            rotate: gsap.utils.random(-9, 9),
            scale: scale,
            x: m.x,
            y: m.y,
            vx: gsap.utils.random(-2, 2),
            vy: gsap.utils.random(-2, -1),
        };

        bubbles.push(b);

        gsap.timeline({ defaults: { ease: 'none' } })
            .to(b, {
                x: b.x + gsap.utils.random(-dist, dist, 1),
                y: b.y + gsap.utils.random(-dist, dist, 1),
                duration: b.dur,
                onUpdate: () => {
                    b.x += b.vx;
                    b.y += b.vy;
                },
            })
            .to(b, {
                opacity: 0,
                duration: b.dur,
                onComplete: () => bubbles.splice(bubbles.indexOf(b), 1),
            });
    }
}

gsap.ticker.add(() => {
    ctx.clearRect(0, 0, cw, ch);
    bubbles.forEach((b) => drawBubble(b));
});

function drawBubble(b) {
    const gradient = ctx.createRadialGradient(
        b.x,
        b.y,
        0,
        b.x,
        b.y,
        b.scale * 75
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Highlight
    gradient.addColorStop(0.3, 'rgba(173, 216, 230, 0.5)'); // Blue tint
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.1)'); // Fading edge

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.scale * 75, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

window.onresize = () => {
    cw = c.width = innerWidth;
    ch = c.height = innerHeight;
};
