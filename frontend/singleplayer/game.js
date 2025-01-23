import { minesweeper } from '../../cicada.js';
// default values
var gameDimensions = [10,10];
var mineCount = 20;
var game = minesweeper(gameDimensions[0],gameDimensions[1], mineCount);
const statusDisplay = document.getElementById('toggle-flag');
var allowPlay = true;
var flagsPlaced;
var remainingBombs;


let startTime;
let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('easy').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('medium').addEventListener('click', () => setDifficulty('medium'));
    document.getElementById('hard').addEventListener('click', () => setDifficulty('hard'));
    scrollToTop()
});


function initGame(){
    let gridSize = parseInt(document.getElementById('grid-size').value) || 10;

    if (gridSize < 5 || gridSize > 50){
        gameDimensions[0] = 10;
        gameDimensions[1] = 10;
        console.log("dimensions set")
    }
    else{
        gameDimensions[0] = gridSize;
        gameDimensions[1] = gridSize;
    }

    let inputMineCount = parseInt(document.getElementById('bomb-count').value) || Math.floor((gridSize*gridSize) * 0.1);
    // Update global mineCount
    mineCount = inputMineCount;
    if(mineCount > Math.floor((gridSize*gridSize) * 0.3)){
        mineCount = Math.floor((gridSize*gridSize) * 0.3);
    }

    
    game = minesweeper(gameDimensions[0], gameDimensions[1], mineCount);
    createGrid();
    startTimer();
    updateGameStats();
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateGameStats, 1000);
}

function updateGameStats() {
    var timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    flagsPlaced = game.flaggedTiles.length;
    remainingBombs = mineCount - flagsPlaced;
//    console.log("stsats") 
//    console.log(gameDimensions)
//    console.log(mineCount)
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    document.getElementById('bomb-counter').textContent = `Bombs: ${remainingBombs}`;
    document.getElementById('flag-counter').textContent = `Flags: ${flagsPlaced}`;
}


function createGrid(){
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    const maxGridSize = Math.max(gameDimensions[0], gameDimensions[1]);
    const deviceWidth = window.innerWidth - 40
    const deviceHeight = window.innerHeight - 40
    let minSize = Math.min(deviceWidth, deviceHeight, 1000)
    const calculatedSize = Math.max(30, Math.floor((minSize*0.85)/maxGridSize));

    const gridElement = document.getElementById('grid');
    gridElement.style.setProperty('--grid-cols', game.gridWidth);
    gridElement.style.setProperty('--tile-size', `${calculatedSize}px`);
    for(let i = 0; i < gameDimensions[0]; i++) {
        for(let j = 0; j < gameDimensions[1]; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.addEventListener('click', handleClick);
            grid.appendChild(tile);
        }
    }
}
function handleClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if(game.getFlagMode()) {
        game.clickTile([row, col]);
    } else {
        const result = game.clickTile([row, col]);
        if(result === 'x') {
            showFullBoard();
            alert('Game Over!');
            return
        } else if(result === 'winner') {
            showFullBoard();
            alert('You Win!');
            return
        }
    }
    updateBoard();
}
function updateBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        
        // Clear previous state
        tile.textContent = '';
        tile.className = 'tile';

        // Check if tile is revealed
        const isRevealed = game.revealedTiles.some(coords => 
            coords[0] === row && coords[1] === col
        );

        // Check if tile is flagged
        const isFlagged = game.flaggedTiles.some(coords => 
            coords[0] === row && coords[1] === col
        );

        if (isRevealed) {
            tile.classList.add('revealed');
            const value = game.getTile([row, col]);
            if (typeof value === 'number') {
                value == 0 ? tile.setAttribute('data-value',' ') : tile.setAttribute('data-value', value);
            }
            value == 0 ? tile.textContent = '' : tile.textContent = value;
        } else if (isFlagged) {
            tile.classList.add('flagged');
            tile.textContent = '🚩';
        } else {
            tile.textContent = '?';
        }
    });
}
function showFullBoard(){
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile =>{
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        
        tile.classList.add('revealed');
        tile.removeEventListener('click', handleClick);
        var value = game.getTile([row, col]); 
        tile.textContent = value == 0 ? ' ' : value;
        value == 'x' ? tile.style.backgroundColor = 'red' : null

    })    
    clearInterval(timerInterval);
    scrollToTop()
}

function setDifficulty(level) {
switch(level) {
    case 'easy':
        document.getElementById('grid-size').value = 10;
        document.getElementById('bomb-count').value = 10;
        break;
    case 'medium':
        document.getElementById('grid-size').value = 16;
        document.getElementById('bomb-count').value = 40;
        break;
    case 'hard':
        document.getElementById('grid-size').value = 30;
        document.getElementById('bomb-count').value = 99;
        break;
    }
}
function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
document.getElementById('toggle-flag').addEventListener('click', () => {
    game.toggleFlag();
    statusDisplay.style.backgroundColor= (game.getFlagMode() ? 'rgba(255, 103, 98, 0.11)' : 'rgba(255, 103, 98, 0)')
});

document.getElementById('new-game').addEventListener('click', () => {
    initGame();
    //console.log(game)
    createGrid();
    document.getElementById('gameArea').style.visibility = 'visible'
    scrollToBottom()
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !game.getFlagMode()) {
        game.toggleFlag();
        statusDisplay.style.backgroundColor = 'rgba(255, 103, 98, 0.11)'
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift' && game.getFlagMode()) {
        game.toggleFlag();
        statusDisplay.style.backgroundColor = 'rgba(255, 103, 98, 0)'
    }
});
