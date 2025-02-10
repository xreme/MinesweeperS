document.addEventListener('DOMContentLoaded', () => {
    loadSavedValues();
    const startButton = document.querySelector('button');
    
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const playerName = document.getElementById('player-name').value;
        
        // Validation
        if (!playerName || playerName.length < 3) {
            displayError('Please enter a name (minimum 3 characters)');
            return false;
        }
        // Store in sessionStorage
        sessionStorage.setItem('playerName', playerName);
        
        // Navigate to game room
        window.location.href = '../game-room/game-room.html';
    });
    function loadSavedValues() {
        const playerName = sessionStorage.getItem('playerName');
        
        if (playerName) {
            document.getElementById('player-name').value = playerName;
        }
    }
    function startGame(){
        const playerName = document.getElementById('player-name').value;
        // Validation
        if (!playerName || playerName.length < 3) {
            displayError('Please enter a name (minimum 3 characters)');
            return false;
        }
    }
    function startGame(){
        const playerName = document.getElementById('player-name').value;
        // Validation
        if (!playerName || playerName.length < 3) {
            displayError('Please enter a name (minimum 3 characters)');
            return false;
        }
        sessionStorage.setItem('playerName', playerName);
        window.location.href = '../game-room/game-room.html';
    }
    document.addEventListener('keypress',(e)=>{
        e.key === 'Enter' ? startGame() : null;
    })
    startButton.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
    });
});
function displayError(msg){
    let errorDsp = document.getElementById("errorDisplay");
    errorDsp.textContent = msg;
}