document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const heartsDisplay = document.getElementById('hearts');
    const scoreDisplay = document.getElementById('score');
    const gameContainer = document.querySelector('.game-container');

    const playerSpeed = 20;
    let hearts = 3;
    let score = 0;

    // Player positioning po sredata
    player.style.left = (gameContainer.clientWidth - player.offsetWidth) / 2 + 'px';

    let playerX = parseInt(player.style.left); // tochna poziciq

    // player movement
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            playerX = Math.max(playerX - playerSpeed, 0);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            playerX = Math.min(playerX + playerSpeed, gameContainer.clientWidth - player.clientWidth);
        }
        player.style.left = playerX + 'px'; // obnovqvame poziciqta na igracha
    });

    // padashti podaruci + tochki
    function createGift() {
        const gift = document.createElement('div');
        gift.classList.add('gift');
        gift.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
        gameContainer.appendChild(gift);

        let giftY = 0;

        const giftFallInterval = setInterval(() => {
            giftY += 5;
            gift.style.top = giftY + 'px';

            if (isGiftCaught(gift)) {
                score += 5;
                scoreDisplay.textContent = 'Score: ' + score;
                gift.remove();
                clearInterval(giftFallInterval);
                createGift();
            }

            if (giftY > gameContainer.clientHeight) {
                hearts -= 1;
                heartsDisplay.textContent = '❤️'.repeat(hearts);
                gift.remove();
                clearInterval(giftFallInterval);
                if (hearts === 0) {
                    alert('Game Over! Your score: ' + score);
                    location.reload();
                } else {
                    createGift();
                }
            }
        }, 50);
    }

    //Proverqvame dali podaruka e hvanat
    function isGiftCaught(gift) {
        const giftRect = gift.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        return (
            giftRect.top < playerRect.bottom &&
            giftRect.bottom > playerRect.top &&
            giftRect.left < playerRect.right &&
            giftRect.right > playerRect.left
        );
    }

    createGift();
});