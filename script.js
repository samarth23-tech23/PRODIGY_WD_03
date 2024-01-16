let userSymbol = '';
let aiSymbol = '';
let currentPlayer = '';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

function selectSymbol(symbol) {
    userSymbol = symbol;
    aiSymbol = symbol === 'X' ? 'O' : 'X';
    currentPlayer = userSymbol;
    startGame();
}

function startGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status').innerText = `Your symbol: ${userSymbol} | AI symbol: ${aiSymbol}`;
    document.getElementById('symbol-selection').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
    updateBoard();
    document.getElementById('status').classList.remove('blur');
    document.getElementById('board').classList.remove('blur');
    document.getElementById('restart-btn').style.display = 'none';
}

function handleCellClick(index) {
    if (gameBoard[index] === '' && gameActive && currentPlayer === userSymbol) {
        gameBoard[index] = userSymbol;
        updateBoard();
        if (checkWinner()) {
            displayWinner(userSymbol);
            highlightWinner();
            gameActive = false;
        } else if (checkTie()) {
            displayWinner('Tie');
            gameActive = false;
        } else {
            currentPlayer = aiSymbol;
            setTimeout(makeAIMove, 500);
        }
    }
}

function makeAIMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const aiMove = emptyCells[randomIndex];
    gameBoard[aiMove] = aiSymbol;
    updateBoard();

    if (checkWinner()) {
        displayWinner(aiSymbol);
        highlightWinner();
        gameActive = false;
    } else if (checkTie()) {
        displayWinner('Tie');
        gameActive = false;
    } else {
        currentPlayer = userSymbol;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }

    return false;
}

function checkTie() {
    return gameBoard.every(cell => cell !== '');
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.innerText = gameBoard[index];
        cell.classList.remove('X', 'O', 'show', 'winner');
        if (gameBoard[index] === 'X' || gameBoard[index] === 'O') {
            cell.classList.add(gameBoard[index], 'show');
        }
    });
}

function displayWinner(winner) {
    const status = document.getElementById('status');
    const board = document.getElementById('board');
    const restartBtn = document.getElementById('restart-btn');

    status.classList.add('blur');
    board.classList.add('blur');

    if (winner === aiSymbol) {
        status.innerText = `AI (${aiSymbol}) wins!`;
    } else if (winner === 'Tie') {
        status.innerText = 'It\'s a tie!';
    } else {
        status.innerText = `Player (${winner}) wins!`;
    }

    restartBtn.style.display = 'block';

    setTimeout(() => {
        status.classList.remove('blur');
        board.classList.remove('blur');
    }, 2000); // Remove blur after 2 seconds (adjust as needed)

    document.getElementById('board').style.pointerEvents = 'none'; // Disable further clicks on the board
}

function restartGame() {
    document.getElementById('symbol-selection').style.display = 'flex';
    document.getElementById('board').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('status').innerText = ''; // Clear winner information
    document.getElementById('board').style.pointerEvents = 'auto'; // Enable clicks on the board
}
