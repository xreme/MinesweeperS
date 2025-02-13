import { broadcast, appendMessage } from "./host-server.js";
import { startGame, clickTile } from "./gameboard.js";
import { minesweeper } from "../../../cicada.js"
import { setGamemodeLbl } from "./game-room.js";

const playerName = sessionStorage.getItem('playerName');
const actionQueue = []

export function handleStart(){
    var choice = document.getElementById("modeSelection").value
    switch(choice){
        case 'VS':
            startVSGame();
            break;
        case 'CO-OP':
            startCoopGame();
            break;
        default:
            return;
    }
}
function displayError(error){
    document.getElementById('Error').textContent = error
}
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
function startVSGame(){
    // read parameters
    if(!checkValues()){
        return
    }
    let gridInput =  parseInt(document.getElementById('grid-size').value) || 10;
    let mineCount =  parseInt(document.getElementById('bomb-count').value) ||  Math.floor((gridInput*gridInput) * 0.10);
    
    if(mineCount > Math.floor((gridInput*gridInput) * 0.3)){
        mineCount = Math.floor((gridInput*gridInput) * 0.3);
       
    }
    if(mineCount < Math.floor((gridInput*gridInput) * 0.1)){
        mineCount = Math.floor((gridInput*gridInput) * 0.1);
    }
    document.getElementById('bomb-count').value = mineCount
    document.getElementById("grid-size").value = gridInput
    var game = minesweeper(gridInput,gridInput, mineCount);

    announce(`VS - ${gridInput}x${gridInput} | ${mineCount} bombs`)
    broadcast({
        header: "startGame",
        body:{
            gamemode: "VS",
            gameInstance: game
        }
    })
    setGamemodeLbl("VS Mode")
    startGame(game, (data)=>handleWin(data), (data)=>handleLoss(data))
}
function startCoopGame(){
     // read parameters
     if(!checkValues()){
        return
    }
    let gridInput =  parseInt(document.getElementById('grid-size').value) || 10;
    let mineCount =  parseInt(document.getElementById('bomb-count').value) ||  Math.floor((gridInput*gridInput) * 0.10);
    
    if(mineCount > Math.floor((gridInput*gridInput) * 0.3)){
        mineCount = Math.floor((gridInput*gridInput) * 0.3);
       
    }
    if(mineCount < Math.floor((gridInput*gridInput) * 0.1)){
        mineCount = Math.floor((gridInput*gridInput) * 0.1);
    }
    document.getElementById('bomb-count').value = mineCount
    document.getElementById("grid-size").value = gridInput
    var game = minesweeper(gridInput,gridInput, mineCount);

    announce(`Co-op - ${gridInput}x${gridInput} | ${mineCount} bombs`)
    broadcast({
        header: "startGame",
        body:{
            gamemode: "CO-OP",
            gameInstance: game
        }
    })
    setGamemodeLbl("CO-OP")
    startGame(game, (data)=>handleWin(data), (data=>handleLoss(data)),'CO-OP',(data)=>coopTileClick(data))
}


function announce(msg){
    broadcast({
        header:"chatMessage",
        body:{
            from:"[SERVER]",
            messageContent: `${msg}`
        }
    })
    appendMessage("[SERVER]", msg)
}
function handleWin(details){
    announce(`${playerName} finished in ${details.time}s`)
}
function handleLoss(details){
    announce(`${playerName} lost in ${details.time}s`)
}

export function handleCoopAction(data){
    console.log(data)
    coopTileClick(data.data.data)
}
export function processActionQueue(){
   console.log("action queue", actionQueue)
    while (actionQueue.length > 0){
        let action = actionQueue[0];
        try{
            clickTile(action.data.row, action.data.col, action.data.flagMode);
            actionQueue.shift();
        }
        catch(error){
            console.log("Failed to process action:", error);
            actionQueue.shift();
        }
   }
}
export function coopTileClick(data){
    //clickTile(data.row, data.col, data.flagMode)
    let actionObj = {
        action: 'click',
        data: data
    }
    actionQueue.push(actionObj)
    console.log("action queue", actionQueue)
    broadcast({
        header: "CoopAction",
        body:actionObj
    })
    processActionQueue()
}