document.addEventListener('DOMContentLoaded', () => {
    const joinBtn = document.getElementById("joinRoom") 
    const nameInput = document.getElementById("name")
    const roomInput = document.getElementById("roomCode")

    loadSavedValues()
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    if (roomCode) {
        roomInput.value = roomCode;
    }

    function loadSavedValues() {
        const playerName = sessionStorage.getItem('playerName');
        if (playerName) {
            document.getElementById('name').value = playerName;
        }
    }

    function displayError(message) {
        document.getElementById('errorDsp').textContent = message;
    }
    function joinGame(){
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
    }

    joinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        joinGame();
    });

    document.addEventListener('keyup',(e)=>{
        e.key === 'Enter' ? joinGame() : null;
        
    })
});

