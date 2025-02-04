document.addEventListener('DOMContentLoaded', () => {
    const joinBtn = document.getElementById("joinRoom") 
    const nameInput = document.getElementById("name")
    const roomInput = document.getElementById("roomCode")
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
        roomInput.value = roomCode;
    }

    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        var playerName = nameInput.value.trim();
        var roomCode = roomInput.value.trim();
        
        // Validate name
        if (!playerName || playerName.length < 3) {
            displayError('Name must be at least 3 characters');
            return;
        }
        
        // Validate room code format
        if (!roomCode) {
            displayError('Invalid room code format');
            return;
        }
        
        // Store in session
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('roomCode', roomCode);
        
        // Navigate to game room
        window.location.href = '../game-room/game-room.html';
    });
});

function displayError(message) {
    document.getElementById('errorDsp').textContent = message;
}