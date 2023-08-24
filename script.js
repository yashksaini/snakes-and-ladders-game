const board = document.querySelector("#board");

// For the movement of pots
const colorsPots = ["redPot", "bluePot", "greenPot", "yellowPot"];

// For Audio
const drop = document.querySelector("#drop");
const ladder = document.querySelector("#ladder");
const snake = document.querySelector("#snake");
const diceAudio = document.querySelector("#diceAudio");
const success = document.querySelector("#success");

// For showing the winner message
const modal = document.querySelector("#modal");
const wname = document.querySelector("#wname");
const wimg = document.querySelector("#wimg");

// Path of ladders
let ladders = [
  [4, 16, 17, 25],
  [21, 39],
  [29, 32, 33, 48, 53, 67, 74],
  [43, 57, 64, 76],
  [63, 62, 79, 80],
  [71, 89],
];
// Path for snakes
let snakes = [
  [30, 12, 13, 7],
  [47, 46, 36, 35, 27, 15],
  [56, 44, 38, 23, 19],
  [73, 69, 51],
  [82, 79, 62, 59, 42],
  [92, 88, 75],
  [98, 97, 83, 84, 85, 77, 64, 76, 65, 55],
];

// Dice probabilities array
const diceArray = [1, 2, 3, 4, 5, 6];
// Used for looping players chances
const playerNumbers = [1, 2, 3, 4];
// Dice icon according to random dice value
const diceIcons = [
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six",
];
// Array of object for tracking user
const players = [
  {
    name: "Player 1",
    image: 1,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 2",
    image: 0,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 3",
    image: 3,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
  {
    name: "Player 4",
    image: 4,
    lastDice: 0,
    score: 0,
    lastMovement: 0,
  },
];
// Multiple screens on the page
const screen1 = document.querySelector("#screen1");
const screen2 = document.querySelector("#screen2");
const screen3 = document.querySelector("#screen3");

// Tracking the current player
let currentPlayer = 1;

// Create a board where pots are placed
const drawBoard = () => {
  let content = "";
  let boxCount = 101;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (i % 2 === 0) boxCount--;
      content += `<div class="box" id="potBox${boxCount}"></div>`;
      if (i % 2 != 0) boxCount++;
    }
    boxCount -= 10;
  }
  board.innerHTML = content;
};

// Initial state at the beginning of the game
const initialState = () => {
  drawBoard();
  screen2.style.display = "none";
  screen3.style.display = "none";
};

initialState();

// Select players for game
let playersCount = 2;
const selectBox = document.getElementsByClassName("selectBox");
const selectPlayers = (value) => {
  selectBox[playersCount - 2].className = "selectBox";
  selectBox[value - 2].className = "selectBox selected";
  playersCount = value;
};

// To start the game
const start = () => {
  screen1.style.display = "none";
  screen2.style.display = "block";
  hideUnwantedPlayers();
};

// To back user to previous screen
const back = () => {
  screen2.style.display = "none";
  screen1.style.display = "block";
  resetPlayersCount();
};

// Next the user from screen 2 to screen 3
const next = () => {
  screen2.style.display = "none";
  screen3.style.display = "block";
  hideFinalPlayers();
  displayNames();
  disableDices();
};

// Reset the number of players in the add profile screen
const resetPlayersCount = () => {
  for (let i = 3; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "flex";
  }
};
// Hide unwanted Players according to the player count
const hideUnwantedPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "card" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Hide the final screen 3 players
const hideFinalPlayers = () => {
  for (let i = playersCount + 1; i < 5; i++) {
    let x = "playerCard" + i;
    document.getElementById(x).style.display = "none";
  }
};
// Display the name and profile icon for the users
const displayNames = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    const baseURL = "images/avatars/";
    let x = "displayName" + i;
    let y = "avatar" + i;
    document.getElementById(x).innerHTML = players[i - 1].name;
    document.getElementById(y).src = baseURL + players[i - 1].image + ".png";
  }
};
// Update the name and profile icon for the users
const updateUserProfile = (playerNo, value) => {
  // Change profile to next profile in order
  const baseURL = "images/avatars/";
  if (value === 1) {
    players[playerNo - 1].image = (players[playerNo - 1].image + 1) % 8;
  } else {
    if (players[playerNo - 1].image === 0) {
      players[playerNo - 1].image = 7;
    } else {
      players[playerNo - 1].image = Math.abs(
        (players[playerNo - 1].image - 1) % 8
      );
    }
  }
  let x = "profile" + playerNo;
  document.getElementById(x).src =
    baseURL + players[playerNo - 1].image + ".png";
};
// Change the name of the player from input box
const changeName = (playerNo) => {
  let x = "name" + playerNo;
  let value = document.getElementById(x).value;
  if (value.length > 0) {
    players[playerNo - 1].name = value;
  } else {
    players[playerNo - 1].name = "Player" + playerNo;
  }
};
// Clean the board with no pots
const resetBoard = () => {
  for (let i = 0; i < 100; i++) {
    let x = i + 1;
    document.getElementById("potBox" + x).innerHTML = "";
  }
};
// Refresh the board after every dice roll
const updateBoard = () => {
  resetBoard();
  for (let i = 0; i < playersCount; i++) {
    if (players[i].score != 0) {
      let x = "potBox" + players[i].score;
      document.getElementById(
        x
      ).innerHTML += `<div class="pot ${colorsPots[i]}" >`;
    }
  }
};

// Used for moving pot from one place to another
const movePot = (value, playerNumber) => {
  const playerValue = players[playerNumber - 1].score;
  let end = playerValue + value;
  if (end < 101) {
    if (end === 100) {
      setTimeout(() => {
        modal.className = "modal";
        success.play();
        const baseURL = "images/avatars/";
        wimg.src = baseURL + players[playerNumber - 1].image + ".png";
        wname.innerHTML = players[playerNumber - 1].name;
      }, value * 400);
    }
    var t = setInterval(() => {
      players[playerNumber - 1].score++;
      drop.currentTime = 0;
      drop.play();
      updateBoard();
      if (players[playerNumber - 1].score === end) {
        clearInterval(t);
      }
    }, 400);
    setTimeout(() => {
      checkLadder(players[playerNumber - 1].score, playerNumber);
      checkSnake(players[playerNumber - 1].score, playerNumber);
    }, 400 * value);
  }
};

// For random dice value
const rollDice = (playerNo) => {
  if (playerNo === currentPlayer) {
    diceAudio.play();
    const diceNumber = diceArray[Math.floor(Math.random() * diceArray.length)];
    // const diceNumber = 100;
    let x = "dice" + playerNo;

    document.getElementById(x).innerHTML = `<i class="diceImg fas ${
      diceIcons[diceNumber - 1]
    }"></i>`;
    // players[playerNo - 1].score += diceNumber;
    let tempCurrentPlayer = currentPlayer;
    currentPlayer = 0;
    // Move the current players pot
    setTimeout(() => {
      movePot(diceNumber, tempCurrentPlayer);
    }, 1000);
    setTimeout(() => {
      currentPlayer = playerNumbers[tempCurrentPlayer % playersCount];
      document.getElementById("dice" + currentPlayer).style.color = "";
      disableDices();
    }, 2000 + diceNumber * 400);
  }
};
// Disable Other player's dice that are not current player
const disableDices = () => {
  for (let i = 1; i < playersCount + 1; i++) {
    if (currentPlayer != i) {
      let x = "dice" + i;
      document.getElementById(x).style.color = "grey";
    }
  }
};

// Check the current player is on ladder or not
const checkLadder = (value, playerNumber) => {
  for (let i = 0; i < ladders.length; i++) {
    if (ladders[i][0] === value) {
      specialMove(i, playerNumber);
    }
  }
};
// Check the current player is on snake or not
const checkSnake = (value, playerNumber) => {
  for (let i = 0; i < snakes.length; i++) {
    if (snakes[i][0] === value) {
      specialMoveSnake(i, playerNumber);
    }
  }
};
// Move the pot on the ladder
const specialMove = (value, playerNumber) => {
  let i = 0;
  var t = setInterval(() => {
    players[playerNumber - 1].score = ladders[value][i];
    ladder.play();
    updateBoard();
    i++;
    if (i === ladders[value].length) {
      clearInterval(t);
    }
  }, 400);
};
// Move the pot according to snake
const specialMoveSnake = (value, playerNumber) => {
  let i = 0;
  snake.play();
  var t = setInterval(() => {
    players[playerNumber - 1].score = snakes[value][i];
    updateBoard();
    i++;
    if (i === snakes[value].length) {
      clearInterval(t);
    }
  }, 400);
};
