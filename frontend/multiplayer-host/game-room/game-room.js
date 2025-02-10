import { handleStart } from "./gameManager.js";
let  gamemodeLbl = null
document.addEventListener('DOMContentLoaded', () => {
    const playerName = sessionStorage.getItem('playerName');
    const start = document.getElementById("new-game")
    const copyLinkBtn = document.getElementById("copy-join-link")
    gamemodeLbl = document.getElementById("gamemode")


    start.addEventListener('click',() =>{
        handleStart()
    })
    copyLinkBtn.addEventListener('click',()=>{
        copyJoinLink()
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

export function setGamemodeLbl(text){
    gamemodeLbl.textContent = text
}


