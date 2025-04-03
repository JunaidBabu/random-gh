// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Expand the web app to full size
tg.expand();

// Get DOM elements
const descriptionInput = document.getElementById('descriptionInput');
const submitButton = document.getElementById('submitButton');
const startButton = document.getElementById('startButton');
const descriptionsList = document.getElementById('descriptionsList');

// Store descriptions
let descriptions = [];
let currentRound = 1;

// Get user info from Telegram
const user = tg.initDataUnsafe.user || { first_name: 'Anonymous' };

// Handle description submission
submitButton.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    if (description) {
        // Add description to the list
        descriptions.push({
            text: description,
            author: user.first_name,
            round: currentRound
        });

        // Clear input
        descriptionInput.value = '';

        // Update display
        updateDescriptionsList();
    }
});

// Handle start new round
startButton.addEventListener('click', () => {
    currentRound++;
    descriptions = descriptions.filter(desc => desc.round === currentRound - 1);
    updateDescriptionsList();
});

// Update the descriptions list display
function updateDescriptionsList() {
    descriptionsList.innerHTML = '';
    
    descriptions.forEach(desc => {
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

// Initialize the game
updateDescriptionsList();

// You can access Telegram user data like this:
// const user = tg.initDataUnsafe.user;
// console.log(user); 