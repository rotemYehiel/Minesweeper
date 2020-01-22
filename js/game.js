
////globals
// gBoard – Matrix contains cell objects:-----the model
var gBoard = [];
const BOOM = '💣';


// This is an object by which the board size is set (in this case:
// 4*4), and how many mines to put
var gLevel = { SIZE: 4, MINES: 2 };
// This is an object in which you can keep and update the current game state: 
// isOn – boolean, when true we let the user play shownCount: how many cells are shown markedCount: 
// how many cells are marked (with a flag) secsPassed: how many seconds passed
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// This is called when page loads
function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    console.log(gBoard);
}

// Builds the board Set mines at random locations Call setMinesNegsCount() Return the created board
function buildBoard() {
    var board = [];
    const SIZE = 4;
    for (var i = 0; i < SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true,
                i: i,
                j: j,
                neighbors: []
            };
        }
    }
    var firstBoom = board[getRandomInt(0, 3)][getRandomInt(0, 3)];
    firstBoom.isShown = true;
    firstBoom.isMine = true;
    var seconedBoom = board[getRandomInt(0, 3)][getRandomInt(0, 3)];
    seconedBoom.isMine = true;
    seconedBoom.isShown = true;
    console.log('boom1: ', firstBoom.i, ',', firstBoom.j, 'boom2: ', seconedBoom.i, ',', seconedBoom.j)

    setMinesNegsCount(board);
    return board;

}
// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board) {

    for (var idx = 0; idx < board.length; idx++) {
        var rowOfMat = board[idx];
        for (var idy = 0; idy < board[0].length; idy++) {
            var cell = rowOfMat[idy];
            var col = cell.i;
            var row = cell.j;

            for (var i = row - 1; i <= row + 1; i++) {
                if (i < 0 || i >= board.length) continue;
                for (var j = col - 1; j <= col + 1; j++) {
                    if (j < 0 || j >= board.length) continue;
                    if (i === row && j === col) continue;/////so he will not count himself
                    var cellItSelf = board[i][j];
                    if (cellItSelf.isMine === true) {
                        board[row][col].minesAroundCount++;
                        board[row][col].isShown = true;
                    }
                    var neighbor = board[i][j];
                    board[row][col].neighbors.push(neighbor);
                }
            }
        }
    }
}
// Render the board as a <table> to the page
function renderBoard(board) {
    var strHtml = '';
    var className = 'cell'
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {
            /////if isMine put a mine in it!
            if (gBoard[i][j].isMine === true) {
                className = 'boom';
                strHtml += `<td onclick="cellClicked(this,${gBoard[i][j].i},${gBoard[i][j].j})" 
                id="${gBoard[i][j].i}-${gBoard[i][j].j}" class="${className}">${gBoard[i][j].i}-${gBoard[i][j].j}</td>`;
            } else {
                className = 'cell'
                strHtml += `<td onclick="cellClicked(this,${gBoard[i][j].i},${gBoard[i][j].j})" 
                id="${gBoard[i][j].i}-${gBoard[i][j].j}" class="${className}">${gBoard[i][j].i}-${gBoard[i][j].j}</td>`;
            }
        }
        strHtml += '</tr>';
    }
    var elTbody = document.querySelector('tbody');
    elTbody.innerHTML = strHtml;
}
// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    //if i clicked u- isShow=t
    gBoard[i][j].isShown = true;
    expandShown(elCell, i, j);
    if (gBoard[i][j].isShown) {
        if (gBoard[i][j].isMine) {
            elCell.innerText = BOOM;
        } else {
            var neighborsList = gBoard[i][j].neighbors;
            for (var n = 0; n < neighborsList.length; n++) {

                var neighborObs = neighborsList[n];
                neighborObs.isShown = true;
                var neighborI = neighborObs.i;
                var neighborJ = neighborObs.j;

                ///////i need to fined my element of neighbor to send out to expandShown

                var elNeighbor = document.querySelector(`.cell${neighborI}-${neighborJ}`);
                console.log('elNeighbor: ',elNeighbor);
                expandShown(elNeighbor, neighborI, neighborJ);
            }
        }
    }
}
// Called on right click to mark a cell (suspected to be a mine) 
// Search the web (and implement) how to hide the context menu on right click
function cellMarked(elCell) {

}
// Game ends when all mines are marked and all the other cells are shown
function checkGameOver() {

}
// When user clicks a cell with no mines around, we need to open not only that cell, 
// but also its neighbors. NOTE: start with a basic implementation that only opens 
// the non-mine 1st degree neighbors 
// BONUS: if you have the time later, try to work more like the real algorithm 
// (see description at the Bonuses section below)
function expandShown(elCell, row, col) {

    var elCellChoosen = gBoard[row][col];
    elCell.innerText = elCellChoosen.minesAroundCount;

}

///making a random digit
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}