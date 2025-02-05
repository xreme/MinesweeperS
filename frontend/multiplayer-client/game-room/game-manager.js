import { minesweeper } from "../../../cicada.js";
import { startGame } from "./gameboard.js";
import { sendData } from "./game-client.js";

// document.addEventListener('DOMContentLoaded',()=>{
//     var game = minesweeper(10,10,10)
//     startGame(game, null, null)
// })
export function startVSGame(gameInfo){
    console.log("starting game...")
    console.log(gameInfo)

    const b = gameInfo.grid.length * 2;
    const kb = (b / 1024).toFixed(2);
    console.log(`${kb}KB`);

    var game = minesweeper(gameInfo.gridWidth,
        gameInfo.gridLength,
        gameInfo.bombCount,
        gameInfo.grid
    )
    startGame(game, (data)=>handleWin(data), (data)=>handleLoss(data), gameInfo.grid)
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