var CROSS = "X";
var NOUGHT = "O";
var THREE_CROSSES = "XXX";
var THREE_NOUGHTS = "OOO";
var LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

exports.computerMove = function(state) {
    return null ||
        checkForWinOrDraw(state) ||
        tryToWin(state) ||
        tryToBlock(state) ||
        makeRandomMove(state);    
}

function tryToWin(state) {
    return checkForLineWithTwoPiecesAndOneEmpty(state, state.player2Piece, function(newBoard, line) {
        return {
            board: newBoard,
            gameOver: true,
            winningPlayer: 2,
            winningLine: line
        }
    });
}

function tryToBlock(state) {
    
    if (getUnoccupiedIndices(state).length === 1) {
        return null;
    }
    
    return checkForLineWithTwoPiecesAndOneEmpty(state, state.player1Piece, function(newBoard, line) {
        return {
            board: newBoard,
            gameOver: false
        }
    });
}

function checkForLineWithTwoPiecesAndOneEmpty(state, givenPiece, buildResponse) {
    
    for (var linesIndex = 0; linesIndex < LINES.length; linesIndex++) {
        var line = LINES[linesIndex];
        var indicesWithGivenPiece = [];
        var indicesOfEmptyCells = [];
        for (var lineIndex = 0; lineIndex < line.length; lineIndex++) {
            var boardIndex = line[lineIndex];
            var piece = state.board[boardIndex];
            if (piece === givenPiece) {
                indicesWithGivenPiece.push(boardIndex);
            }
            if (piece !== state.player1Piece && piece !== state.player2Piece) {
                indicesOfEmptyCells.push(boardIndex);
            }
        }
        if (indicesWithGivenPiece.length === 2 && indicesOfEmptyCells.length === 1) {
            var newBoard = setCharAt(state.board, state.player2Piece, indicesOfEmptyCells[0]);
            return buildResponse(newBoard, line);
        }
    }
    
    return null;
}

function makeRandomMove(state) {
    var unoccupiedIndices = getUnoccupiedIndices(state);
    var r = getRandomIntInclusive(0, unoccupiedIndices.length - 1);
    state.board = setCharAt(state.board, state.player2Piece, unoccupiedIndices[r]);
    var winOrDraw = checkForWinOrDraw(state);
    return winOrDraw || {
        board: state.board,
        gameOver: false
    };
}

function checkForWinOrDraw(state) {
    
    for (var i = 0; i < LINES.length; i++) {
        var line = LINES[i];
        var winningPlayer = checkForWinningLine(state, line);
        if (winningPlayer) {
            return {
                board: state.board,
                gameOver: true,
                winningPlayer: winningPlayer,
                winningLine: line
            }
        }
    }
    
    return checkForDraw(state);
}

function checkForWinningLine(state, line) {
    
    var pieces = "";
    
    for (var i = 0; i < line.length; i++) {
        var boardIndex = line[i];
        var piece = state.board[boardIndex];
        pieces += piece;
    }
    
    if (pieces === THREE_CROSSES || pieces == THREE_NOUGHTS) {
        return playerNumberFromPiece(state, pieces[0]);
    }
    
    return null;
}

function checkForDraw(state) {
    
    var occupiedCellCount = 0;
    
    for (var boardIndex = 0; boardIndex < state.board.length; boardIndex++) {
        var piece = state.board[boardIndex];
        if (piece === CROSS || piece === NOUGHT) {
            occupiedCellCount++;
        }
    }
    
    if (occupiedCellCount === state.board.length) {
        return {
            board: state.board,
            gameOver: true,
            winningPlayer: 3
        }
    }
    
    return null;
}

function getUnoccupiedIndices(state) {
    var unoccupiedIndices = [];
    for (var boardIndex = 0; boardIndex < state.board.length; boardIndex++) {
        var piece = state.board[boardIndex];
        if (piece !== CROSS && piece !== NOUGHT) {
            unoccupiedIndices.push(boardIndex);
        }
    }
    return unoccupiedIndices;
}

function playerNumberFromPiece(state, piece) {
    if (piece === state.player1Piece) return 1;
    if (piece === state.player2Piece) return 2;
    return null;
}

function setCharAt(s, ch, index) {
    var chs = [];
    for (var i = 0; i < s.length; i++) {
        chs.push(s[i]);
    }
    chs[index] = ch;
    return chs.join("");
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
