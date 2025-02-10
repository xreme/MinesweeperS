import { minesweeper } from "../../../cicada.js";
import { startGame, clickTile } from "./gameboard.js";
import { sendData } from "./game-client.js";
import { setGamemodeLbl } from "./game-room.js";

// document.addEventListener('DOMContentLoaded',()=>{
//     var game = minesweeper(10,10,10)
//     startGame(game, null, null)
// })
export function startVSGame(gameInfo){
    var game = minesweeper(
        gameInfo.gridWidth,
        gameInfo.gridLength,
        gameInfo.bombCount,
        gameInfo.grid
    )
    setGamemodeLbl('VS Mode')
    startGame(game, (data)=>handleWin(data), (data)=>handleLoss(data), gameInfo.grid)
}
export function startCoopGame(gameInfo){
    var game = minesweeper(
        gameInfo.gridWidth,
        gameInfo.gridLength,
        gameInfo.bombCount,
        gameInfo.grid
    )
    setGamemodeLbl('CO-OP')
    startGame(game, (data)=>handleWin(data), (data)=>handleLoss(data), 'CO-OP',(data)=>coopTileClick(data))
    
}
function handleLoss(details){
    sendData({
        header: "gameResult",
        body: {
            result: details.result,
            time: details.time
        }
    })
}
function handleWin(details){
    sendData({
        header: "gameResult",
        body: {
            result: details.result,
            time: details.time
        }
    })
}
export function coopTileClick(data){
    console.log(data)
    sendData({
        header:"CoopAction",
        body:{
            action: 'click',
            data: data
        }
    })
}
export function handleCoopAction(data){
    let obj = JSON.parse(data)
    clickTile(obj.body.data.row,obj.body.data.col,obj.body.data.flagMode )
}