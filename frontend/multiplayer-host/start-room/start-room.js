document.addEventListener('DOMContentLoaded', () => {
    loadSavedValues();
    
    const startButton = document.querySelector('button');
    
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const playerName = document.getElementById('player-name').value;
        const gridSize = parseInt(document.getElementById('grid-size').value);
        const roomSize = parseInt(document.getElementById('room-size').value);
        
        // Validation
        if (!playerName || playerName.length < 3) {
            displayError('Please enter a name (minimum 3 characters)');
            return false;
        }
        
        if (!gridSize || gridSize < 10 || gridSize > 50) {
            displayError('Grid size must be between 10 and 50');
            return false;
        }
        
        if (!roomSize || roomSize < 2 || roomSize > 5) {
            displayError('Room size must be between 2 and 5 players');
            return false;
        }
        
        // Store in sessionStorage
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('gridSize', gridSize);
        sessionStorage.setItem('roomSize', roomSize);
        sessionStorage.setItem('gameMode', 'Co-op');
        
        // Navigate to game room
        window.location.href = '../game-room/game-room.html';
    });
    function loadSavedValues() {
        const playerName = sessionStorage.getItem('playerName');
        const gridSize = sessionStorage.getItem('gridSize');
        const roomSize = sessionStorage.getItem('roomSize');
        
        if (playerName) {
            document.getElementById('player-name').value = playerName;
        }
        if (gridSize) {
            document.getElementById('grid-size').value = gridSize;
        }
        if (roomSize) {
            document.getElementById('room-size').value = roomSize;
        }
    }
});
function displayError(msg){
    let errorDsp = document.getElementById("errorDisplay");
    errorDsp.textContent = msg;
}