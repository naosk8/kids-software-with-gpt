let fireworksTimer = null;
document.addEventListener("DOMContentLoaded", () => {
    const testButton = document.getElementById("test-fireworks");
    testButton?.addEventListener("click", () => {
        if (fireworksTimer) {
            stopFireworks();
        } else {
            createFireworks();
        }
    });
    initGame();
});

const images = [
    "princess/1.png",
    "princess/2.png",
    "princess/3.png",
    "princess/4.png",
    "princess/5.png",
    "princess/6.png",
    "princess/7.png",
    "princess/8.png",
    "princess/9.png",
    "princess/10.png",
];
const cardImages = [...images, ...images]; // Create 2 sets
let shuffledImages, firstCard, secondCard;
let lockBoard = false;
let currentPlayer = 0;
const players = [];
const numPlayers = parseInt(prompt("Enter the number of players (1-4):", "2"));

const gameBoard = document.getElementById("game-board");
const playerBoard = document.getElementById("player-board");
const popup = document.getElementById("popup");


const fireworksContainer = document.getElementById('fireworks');
const launchFirework = () => {
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
                particle.classList.add('firework'); // クラス名を 'particle' から 'firework' に修正
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
};
function createFireworks() {
    launchFirework();
    fireworksTimer = setInterval(launchFirework, 2000); // 2秒ごとに花火を打ち上げ
    // fireworksContainer の背景色をrgba(0, 0, 0, 0.5)に変更
    fireworksContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
}
function stopFireworks() {
    clearInterval(fireworksTimer);
    fireworksTimer = null;
    fireworksContainer.style.backgroundColor = 'transparent'; // 背景色を透明に戻す
}

function showPopup(message) {
    popup.innerHTML = message;
    popup.style.display = "block";
    createFireworks();
    setTimeout(() => {
        document.body.addEventListener("click", hidePopup);
    }, 500); // 最初のクリックを無視するための遅延
}

function hidePopup() {
    popup.style.display = "none";
    document.body.removeEventListener("click", hidePopup);
    stopFireworks();
    resetGame();
}

function initGame() {
    for (let i = 0; i < numPlayers; i++) {
        players.push({ score: 0 });
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `<h2>Player ${i + 1}</h2><p>Score: <span id="player${i}-score">0</span></p>`;
        playerBoard.appendChild(playerDiv);
    }

    document.getElementById(`player${currentPlayer}`).classList.add("active-player");

    resetGame();
}

function createCard(image) {
    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    img.src = image;
    card.appendChild(img);

    card.addEventListener("click", () => {
        if (lockBoard) return;
        if (card === firstCard) return;

        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            checkForMatch();
        }
    });

    return card;
}

function checkForMatch() {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        firstCard.classList.add("happy");
        secondCard.classList.add("happy");
        setTimeout(() => {
            if (!!firstCard) {
                firstCard.classList.remove("happy");
            }
            if (!!secondCard) {
                secondCard.classList.remove("happy");
            }
        }, 500);
        players[currentPlayer].score += 2;
        document.getElementById(`player${currentPlayer}-score`).textContent =
            players[currentPlayer].score;
        resetBoard();
        checkGameEnd();
    } else {
        lockBoard = true;
        setTimeout(() => {
            if (!!firstCard) {
                firstCard.classList.remove("flipped");
            }
            if (!!secondCard) {
                secondCard.classList.remove("flipped");
            }
            resetBoard();
            switchPlayer();
        }, 1500);
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function switchPlayer() {
    document
        .getElementById(`player${currentPlayer}`)
        .classList.remove("active-player");
    currentPlayer = (currentPlayer + 1) % numPlayers;
    document
        .getElementById(`player${currentPlayer}`)
        .classList.add("active-player");
}

function checkGameEnd() {
    const matchedCards = document.querySelectorAll(".card.matched").length;
    if (matchedCards === cardImages.length) {
        let maxScore = 0;
        let winners = [];
        for (let i = 0; i < players.length; i++) {
            if (players[i].score > maxScore) {
                maxScore = players[i].score;
                winners = [i]; // 新しい勝者を設定
            } else if (players[i].score === maxScore) {
                winners.push(i); // 同点の勝者を追加
            }
        }
        setTimeout(() => {
            if (winners.length === 1) {
                showPopup(`Player ${winners[0] + 1} wins! Congratulations!`);
            } else {
                const winnerNames = winners.map(winner => `Player ${winner + 1}`).join(', ');
                showPopup(`It's a tie between ${winnerNames}!`);
            }
        }, 500);
    }
}

function resetGame() {
    // Clear existing cards
    gameBoard.innerHTML = "";
    // Reset player scores
    players.forEach((player, index) => {
        player.score = 0;
        document.getElementById(`player${index}-score`).textContent = player.score;
    });
    // Shuffle and deal cards
    shuffledImages = cardImages.sort(() => 0.5 - Math.random());
    shuffledImages.forEach((image) => {
        gameBoard.appendChild(createCard(image));
    });
    // Reset current player
    currentPlayer = 0;
    document.querySelectorAll(".player").forEach((player, index) => {
        player.classList.remove("active-player");
        if (index === currentPlayer) {
            player.classList.add("active-player");
        }
    });
}
