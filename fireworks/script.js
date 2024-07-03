const fireworksContainer = document.getElementById('fireworks');

function launchFirework() {
    const layers = 3; // 同心円の層の数
    const particlesPerLayer = 30; // 各層のパーティクル数
    const numberOfFireworks = 6; // 同時に発生させる花火の数

    for (let n = 0; n < numberOfFireworks; n++) {
        const baseHue = Math.random() * 360; // 基本色相
        const centerX = Math.random() * window.innerWidth;
        const centerY = Math.random() * window.innerHeight;

        for (let j = 0; j < layers; j++) {
            const radius = 100 + j * 50; // 各層の半径を増加
            const color = `hsl(${baseHue + j * 30}, 100%, 50%)`; // 色を変化させる
            const duration = 1500 + j * 300; // 各層のアニメーション時間を増加

            for (let i = 0; i < particlesPerLayer; i++) {
                const angle = (Math.PI * 2 / particlesPerLayer) * i;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.background = color;
                fireworksContainer.appendChild(particle);

                particle.style.left = `calc(${centerX}px - 2.5px)`;
                particle.style.top = `calc(${centerY}px - 2.5px)`;
                particle.animate([
                    { transform: `translate(0, 0) scale(0)`, opacity: 1, offset: 0 },
                    { transform: `translate(${x}px, ${y}px) scale(1.5)`, opacity: 0, offset: 1 }
                ], {
                    duration: duration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                particle.onanimationend = () => {
                    particle.remove();
                };
            }
        }
    }
}

setInterval(launchFirework, 2000); // 2秒ごとに花火を打ち上げ
