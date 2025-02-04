document.addEventListener('DOMContentLoaded', () => {
    // Check for required session data
    const playerName = sessionStorage.getItem('playerName');
    // const gridSize = sessionStorage.getItem('gridSize');
    // const roomSize = sessionStorage.getItem('roomSize');

    if (!playerName) {
        window.location.href = '../start-room/start-room.html';
        return;
    }

    // // Update page content with session data
    // document.querySelector('h1').textContent = `${playerName}'s Room`;
    // document.getElementById('room-details').innerHTML = `
    //     Grid Size: ${gridSize}x${gridSize}<br>
    //     Max Players: ${roomSize}<br>
    //     Game Mode: ${sessionStorage.getItem('gameMode') || 'Co-op'}
    // `;

});

function copyJoinLink() {
    const roomCode = document.getElementById('host-id').textContent;
    const joinURL = `${window.location.origin}/frontend/multiplayer-client/join-room/join-room.html?room=${roomCode}`;
    
    navigator.clipboard.writeText(joinURL)
        .then(() => {
            const copyBtn = document.getElementById('copy-join-link');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Link';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

