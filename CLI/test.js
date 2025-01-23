const {minesweeper} = require("../cicada")
const {render} = require("./cCLI")

console.clear()

let board = minesweeper(6,6,0)
 board.toggleFlag()
 board.clickTile([3,2])
 board.toggleFlag() 
//board.clickTile([3,3])
//console.log(board.clickTile([5,4]))
// board.clickTile([0,1])
// board.clickTile([0,2])
 
// board.clickTile([1,3])
// board.clickTile([5,1])
// board.toggleFlag()
render(board)