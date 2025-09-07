function createDeck() {
    const suits = ["♥", "♦", "♣", "♠"];
    const values = [
    { name: "2", rank: 2 }, { name: "3", rank: 3 }, { name: "4", rank: 4 },
    { name: "5", rank: 5 }, { name: "6", rank: 6 }, { name: "7", rank: 7 },
    { name: "8", rank: 8 }, { name: "9", rank: 9 }, { name: "10", rank: 10 },
    { name: "J", rank: 11 }, { name: "Q", rank: 12 }, { name: "K", rank: 13 },
    { name: "A", rank: 14 }
    ];
    let deck = [];
    for (let suit of suits) {
    for (let value of values) {
        deck.push({ suit, ...value });
    }
    }
    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

class RideTheBus {
    constructor() {
    this.deck = shuffle(createDeck());
    this.stage = 0;
    this.cards = [];
    }

    drawCard() {
    return this.deck.pop();
    }

    playStage(guess) {
    let newCard = this.drawCard();
    this.cards.push(newCard);

    let result = false;

    switch (this.stage) {
        case 0: // Red or Black
        result = (guess === "red" && (newCard.suit === "♥" || newCard.suit === "♦")) ||
                    (guess === "black" && (newCard.suit === "♣" || newCard.suit === "♠"));
        break;

        case 1: // Higher or Lower
        let prev = this.cards[0];
        result = (guess === "higher" && newCard.rank > prev.rank) ||
                    (guess === "lower" && newCard.rank < prev.rank);
        break;

        case 2: // In Between or Outside
        let [a, b] = [this.cards[0].rank, this.cards[1].rank].sort((x, y) => x - y);
        result = (guess === "between" && newCard.rank > a && newCard.rank < b) ||
                    (guess === "outside" && (newCard.rank < a || newCard.rank > b));
        break;

        case 3: // Suit
        result = (newCard.suit === guess);
        break;
    }

    this.stage++;
    return { card: newCard, result };
    }
}

let game;

function startGame() {
    game = new RideTheBus();
    updateButtons();
    document.getElementById("card-area").innerText = "No cards drawn yet.";
    document.getElementById("message").innerText = "Stage 1: Red or Black?";
}

function restartGame() {
    startGame();
}

function makeGuess(guess) {
    const { card, result } = game.playStage(guess);
    const cardText = `${card.name} of ${card.suit}`;
    document.getElementById("card-area").innerText = "Drawn card: " + cardText;
    document.getElementById("message").innerText = result ? "Correct!" : "Wrong!";

    if (game.stage < 4) {
    updateButtons();
    setTimeout(() => {
        document.getElementById("message").innerText =
        stagePrompt(game.stage);
    }, 1000);
    } else {
    document.getElementById("buttons").innerHTML = "";
    setTimeout(() => {
        document.getElementById("message").innerText =
        "Game over! Click Restart to play again.";
    }, 1000);
    }
}

function updateButtons() {
    const btnArea = document.getElementById("buttons");
    btnArea.innerHTML = "";
    let options = [];

    if (game.stage === 0) options = ["red", "black"];
    if (game.stage === 1) options = ["higher", "lower"];
    if (game.stage === 2) options = ["between", "outside"];
    if (game.stage === 3) options = ["♥", "♦", "♣", "♠"];

    for (let opt of options) {
    const btn = document.createElement("button");
    btn.innerText = opt.charAt(0).toUpperCase() + opt.slice(1);
    btn.onclick = () => makeGuess(opt);
    btn.className = "gamebutton";
    btnArea.appendChild(btn);
    }
}

function stagePrompt(stage) {
    switch (stage) {
    case 0: return "Stage 1: Red or Black?";
    case 1: return "Stage 2: Higher or Lower?";
    case 2: return "Stage 3: Between or Outside?";
    case 3: return "Stage 4: Guess the Suit!";
    default: return "";
    }
}

// Start the game automatically
startGame();