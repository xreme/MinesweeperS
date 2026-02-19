import { handleStart } from "./gameManager.js";
let gamemodeLbl = null
document.addEventListener('DOMContentLoaded', () => {
    const playerName = sessionStorage.getItem('playerName');
    const start = document.getElementById("new-game")
    const copyLinkBtn = document.getElementById("copy-join-link")
    const copyRoomCodeBtn = document.getElementById("copy-room-code")
    gamemodeLbl = document.getElementById("gamemode")


    start.addEventListener('click', () => {
        handleStart()
    })
    copyLinkBtn.addEventListener('click', () => {
        copyJoinLink()
    })
    copyRoomCodeBtn.addEventListener('click', () => {
        copyRoomCode()
    })

    if (!playerName) {
        window.location.href = '../start-room/start-room.html';
        return;
    }


});

function copyJoinLink() {
    const roomCode = document.getElementById('host-id').textContent;
    // prod
    const joinURL = `${window.location.origin}/MinesweeperS/frontend/multiplayer-client/join-room/join-room.html?room=${roomCode}`;

    //local
    //const joinURL = `${window.location.origin}/frontend/multiplayer-client/join-room/join-room.html?room=${roomCode}`;

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

function copyRoomCode() {
    const roomCode = document.getElementById('host-id').textContent;
    navigator.clipboard.writeText(roomCode)
        .then(() => {
            const copyBtn = document.getElementById('copy-room-code');
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>`;
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

export function setGamemodeLbl(text) {
    gamemodeLbl.textContent = text
}


