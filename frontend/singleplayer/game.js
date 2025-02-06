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
    updateWins()
    updateGamePlayed()
});

function checkValues(){
    let gridSize = parseInt(document.getElementById('grid-size').value);
    let bombCount = parseInt(document.getElementById('bomb-count').value);
    if (gridSize && gridSize > 50){
        displayError("Grid size too large")
        document.getElementById('grid-size').value = null
        return false
    }
    else if(gridSize && gridSize < 10){
        displayError("Grid size too small")
        document.getElementById('grid-size').value = null
        return false
    }
    else if (bombCount < 1){
        displayError("Invalid Bomb Count")
        document.getElementById('bomb-count').value = null
        return false
    }
    else{
        return true
    }
}
function displayError(error){
    document.getElementById('Error').textContent = error
}
function initGame(){
    let gridSize = parseInt(document.getElementById('grid-size').value) || 10;
    gameDimensions[0] = gridSize;
    gameDimensions[1] = gridSize;

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

    const { tileSize, containerSize } = calculateGridSize();

    const gridElement = document.getElementById('grid');
    gridElement.style.setProperty('--grid-cols', game.gridWidth);
    gridElement.style.setProperty('--tile-size', `${tileSize}px`);
    gridElement.style.setProperty('--container-size', `${containerSize}px`);
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
function calculateGridSize() {
    // Get viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // Calculate available space (accounting for UI elements)
    const headerHeight = 100; // Adjust based on your header
    const uiPadding = 40;
    const availableWidth = vw - uiPadding;
    const availableHeight = vh - headerHeight - uiPadding;

    // Determine optimal container size
    const maxContainerSize = Math.min(
        availableWidth,
        availableHeight,
        1000 // Maximum allowed size
    );

    // Calculate tile size based on grid density
    const gridDensity = Math.max(gameDimensions[0], gameDimensions[1]);
    const minTileSize = 30; // Minimum tile size
    const optimalTileSize = Math.max(
        minTileSize,
        Math.floor((maxContainerSize * 0.9) / gridDensity)
    );

    return {
        tileSize: optimalTileSize,
        containerSize: optimalTileSize * gridDensity
    };
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
            addWin();
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
    if(checkValues()){
        displayError("")
        incrementGamesPlayedCounter()
        initGame();
        createGrid();
        document.getElementById('gameArea').style.visibility = 'visible'
        scrollToBottom()
    }
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !game.getFlagMode()) {
        game.toggleFlag();
        statusDisplay.style.backgroundColor = 'rgba(255, 103, 98, 0.11)'
    }
});
window.addEventListener('keyup', (e) => {    if (e.key === 'Shift' && game.getFlagMode()) {
        game.toggleFlag();
        statusDisplay.style.backgroundColor = 'rgba(255, 103, 98, 0)'
    }
});

// stat tracking
function updateWins(){
    let winCount = localStorage.getItem("winCount");
    let winCountDisplay = document.getElementById('wins');
    //console.log(winCount)
    if(winCount){
        winCountDisplay.textContent = 'Wins: ' + winCount;
    }
}
function addWin(){
    let winCount = localStorage.getItem("winCount");
    if(winCount){
        var winCountInt = parseInt(winCount);
        winCountInt = winCountInt + 1;
        localStorage.setItem("winCount", winCountInt)
        updateWins()
    }
    else{
        localStorage.setItem("winCount", "1")
        updateWins()
    }
}
function updateGamePlayed(){
    let gamesPlayed= localStorage.getItem("gamesPlayed");
    let gamesPlayedDisplay = document.getElementById('gamesPlayed');
    if(gamesPlayed){
        gamesPlayedDisplay.textContent = 'Game Played: ' + gamesPlayed;
    }
}
function incrementGamesPlayedCounter(){
    let gamesCount= localStorage.getItem("gamesPlayed");
    if(gamesCount){
        var gamesCountInt= parseInt(gamesCount);
        gamesCountInt = gamesCountInt+ 1;
        localStorage.setItem("gamesPlayed", gamesCountInt);
        updateGamePlayed();
    }
    else{
        localStorage.setItem("gamesPlayed", "1")
        updateWins()
    }
}