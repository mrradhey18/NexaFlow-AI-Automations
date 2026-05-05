'use strict';

const PLAYER = 'X';
const AI     = 'O';
const EMOJI  = { [PLAYER]: '🦷', [AI]: '🦠' };
const WINS   = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = Array(9).fill(null);
let gameActive = false;
let aiThinking = false;
let difficulty = 'easy';
let score = { you: 0, ai: 0, draw: 0 };

const cells      = [...document.querySelectorAll('.cell')];
const turnBar    = document.getElementById('turn-bar');
const turnText   = document.getElementById('turn-text');
const overlay    = document.getElementById('result-overlay');
const resultEmoji= document.getElementById('result-emoji');
const resultMsg  = document.getElementById('result-msg');
const btnAgain   = document.getElementById('btn-again');
const btnRestart = document.getElementById('btn-restart');
const scoreYou   = document.getElementById('score-you');
const scoreAi    = document.getElementById('score-ai');
const scoreDraw  = document.getElementById('score-draw');
const btnEasy    = document.getElementById('btn-easy');
const btnMedium  = document.getElementById('btn-medium');

/* ── Start ─────────────────────────────────────────────── */
function startGame() {
  board = Array(9).fill(null);
  gameActive = true;
  aiThinking = false;
  overlay.hidden = true;
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
    c.setAttribute('aria-label', `Cell ${+c.dataset.index + 1}`);
  });
  setTurn('Your turn 🦷');
  turnBar.classList.remove('thinking');
}
startGame();

/* ── Cell interaction ──────────────────────────────────── */
cells.forEach(cell => {
  cell.addEventListener('click', () => pick(cell));
  cell.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(cell); }
  });
});

function pick(cell) {
  const idx = +cell.dataset.index;
  if (!gameActive || aiThinking || board[idx]) return;
  place(idx, PLAYER);
  const r = checkResult();
  if (r) { end(r); return; }
  doAI();
}

/* ── Place ─────────────────────────────────────────────── */
function place(idx, who) {
  board[idx] = who;
  const c = cells[idx];
  c.textContent = EMOJI[who];
  c.classList.add('taken', who === PLAYER ? 'placed-you' : 'placed-ai');
  c.setAttribute('aria-label', who === PLAYER ? 'Tooth' : 'Germ');
}

/* ── AI ────────────────────────────────────────────────── */
function doAI() {
  aiThinking = true;
  turnBar.classList.add('thinking');
  setTurn('<span class="dots">Germs thinking<span>.</span><span>.</span><span>.</span></span>');
  setTimeout(() => {
    const mv = difficulty === 'medium' ? mediumMove() : randomMove();
    if (mv !== -1) place(mv, AI);
    aiThinking = false;
    const r = checkResult();
    if (r) { end(r); return; }
    turnBar.classList.remove('thinking');
    setTurn('Your turn 🦷');
  }, 700 + Math.random() * 200);
}

function randomMove() {
  const empty = board.reduce((a,v,i) => v ? a : [...a,i], []);
  return empty.length ? empty[Math.floor(Math.random()*empty.length)] : -1;
}

function mediumMove() {
  const aiWin = findWin(AI);   if (aiWin !== -1) return aiWin;
  const block = findWin(PLAYER);if (block !== -1) return block;
  const pref  = [4,0,2,6,8,1,3,5,7];
  for (const i of pref) if (!board[i]) return i;
  return -1;
}

function findWin(who) {
  for (const [a,b,c] of WINS) {
    const vals = [board[a], board[b], board[c]];
    const empty = [a,b,c].filter(i => !board[i]);
    if (vals.filter(v => v === who).length === 2 && empty.length === 1) return empty[0];
  }
  return -1;
}

/* ── Check result ──────────────────────────────────────── */
function checkResult() {
  for (const combo of WINS) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[b] === board[c])
      return { winner: board[a], combo };
  }
  if (board.every(Boolean)) return { winner: 'draw' };
  return null;
}

/* ── End game ──────────────────────────────────────────── */
function end({ winner, combo }) {
  gameActive = false;
  if (winner !== 'draw') {
    const isAI = winner === AI;
    combo.forEach(i => {
      cells[i].classList.add('win-cell');
      cells[i].classList.add(isAI ? 'win-ai' : 'win-you');
    });
  }
  setTimeout(() => showResult(winner), winner === 'draw' ? 150 : 550);
}

function showResult(winner) {
  if (winner === PLAYER) {
    resultEmoji.textContent = '😄';
    resultMsg.textContent   = 'You protected the smile!';
    score.you++;
  } else if (winner === AI) {
    resultEmoji.textContent = '😬';
    resultMsg.textContent   = 'Germs took over! Try again.';
    score.ai++;
  } else {
    resultEmoji.textContent = '🤝';
    resultMsg.textContent   = "It's a tie — great battle!";
    score.draw++;
  }
  scoreYou.textContent  = score.you;
  scoreAi.textContent   = score.ai;
  scoreDraw.textContent = score.draw;
  overlay.hidden = false;
}

/* ── Turn text ─────────────────────────────────────────── */
function setTurn(html) { turnText.innerHTML = html; }

/* ── Difficulty ────────────────────────────────────────── */
function setDiff(mode) {
  difficulty = mode;
  btnEasy.classList.toggle('active',   mode === 'easy');
  btnMedium.classList.toggle('active', mode === 'medium');
  btnEasy.setAttribute('aria-pressed',   mode === 'easy');
  btnMedium.setAttribute('aria-pressed', mode === 'medium');
  startGame();
}
btnEasy.addEventListener('click',   () => setDiff('easy'));
btnMedium.addEventListener('click', () => setDiff('medium'));

/* ── Buttons ───────────────────────────────────────────── */
btnAgain.addEventListener('click',   startGame);
btnRestart.addEventListener('click', startGame);
