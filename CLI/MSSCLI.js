const {minesweeper} = require("../cicada")
const {render} = require("./cCLI")
const readline = require('readline');
const board = minesweeper(6,6,3)
console.log("Welcome to MinesweeperS!")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function handleInput(answer){
    switch(answer){
        
        case 'f':
            console.log("toggling flag")
            board.toggleFlag();
            break;
        default:
            let coords = parseCoordinates(answer);
            let val  = board.clickTile(coords);
            if (val == 'x'){
                gameOver()
            }
            if (val == "winner"){
                winner()
            }
    }
    console.clear()
    console.log("Flag Mode: ", board.getFlagMode())
    render(board)
}
function readInput(){
    rl.question('Input: ', (answer) => {
        console.log(`You entered: ${answer}`);
        handleInput(answer);
        readInput();
    });
}
function gameOver(){
    console.clear()
    render(board)
    console.log("GAME OVER !")
    process.exit()
}
function winner(){
    console.clear()
    render(board)
    console.log("Winner")
    process.exit()
}
function parseCoordinates(coordString) {
    return coordString.split(',').map(num => parseInt(num));
}
console.clear()
render(board)
readInput()


