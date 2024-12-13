document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('replay-button').addEventListener('click', replayGame);
document.getElementById('replay-button-popup').addEventListener('click', replayGame);
document.getElementById('history-button').addEventListener('click', showHistory);
document.getElementById('close-history-button').addEventListener('click', closeHistory);
document.getElementById('close-replay-button').addEventListener('click', closeReplay);
document.getElementById('back-button').addEventListener('click', backToNameEntry);
document.addEventListener('DOMContentLoaded', () => {
    const controls = document.querySelector('.controls');
    controls.classList.add('visible');
});

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer;
let startTime;
let cardsToMatch = 2; // Numatytoji reikšmė

function startGame() {
    const playerNameInput = document.getElementById('player-name');
    const playerName = playerNameInput.value.trim();
    const errorMessage = document.getElementById('error-message');
    const difficultyLevel = document.getElementById('difficulty-level').value;

    if (!playerName) {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    switch (difficultyLevel) {
        case 'easy':
            cardsToMatch = 2;
            break;
        case 'medium':
            cardsToMatch = 3;
            break;
        case 'hard':
            cardsToMatch = 4;
            break;
        default:
            cardsToMatch = 2;
    }
    try {
        sessionStorage.setItem('playerName', playerName);
    } catch (e) {
        console.error('Nepavyko įrašyti žaidėjo vardo į sesiją', e);
    }
    score = 0;
    matchedPairs = 0;
    flippedCards = [];

    document.querySelector('h1').classList.add('hidden');
    document.querySelector('h3').classList.add('hidden');

    document.querySelector('.controls').classList.add('hidden');
    document.getElementById('score').textContent = `Taškai: ${score}`;
    document.getElementById('player-name-display').textContent = playerName;

    const scoreBoard = document.querySelector('.score-board');
    const historyButton = document.getElementById('history-button');
    const gameBoard = document.getElementById('game-board');
    const buttonContainer = document.querySelector('.button-container');

    scoreBoard.classList.remove('hidden');
    historyButton.classList.remove('hidden');
    gameBoard.classList.remove('hidden');
    buttonContainer.classList.remove('hidden');

    requestAnimationFrame(() => {
        scoreBoard.classList.add('visible', 'fade-in-up');
        historyButton.classList.add('visible', 'fade-in-up');
        gameBoard.classList.add('visible'); 
        buttonContainer.classList.add('visible', 'fade-in-up');
    });

    initializeBoard();
    startTimer();
}

function showHistory() {
    const historyPopup = document.getElementById('history-popup');
    historyPopup.classList.remove('hidden');
    requestAnimationFrame(() => {
        historyPopup.classList.add('visible');
    });
    displayGameHistory();
}

function closeHistory() {
    const historyPopup = document.getElementById('history-popup');
    historyPopup.classList.remove('visible');
    setTimeout(() => {
        historyPopup.classList.add('hidden');
    }, 300);
}

function closeReplay() {
    const popup = document.getElementById('popup');
    popup.classList.remove('visible');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 300);
}

function backToNameEntry() {
    clearInterval(timer);

    document.querySelector('h1').classList.remove('hidden');
    document.querySelector('h3').classList.remove('hidden');

    document.querySelector('.controls').classList.remove('hidden');
    document.querySelector('.score-board').classList.add('hidden');
    document.getElementById('history-button').classList.add('hidden');
    document.getElementById('game-board').classList.add('hidden');
    document.querySelector('.button-container').classList.add('hidden');
}

function initializeBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards = generateCards();
    shuffle(cards);

    // Apskaičiuojame stulpelių skaičių
    const totalCards = cards.length;
    const columns = Math.ceil(Math.sqrt(totalCards));

    // Nustatome tinklelio stulpelių skaičių
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        gameBoard.appendChild(cardElement);
    });
}

function generateCards() {
    const images = [
        'assets/img1.png', 'assets/img2.png', 'assets/img3.png', 'assets/img4.png',
        'assets/img5.png', 'assets/img6.png', 'assets/img7.png', 'assets/img8.png',
        'assets/img9.png', 'assets/img10.png'
    ];

    const selectedImages = images; // Naudojame tuos pačius paveikslėlius

    const cards = [];
    selectedImages.forEach(image => {
        for (let i = 0; i < cardsToMatch; i++) {
            cards.push({ image });
        }
    });

    return cards;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.image = card.image;
    cardElement.innerHTML = `
        <div class="card-inner">
            <div class="front"></div>
            <div class="back">
                <img src="${card.image}" alt="Card image" draggable="false">
            </div>
        </div>
    `;
    cardElement.addEventListener('click', () => flipCard(cardElement));
    return cardElement;
}

function flipCard(cardElement) {
    if (flippedCards.length < cardsToMatch && !cardElement.classList.contains('flip')) {
        cardElement.classList.add('flip');
        flippedCards.push(cardElement);
        if (flippedCards.length === cardsToMatch) {
            setTimeout(checkForMatch, 500);
        }
    }
}

function checkForMatch() {
    const firstCardImage = flippedCards[0].dataset.image;
    const isMatch = flippedCards.every(card => card.dataset.image === firstCardImage);

    if (isMatch) {
        matchedPairs++;
        score += 10;
        flippedCards = [];

        const totalMatchesRequired = cards.length / cardsToMatch;
        if (matchedPairs === totalMatchesRequired) {
            endGame();
        }
    } else {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flip'));
            flippedCards = [];
        }, 1000);
    }
    document.getElementById('score').textContent = `Taškai: ${score}`;
}

function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = `Laikas: ${elapsedTime}s`;
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const playerName = sessionStorage.getItem('playerName');
    saveGameSession(playerName, score, elapsedTime);

    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    requestAnimationFrame(() => {
        popup.classList.add('visible');
    });
}

function saveGameSession(playerName, score, time) {
    const gameSession = { playerName, score, time };
    let gameHistory = [];
    try {
        gameHistory = JSON.parse(sessionStorage.getItem('gameHistory')) || [];
    } catch (e) {
        console.error('Nepavyko gauti žaidimo istorijos iš sessionStorage', e);
    }
    gameHistory.push(gameSession);
    gameHistory.sort((a, b) => b.score - a.score || a.time - b.time);
    try {
        sessionStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch (e) {
        console.error('Nepavyko įrašyti žaidimo istorijos į sessionStorage', e);
    }
    displayGameHistory();
}

function displayGameHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    const gameHistory = JSON.parse(sessionStorage.getItem('gameHistory')) || [];
    
    if (gameHistory.length === 0) {
        const noHistoryMessage = document.createElement('li');
        noHistoryMessage.textContent = 'Nėra žaidimo istorijos';
        historyList.appendChild(noHistoryMessage);
    } else {
        gameHistory.forEach(session => {
            const listItem = document.createElement('li');
            listItem.textContent = `${session.playerName} - Taškai: ${session.score}, Laikas: ${session.time}s`;
            historyList.appendChild(listItem);
        });
    }
}

function replayGame() {
    const popup = document.getElementById('popup');
    popup.classList.remove('visible');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 300);

    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    document.getElementById('score').textContent = `Taškai: ${score}`;
    document.getElementById('time').textContent = `Laikas: 0s`;

    const difficultyLevel = document.getElementById('difficulty-level').value;

    switch (difficultyLevel) {
        case 'easy':
            cardsToMatch = 2;
            break;
        case 'medium':
            cardsToMatch = 3;
            break;
        case 'hard':
            cardsToMatch = 4;
            break;
        default:
            cardsToMatch = 2;
    }

    initializeBoard();
    startTimer();
}