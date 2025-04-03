// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Expand the web app to full size
tg.expand();

// Get DOM elements
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const createGameButton = document.getElementById('createGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const inviteButton = document.getElementById('inviteButton');
const descriptionInput = document.getElementById('descriptionInput');
const submitButton = document.getElementById('submitButton');
const startButton = document.getElementById('startButton');
const descriptionsList = document.getElementById('descriptionsList');

// Game state
let currentSession = null;
let descriptions = [];
let currentRound = 1;
let isHost = false;

// Get user info from Telegram
const user = tg.initDataUnsafe.user || { first_name: 'Anonymous' };

// Generate a random game code
function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Create a new game session
function createGame() {
    const gameCode = generateGameCode();
    currentSession = gameCode;
    isHost = true;
    gameCodeDisplay.textContent = gameCode;
    showGameScreen();
}

// Join an existing game session
function joinGame() {
    const gameCode = gameCodeInput.value.trim().toUpperCase();
    if (gameCode.length === 6) {
        currentSession = gameCode;
        isHost = false;
        gameCodeDisplay.textContent = gameCode;
        showGameScreen();
    } else {
        alert('Please enter a valid 6-character game code');
    }
}

// Show the game screen and hide welcome screen
function showGameScreen() {
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

// Handle invite button click
inviteButton.addEventListener('click', () => {
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(window.location.href + '?game=' + currentSession)}`;
    tg.showPopup({
        title: 'Invite Players',
        message: `Share this link with your friends to join the game!\n\nGame Code: ${currentSession}`,
        buttons: [
            { type: 'default', text: 'Share in Group' },
            { type: 'default', text: 'Share in Private Message' }
        ]
    }, (buttonId) => {
        if (buttonId === 0) {
            window.open(inviteLink, '_blank');
        } else if (buttonId === 1) {
            window.open(inviteLink, '_blank');
        }
    });
});

// Handle description submission
submitButton.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    if (description) {
        // Add description to the list
        descriptions.push({
            text: description,
            author: user.first_name,
            round: currentRound,
            session: currentSession
        });

        // Clear input
        descriptionInput.value = '';

        // Update display
        updateDescriptionsList();
    }
});

// Handle start new round
startButton.addEventListener('click', () => {
    if (isHost) {
        currentRound++;
        descriptions = descriptions.filter(desc => desc.round === currentRound - 1);
        updateDescriptionsList();
    } else {
        alert('Only the host can start a new round');
    }
});

// Update the descriptions list display
function updateDescriptionsList() {
    descriptionsList.innerHTML = '';
    
    descriptions
        .filter(desc => desc.session === currentSession)
        .forEach(desc => {
            const descriptionItem = document.createElement('div');
            descriptionItem.className = 'description-item';
            
            const descriptionText = document.createElement('p');
            descriptionText.textContent = desc.text;
            
            const authorInfo = document.createElement('div');
            authorInfo.className = 'author';
            authorInfo.textContent = `By ${desc.author} (Round ${desc.round})`;
            
            descriptionItem.appendChild(descriptionText);
            descriptionItem.appendChild(authorInfo);
            descriptionsList.appendChild(descriptionItem);
        });
}

// Event listeners
createGameButton.addEventListener('click', createGame);
joinGameButton.addEventListener('click', joinGame);

// Check for game code in URL
const urlParams = new URLSearchParams(window.location.search);
const gameCodeFromUrl = urlParams.get('game');
if (gameCodeFromUrl) {
    gameCodeInput.value = gameCodeFromUrl;
    joinGame();
}

// Initialize the game
updateDescriptionsList();

// You can access Telegram user data like this:
// const user = tg.initDataUnsafe.user;
// console.log(user); 