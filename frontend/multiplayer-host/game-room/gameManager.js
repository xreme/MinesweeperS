import { broadcast, appendMessage } from "./host-server.js";
import { startGame } from "./gameboard.js";
import { minesweeper } from "../../../cicada.js"

const playerName = sessionStorage.getItem('playerName');

export function handleStart(){
    var choice = document.getElementById("modeSelection").value
    switch(choice){
        case 'VS':
            startVSGame()
            break;
        default:
            return
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

    let mineCount =  parseInt(document.getElementById('bomb-count').value);
    let gridInput =  parseInt(document.getElementById('grid-size').value);
    
    if(mineCount > Math.floor((gridInput*gridInput) * 0.3)){
        mineCount = Math.floor((gridInput*gridInput) * 0.3);
        document.getElementById('bomb-count').value = mineCount
    }

    var game = minesweeper(gridInput,gridInput, mineCount);

    announce(`New Game – ${gridInput}x${gridInput} | ${mineCount} bombs`)
    startGame(game, (data)=>handleWin(data), (data)=>handleLoss(data))


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
    console.log("win")
    announce(`${playerName} finished in ${details.time}s`)
}
function handleLoss(details){
    announce(`${playerName} lost in ${details.time}s`)
}