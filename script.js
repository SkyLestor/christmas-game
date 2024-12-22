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
        fetch('spawnRates.php', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            gift.classList.add('gift', data.class);
            gift.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
            gameContainer.appendChild(gift);
            handleGiftMovement(gift, data);
        })
        .catch(error => console.error('Error spawning div:', error));
        
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

    function handleGiftMovement(gift, data){
        let giftY = 0;

        const giftFallInterval = setInterval(() => {
            giftY += data.speed;
            gift.style.top = giftY + 'px';

            if (isGiftCaught(gift)) {
                if (data.class === "bomb"){
                    loseHeart();
                }
                score += data.value;
                scoreDisplay.textContent = 'Score: ' + score;
                gift.remove();
                clearInterval(giftFallInterval);
                checkIfGameLost()
            }

            if (giftY > gameContainer.clientHeight) {
                // we don't lose hearts because of coal and bombs
                if (data.value > 0){
                    loseHeart();
                }
                checkIfGameLost()
                gift.remove();
                clearInterval(giftFallInterval);
            }
        }, 50);
    }

    function checkIfGameLost(){
        if (hearts === 0) {
            sendScoreAndUsernameToDatabaseHandle(score);
            alert('Game Over! Your score: ' + score);
            location.reload();
        } else {
            createGift();
        }
    }

    function loseHeart(){
        hearts -= 1;
        heartsDisplay.textContent = '❤️'.repeat(hearts);
    }

    createGift();
});


function sendScoreAndUsernameToDatabaseHandle(score) {
    fetch('databaseHandle.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            score: score,
            username: "test", 
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:' + data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

