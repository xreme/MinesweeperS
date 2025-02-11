var game = null;;
var flagsPlaced;
var remainingBombs;
var allowPlay = true;
var gamemode = null
var handleTileClick = null
let startTime;
let timerInterval;
let statusDisplay = document.getElementById('toggle-flag');

var handleLoss = null
var handleWin = null

export function startGame(newGame, winCallback, loseCallback,inGamemode, handleClick){
    game = newGame
    handleLoss = loseCallback
    handleWin = winCallback
    gamemode = inGamemode 
    handleTileClick = handleClick
    createGrid()
    startTimer()
    scrollToBottom()
}
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(updateGameStats, 1000);
}
function updateGameStats() {
    var timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    flagsPlaced = game.flaggedTiles.length;
    remainingBombs = game.bombCount - flagsPlaced;

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
    for(let i = 0; i < game.gridLength; i++) {
        for(let j = 0; j < game.gridWidth; j++) {
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

    const availableWidth = vw
    const availableHeight = vh
    console.log(vh,vw)
    // Determine optimal container size
    const maxContainerSize = Math.min(
        availableWidth,
        availableHeight,
        1000 // Maximum allowed size
    );
    console.log(maxContainerSize)
    // Calculate tile size based on grid density
    // Calculate tile size based on grid density
    const gridDensity = Math.max(game.gridLength, game.gridWidth);
    const minTileSize = 20; 
    console.log(Math.floor((maxContainerSize * 0.9) / gridDensity) )
    const optimalTileSize = Math.max(
        minTileSize,
        Math.floor((maxContainerSize * 0.85) / gridDensity)
    );

    return {
        tileSize: optimalTileSize-5,
        containerSize: optimalTileSize * gridDensity
    };
}
function handleClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (handleTileClick){
        handleTileClick({
            row:row,
            col: col,
            flagMode: game.getFlagMode()
        })
    }
    else{
        if(game.getFlagMode()) {
            game.clickTile([row, col]);
        } else {
            const result = game.clickTile([row, col]);
            if(result === 'x') {
                lose()
                return;
            } else if(result === 'winner') {
                win()
                return
            }
        }
        updateBoard();
    }
}
export function clickTile(inRow,inCol, flag){
    let row = parseInt(inRow)
    let col = parseInt(inCol)

    if(flag) {
        game.handleFlag([row,col])
    } else {
        const result = game.clickTile([row, col]);
        if(result === 'x') {
            lose()
            return;
        } else if(result === 'winner') {
            win()
            return
        }
    }
    statusDisplay.style.backgroundColor = (game.getFlagMode() ? 'rgba(255, 103, 98, 0.11)' : 'rgba(255, 103, 98, 0)')
    updateBoard();
}
function lose(){
    showFullBoard();
    var timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    handleLoss({
        result: 'lost',
        time: timeElapsed
    });
}
function win(){
    showFullBoard();
    var timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    handleWin({
        result: 'win',
        time: timeElapsed
    });
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