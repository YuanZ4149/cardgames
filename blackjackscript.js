const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const messageEl = document.getElementById('message');

document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('restart-btn').addEventListener('click', startGame);

function createDeck() {
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return shuffle(newDeck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function renderHand(hand, element) {
  element.innerHTML = '';
  for (let card of hand) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.textContent = `${card.value}${card.suit}`;
    element.appendChild(cardEl);
  }
}

function updateScores() {
  playerScoreEl.textContent = calculateScore(playerHand);
  dealerScoreEl.textContent = '?';
}

function hit() {
  if (gameOver) return;
  playerHand.push(deck.pop());
  renderHand(playerHand, playerCardsEl);
  updateScores();

  const playerScore = calculateScore(playerHand);
  if (playerScore > 21) {
    renderHand(dealerHand, dealerCardsEl);
    endGame('You busted! Dealer wins.');
  }
}

function stand() {
  if (gameOver) return;
  // Dealer logic
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsEl);
  updateScores();
  checkWinner();
}

function checkWinner() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    endGame('You win!');
  } else if (playerScore < dealerScore) {
    endGame('Dealer wins!');
  } else {
    endGame('It\'s a tie!');
  }
}

function endGame(message) {
  dealerScoreEl.textContent = calculateScore(dealerHand);
  window.alert(message);
  gameOver = true;
  messageEl.textContent = message;
  document.getElementById('hit-btn').style.display = 'none';
  document.getElementById('stand-btn').style.display = 'none';
  document.getElementById('restart-btn').style.display = 'inline-block';
}

function startGame() {
  deck = createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;

  renderHand(playerHand, playerCardsEl);
  renderHand(dealerHand.slice(0, 1), dealerCardsEl); // hide dealer's 2nd card

  playerScoreEl.textContent = calculateScore(playerHand);
  dealerScoreEl.textContent = '?';

  messageEl.textContent = '';
  document.getElementById('hit-btn').style.display = 'inline-block';
  document.getElementById('stand-btn').style.display = 'inline-block';
  document.getElementById('restart-btn').style.display = 'none';
}

startGame();