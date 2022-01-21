/* Constants */

const width = 15;
const height = 15;
const speed = 200;
const snakeColor = "#000";
const appleColor = "#ff0000";

const hitWallErrMessage = "The snake has hit the wall";
const hitSnakeErrMessage = "The snake has bit itself";

/* Render tiles */

const grid = document.querySelector(".grid");

for (let i = 0; i < width * height; i++) {
  const tile = document.createElement("div");
  tile.classList.add("tile");
  grid.appendChild(tile);
}

/* Render apple and snake */

let snakePositions = [168, 169, 170, 171]; // initial snake position
let applePosition = 100; // initial apple position

const tiles = document.querySelectorAll(".grid .tile");

const appleTile = tiles[applePosition];

appleTile.style.cssText = `
  background: ${appleColor};
  border-radius: 50%;
`;

/* Handle user input */

let inputs = [];

window.addEventListener("keydown", (e) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
    return;

  e.preventDefault();

  switch (e.key) {
    case "ArrowLeft":
      inputs.push("left");
      break;
    case "ArrowRight":
      inputs.push("right");
      break;
    case "ArrowUp":
      inputs.push("up");
      break;
    case "ArrowDown":
      inputs.push("down");
      break;
  }
});

/* Main event loop */

let startTimestamp;
let stepsTaken = 0;
let score = 0;

function main(timestamp) {
  try {
    if (startTimestamp === undefined) startTimestamp = timestamp;
    const totalElapsedTime = timestamp - startTimestamp;
    const stepsShouldHaveTaken = Math.floor(totalElapsedTime / speed);

    // if it's time to take a step
    if (stepsTaken !== stepsShouldHaveTaken) {
      step();
      stepsTaken++;

      for (const i of snakePositions) {
        const snakePart = tiles[i];
        snakePart.style.background = snakeColor;
      }

      const headPosition = snakePositions[snakePositions.length - 1];

      if (headPosition === applePosition) {
        score++;
        addNewApple();
      }
    }
  } catch (err) {
    clearInterval(game);

    const confirm = window.confirm("You lost! Do you want to play again?");

    if (confirm) location.reload();
  }
}

function step() {
  const newHeadPosition = getNextPosition();
  snakePositions.push(newHeadPosition);

  if (newHeadPosition !== applePosition) {
    const previousTail = tiles[snakePositions[0]];
    previousTail.style.background = "transparent";
    snakePositions.shift();
  }

  const head = tiles[newHeadPosition];
  head.style.background = snakeColor;
}

function getNextPosition() {
  const headPosition = snakePositions[snakePositions.length - 1];
  const snakeDirection = inputs.shift() || headDirection();

  switch (snakeDirection) {
    case "right": {
      const nextPosition = headPosition + 1;
      if (nextPosition % width === 0) throw new Error(hitWallErrMessage);
      if (snakePositions.includes(nextPosition))
        throw new Error(hitSnakeErrMessage);
      return nextPosition;
    }
    case "left": {
      const nextPosition = headPosition - 1;
      if (nextPosition % width === width - 1 || nextPosition < 0)
        throw new Error(hitWallErrMessage);
      if (snakePositions.includes(nextPosition))
        throw new Error(hitSnakeErrMessage);
      return nextPosition;
    }
    case "up": {
      const nextPosition = headPosition - width;
      if (nextPosition > width * height - 1) throw new Error(hitWallErrMessage);
      if (snakePositions.includes(nextPosition))
        throw new Error(hitSnakeErrMessage);
      return nextPosition;
    }
    case "down": {
      const nextPosition = headPosition + width;
      if (nextPosition < 0) throw new Error(hitWallErrMessage);
      if (snakePositions.includes(nextPosition))
        throw new Error(hitSnakeErrMessage);
      return nextPosition;
    }
  }
}

function headDirection() {
  const head = snakePositions[snakePositions.length - 1];
  const neck = snakePositions[snakePositions.length - 2];
  return getDirection(head, neck);
}

function getDirection(first, second) {
  if (first - 1 === second) return "right";
  if (first + 1 === second) return "left";
  if (first - width === second) return "down";
  if (first + width === second) return "up";
  throw Error("the two tile are not connected");
}

function addNewApple() {
  let newPosition;

  do {
    newPosition = Math.floor(Math.random() * width * height);
  } while (snakePositions.includes(newPosition));

  const currentAppleTile = tiles[applePosition];
  currentAppleTile.style.borderRadius = "0";
  tiles[newPosition].style.background = appleColor;
  tiles[newPosition].style.borderRadius = "50%";
  applePosition = newPosition;
}

const game = setInterval(main, speed);
