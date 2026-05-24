const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');
const cells = Array.from(document.querySelectorAll('.cell'));

let board = Array(9).fill(null);
let currentPlayer = 'X';
let running = true;

const WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function updateStatus(text){
  statusEl.textContent = text;
}

function handleCellClick(e){
  const index = Number(e.currentTarget.dataset.index);
  if (!running || board[index]) return;
  board[index] = currentPlayer;
  e.currentTarget.classList.add(currentPlayer.toLowerCase());
  e.currentTarget.textContent = currentPlayer;
  if (checkWin()) return endGame(`${currentPlayer} wins`);
  if (board.every(Boolean)) return endGame('Draw');
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function checkWin(){
  return WIN_COMBINATIONS.some(comb => {
    const [a,b,c] = comb;
    if (!board[a] || !board[b] || !board[c]) return false;
    return board[a] === board[b] && board[b] === board[c];
  });
}

function highlightWinningCombo(){
  WIN_COMBINATIONS.forEach(comb => {
    const [a,b,c] = comb;
    if (board[a] && board[a] === board[b] && board[b] === board[c]){
      [a,b,c].forEach(i => cells[i].classList.add('winner'));
    }
  });
}

function endGame(message){
  running = false;
  if (message.includes('wins')){
    highlightWinningCombo();
  }
  updateStatus(message);
}

function reset(){
  board.fill(null);
  currentPlayer = 'X';
  running = true;
  cells.forEach(c => { c.textContent = ''; c.classList.remove('x','o','winner'); });
  updateStatus(`Player ${currentPlayer}'s turn`);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', reset);

// Accessibility: allow keyboard play with Enter/Space
cells.forEach(cell => {
  cell.setAttribute('tabindex', '0');
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});

updateStatus(`Player ${currentPlayer}'s turn`);
