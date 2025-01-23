function render(game){

    var view  = []
    var fullView = []
    var nums = []

    for (let i = 0; i < game.gridLength; i++){
        view[i] = [];
        fullView[i] = []
        for(let j = 0; j < game.gridWidth; j++){
            view[i].push("-");
            fullView[i].push("0")
        }
    }
    
    revealedTiles = game.revealedTiles
    flaggedTiles = game.flaggedTiles


    // console.log("revealed:")
    for (let i = 0; i < revealedTiles.length; i++){
        //console.log(revealedTiles[i]);
        // if there is something at the spot display the item
        if (game.getTile(revealedTiles[i])){
            view[revealedTiles[i][0]][revealedTiles[i][1]] = game.getTile(revealedTiles[i]) +"";
        }
        // check for adjacent bombs
        else{
            view[revealedTiles[i][0]][revealedTiles[i][1]] = " ";
        }
    }

    //display the full board
    fullBoard = game.grid;
    for (let i = 0; i < fullBoard.length; i++){
        for (let j = 0; j < fullBoard[i].length; j++ ){
            if (fullBoard[i][j]){
                fullView[i][j] = fullBoard[i][j] +""
            }
        }
    }

    for (let i = 0; i < game.gridLength; i++){
        nums[i] = i+"";
    }
    view.push(nums)

    console.log("Flagged:")
    for (let i = 0; i < flaggedTiles.length; i++){
        console.log(flaggedTiles[i]);
        view[flaggedTiles[i][0]][flaggedTiles[i][1]] = "F";
        //fullView[flaggedTiles[i][0]][flaggedTiles[i][1]] = "F";
    }
    // console.log("revealed: ",game.revealedTiles)
    console.log("player view:")
    console.log(view) 
    console.log("bomb view")
    console.log(fullView)

}

module.exports = {render}