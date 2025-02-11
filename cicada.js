export function minesweeper(width,length, gameBombCount, inputGrid = null ){
    const gridWidth = width;
    const gridLength = length;
    const bombCount = gameBombCount
    const grid = inputGrid || generateBoard()
    calculateMines()
    const revealedTiles = []
    const flaggedTiles = []
    var flagMode = false
    var initReveal = true

    // should add in seeded generation, so no need to send 
    // entire board
    function generateBoard(){
        // Make an empty table
        let board = new Array(gridLength);
        for (let i = 0; i < board.length; i++){
            board[i] = new Array(gridWidth);
        }

        // Place the bombs
        let remainingBombs = bombCount;
        while (remainingBombs > 0){
            let x = Math.floor(Math.random() * gridWidth);
            let y = Math.floor(Math.random() * gridLength);
            
            if (board[y][x]){
                continue;
            }
            else{
                board[y][x] = 'x';
                remainingBombs = remainingBombs - 1;
            }
        }  
        return board;
    }
    function revealTile(coords){
        // if the user clicks on the mine on their first reveal, move the mine
        if (initReveal){
            initReveal = false
            // 3x3 radius of the initial click should be clear
            let clearSpace = []
            let firstClickMines = []
            // iterate through a 3x3 area around the click
            for(let i = -1; i <= 1; i++){
                for (let j = -1; j <= 1; j++){
                    let x = coords[1] + j;
                    let y = coords[0] + i;
                    clearSpace.push([x,y])
                    if (getTile([y,x]) == 'x'){
                        firstClickMines.push([y,x])
                    }
                }
            }
            // console.log("mine on initial click: ", firstClickMines)
            // console.log("clear space", clearSpace)
            //move all the bombs away from initial click
            for(let i = 0; i < firstClickMines.length; i++){
                moveMine(firstClickMines[i],clearSpace)
            }
            calculateMines()
        }

        // Check if there is a flag
        if (containsCoords(flaggedTiles, coords) > -1){
            //console.log("Tile",coords,"is flagged, cannot reveal")
            return
        }
        
        if(grid[coords[0]][coords[1]] == 'x'){
            return 'x'
        }
        
        // If the tile is a number only reveal that tile
        if (grid[coords[0]][coords[1]]){
            if (containsCoords(revealedTiles, coords) < 0){
                revealedTiles.push(coords);
            }
            //console.log("clicked on something",coords,"|", grid[coords[0]][coords[1]])
            if (checkWin()){
                return "winner"
            }
            return grid[coords[0]][coords[1]];
        }
        floodReveal(coords);
        //console.log("flood reveal:", revealedTiles)
        if (checkWin()){
            return "winner"
        }
        return grid[coords[0]][coords[1]];
    }
    // recursive for now, maybe should use queue for better performance
    function floodReveal(origin){
        let directions = [
            [origin[0]-1, origin[1]],   // UP 
            [origin[0]-1, origin[1]+1], // Northeast
            [origin[0], origin[1]+1],   // East
            [origin[0]+1, origin[1]+1], // Southeast
            [origin[0]+1, origin[1]],   // South
            [origin[0]+1, origin[1]-1], // Southwest
            [origin[0], origin[1]-1],   // West
            [origin[0]-1, origin[1]-1]  // Northwest
        ];
        
        directions.forEach(node => floodRevealTile(node));
    
        if (containsCoords(revealedTiles, origin) < 0){
            revealedTiles.push(origin);
        }
    }

    // fix bug where the initial click is a number
    function floodRevealTile(origin){
        // Check if coordinate is valid 
        if (origin[0] > gridLength-1 || origin[1] > gridWidth-1 || origin[0] < 0 || origin[1] < 0) {
          //  console.log("Error click",origin,"out of bounds")
            return {'error': 'coordinate out of bounds'};
        }

        if (containsCoords(revealedTiles, origin) == -1){
            if (grid[origin[0]][origin[1]] == 'x'){
                return origin;
            }

            if (containsCoords(revealedTiles, origin) < 0){
                revealedTiles.push(origin);
            }

            // remove the flag if there is one on the tile
            let flagCoord = containsCoords(flaggedTiles, origin) ;
            if (flagCoord >= 0){
                //console.log("removed flag at:", flaggedTiles[flagCoord])
                flaggedTiles.splice(flagCoord,1)
            }
            
            if ((typeof grid[origin[0]][origin[1]] == 'number') && grid[origin[0]][origin[1]] > 0 ){
                return origin
            }
            else{
                floodReveal(origin)
            }
        }
        return origin
    }
    function handleFlag(coords){
        if(initReveal){
            return
        }
        let flagIndex = containsCoords(flaggedTiles, coords)
        if (flagIndex > -1){
            flaggedTiles.splice(flagIndex, 1);
            //console.log("The flag at", coords, "has been removed")
        }
        else{
            flaggedTiles.push(coords)
            //console.log("Added flag at", coords)
        }
        return
    }
    function flagTile(coords){
        // Check if coordinate is valid
        if (coords[0] > gridLength || coords[1] > gridWidth) {
            return {'error': 'coordinate out of bounds'};
        }
        // Check if the tile has already been revealed
        if (containsCoords(revealedTiles,coords) > -1){
            //console.log("Tile has already been revealed")
            return
        }
        flaggedTiles.push(coords)
    }
    function removeFlag(coords){
       let flagIndex = containsCoords(flaggedTiles, coords)
        if (flagIndex > -1){
            flaggedTiles.splice(flagIndex, 1);
            //console.log("The flag at", coords, "has been removed")
        }
        else{
            //console.log("This tile does not have a flag!")
        }
    }
    function getTile(coords){
        if (coords[0] > gridLength-1 || coords[1] > gridWidth-1 || coords[0] < 0 || coords[1] < 0){
            return null;
        } 
        return grid[coords[0]][coords[1]];
    }
    function getFlagMode(){
        return flagMode
    }
    function sameCoords(c1,c2){
        return c1[0] == c2[0] && c1[1] == c2[1]
    }
    function containsCoords(arr, coord){
        for (let i = 0; i < arr.length; i++){
            let c1 = arr[i]
            if (sameCoords(c1, coord)){
                return i 
            }
        }
        return -1 
    }
    function clickTile(coords){
        //console.log('clicking on:', coords)
       // console.log(revealedTiles)
        // Check if coordinate is valid 
        if (coords[0] > gridLength-1 || coords[1] > gridWidth-1 || coords[0] < 0 || coords[1] < 0) {
            //console.log("Error click",coords,"out of bounds")
            return {'error': 'coordinate out of bounds'};
        }
        // check if the tile has already been revealed
        if (containsCoords(revealedTiles,coords) > -1){
            //console.log("Tile has already been revealed")
            return
        }
        if (flagMode) {
            //console.log("flagging:", coords)
            handleFlag(coords)
        }
        else{
            //console.log('checking tile:', coords)
            return revealTile(coords)
        }
    }
    function toggleFlag(){
        if (flagMode){
            //console.log("flag mode off")
            flagMode = false
        }
        else{
            //console.log("flag mode on")
            flagMode = true ;
        }
    }
    function checkWin(){
        let area = gridWidth * gridLength;
        let revealCount = revealedTiles.length
       // console.log("area:", area, "revealed:", revealCount, "bomb count:", bombCount)
        if ((area - revealCount) == bombCount){
            return 'Complete'
        }
        else{
            return 
        }
    }
    function moveMine(coords,safeArea){
        let emptySpace = null
        // find the first empty space
        for(let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if ((!grid[i][j] || typeof grid[i][j] == 'number') && (containsCoords(safeArea, [i,j]) == -1)){
                    emptySpace = [i,j]
                    //console.log("empty space found:", emptySpace)
                    break;
                }
            }
            if (emptySpace){
                break;
            }
        }
        grid[emptySpace[0]][emptySpace[1]] = "x"
        grid[coords[0]][coords[1]] = '?'
        //console.log("moved mine from",coords, "to", emptySpace)
    }
    function calculateMines(){
        // reset the counts
        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if (!(grid[i][j] == 'x')){
                    grid[i][j] = 0
                }
            }
        } 
        for (let i = 0; i < grid.length; i++){
            for (let j = 0; j < grid[i].length; j++){
                if (grid[i][j] == "x"){
                    // to left
                    incrementMineCount([i,j-1])
                    //to the right
                    incrementMineCount([i,j+1])
                    //above
                    incrementMineCount([i-1,j])
                    //below
                    incrementMineCount([i+1,j])
                    //TL corner
                    incrementMineCount([i-1,j-1])
                    //TR corner
                    incrementMineCount([i-1,j+1])
                    // BR corner
                    incrementMineCount([i+1,j+1])
                    //BL corner
                    incrementMineCount([i+1, j-1])
                }
            }
        }
    }
    function incrementMineCount(coords){
        if (coords[0] > gridLength-1 || coords[1] > gridWidth-1 
            || coords[0] < 0 || coords[1] < 0 
            || grid[coords[0]][coords[1]] == 'x') {
            return 
        }
        else{
            if ( typeof grid[coords[0]][coords[1]] === 'number'){
                grid[coords[0]][coords[1]] += 1
            }
            else{
                grid[coords[0]][coords[1]] = 1
            }
        }
    }
    return {
        grid,
        revealedTiles,
        flaggedTiles,
        gridWidth,
        gridLength,
        bombCount,
        flagMode,
        revealTile,
        flagTile,
        removeFlag,
        getTile,
        getFlagMode,
        toggleFlag,
        clickTile,
        handleFlag 
    }
    // don't think should leave flag and remove flag exposed to user
}
//module.exports = {minesweeper}